import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

// --- Redis Setup & Fallback ---
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
let pubClient: Redis | null = null;
let subClient: Redis | null = null;
let redisStore: Redis | null = null;
let isRedisConnected = false;

// Fallback in-memory state if Redis is offline
const memoryConnectedPartners = new Map<string, string>();        // partnerId -> socketId
const memoryClientSubscriptions = new Map<string, string>();       // bookingId -> socketId
const memoryBookingAcceptances = new Map<string, string>();        // bookingId -> partnerId

try {
  console.log(`[WS] Connecting to Redis at ${REDIS_URL}`);
  pubClient = new Redis(REDIS_URL, { maxRetriesPerRequest: 1 });
  subClient = pubClient.duplicate();
  redisStore = pubClient.duplicate();

  pubClient.on('connect', () => {
    isRedisConnected = true;
    console.log('[WS] Redis connection established');
  });

  pubClient.on('error', (err) => {
    console.warn('[WS] Redis error, using in-memory store:', err.message);
    isRedisConnected = false;
  });
} catch (err: any) {
  console.warn('[WS] Redis init failed, using in-memory store:', err.message);
}

// Helper functions for state storage (Redis-backed with memory fallback)
async function setConnectedPartner(partnerId: string, socketId: string) {
  if (isRedisConnected && redisStore) {
    await redisStore.hset('ws:connected_partners', partnerId, socketId);
  } else {
    memoryConnectedPartners.set(partnerId, socketId);
  }
}

async function removeConnectedPartner(partnerId: string) {
  if (isRedisConnected && redisStore) {
    await redisStore.hdel('ws:connected_partners', partnerId);
  } else {
    memoryConnectedPartners.delete(partnerId);
  }
}

async function getOnlinePartnerIds(): Promise<string[]> {
  if (isRedisConnected && redisStore) {
    return await redisStore.hkeys('ws:connected_partners');
  } else {
    return Array.from(memoryConnectedPartners.keys());
  }
}

async function recordBookingAcceptance(bookingId: string, partnerId: string) {
  if (isRedisConnected && redisStore) {
    await redisStore.set(`ws:booking:${bookingId}:accepted`, partnerId, 'EX', 86400);
  } else {
    memoryBookingAcceptances.set(bookingId, partnerId);
  }
}

async function getBookingAcceptance(bookingId: string): Promise<string | null> {
  if (isRedisConnected && redisStore) {
    return await redisStore.get(`ws:booking:${bookingId}:accepted`);
  } else {
    return memoryBookingAcceptances.get(bookingId) || null;
  }
}

async function subscribeClient(bookingId: string, socketId: string) {
  if (isRedisConnected && redisStore) {
    await redisStore.hset('ws:client_subscriptions', bookingId, socketId);
  } else {
    memoryClientSubscriptions.set(bookingId, socketId);
  }
}

async function getClientSubscription(bookingId: string): Promise<string | null> {
  if (isRedisConnected && redisStore) {
    return await redisStore.hget('ws:client_subscriptions', bookingId);
  } else {
    return memoryClientSubscriptions.get(bookingId) || null;
  }
}

// --- Socket.io Server Setup ---
const httpServer = createServer(restHandler);
const io = new Server(httpServer, {
  path: '/socket.io/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

if (isRedisConnected && pubClient && subClient) {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('[WS] Socket.io Redis Adapter configured');
}

// --- REST Endpoint Handler ---
function restHandler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const pathname = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && pathname === '/internal/dispatch') {
    readBody(req, async (body) => {
      try {
        const { bookingId, partnerIds, booking, round } = JSON.parse(body);
        if (!bookingId || !Array.isArray(partnerIds) || !booking) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields' }));
          return;
        }

        let dispatchedCount = 0;
        for (const partnerId of partnerIds) {
          io.to(`partner:${partnerId}`).emit('booking:dispatched', {
            booking,
            bookingId,
            dispatchId: `disp-${bookingId}-r${round || 1}`,
            round: round || 1,
          });
          dispatchedCount++;
        }

        // Notify client if subscribed
        const clientSocketId = await getClientSubscription(bookingId);
        if (clientSocketId) {
          io.to(clientSocketId).emit('booking:status-update', {
            bookingId,
            status: 'PARTNER_DISPATCHED',
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ dispatched: dispatchedCount }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/internal/accept') {
    readBody(req, async (body) => {
      try {
        const { bookingId, partnerId, partnerName } = JSON.parse(body);
        if (!bookingId || !partnerId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing fields' }));
          return;
        }

        await recordBookingAcceptance(bookingId, partnerId);

        // Notify client if subscribed
        const clientSocketId = await getClientSubscription(bookingId);
        if (clientSocketId) {
          io.to(clientSocketId).emit('booking:partner-assigned', {
            bookingId,
            partnerId,
            partnerName: partnerName || `Partner ${partnerId}`,
          });
        }

        // Notify other partners to clear card
        io.emit('booking:accepted-by-other', {
          bookingId,
          acceptedByPartnerId: partnerId,
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ accepted: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/internal/notify-client') {
    readBody(req, async (body) => {
      try {
        const { bookingId, event, payload } = JSON.parse(body);
        if (!bookingId || !event || !payload) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing fields' }));
          return;
        }

        // Emit to client room or directly
        io.to(`booking:${bookingId}`).emit(event, payload);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/internal/online-partners') {
    getOnlinePartnerIds().then((partners) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ partners, count: partners.length }));
    }).catch(() => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch online partners' }));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

// --- Socket.io Connection Handling ---
io.on('connection', (socket: Socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);

  socket.on('partner:online', async (data: { partnerId: string }) => {
    const { partnerId } = data;
    await setConnectedPartner(partnerId, socket.id);
    socket.join(`partner:${partnerId}`);
    console.log(`[WS] Partner ${partnerId} online`);
  });

  socket.on('partner:offline', async (data: { partnerId: string }) => {
    const { partnerId } = data;
    await removeConnectedPartner(partnerId);
    socket.leave(`partner:${partnerId}`);
    console.log(`[WS] Partner ${partnerId} offline`);
  });

  socket.on('client:subscribe', async (data: { bookingId: string }) => {
    const { bookingId } = data;
    await subscribeClient(bookingId, socket.id);
    socket.join(`booking:${bookingId}`);
    console.log(`[WS] Client subscribed to booking:${bookingId}`);
  });

  socket.on('disconnect', async () => {
    const partners = await getOnlinePartnerIds();
    for (const partnerId of partners) {
      if (!isRedisConnected) {
        const memorySock = memoryConnectedPartners.get(partnerId);
        if (memorySock === socket.id) {
          memoryConnectedPartners.delete(partnerId);
          console.log(`[WS] Cleaned up partner:${partnerId} on disconnect`);
        }
      } else if (redisStore) {
        const socketId = await redisStore.hget('ws:connected_partners', partnerId);
        if (socketId === socket.id) {
          await redisStore.hdel('ws:connected_partners', partnerId);
          console.log(`[WS] Cleaned up Redis partner:${partnerId} on disconnect`);
        }
      }
    }
  });
});

function readBody(req: IncomingMessage, callback: (body: string) => void) {
  let body = '';
  req.on('data', (chunk) => { body += chunk.toString(); });
  req.on('end', () => { callback(body); });
}

const PORT = 3003;
httpServer.listen(PORT, () => {
  console.log(`[Orbit WS] Real-time notification service running on port ${PORT}`);
});
