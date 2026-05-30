import { createServer, IncomingMessage, ServerResponse } from 'http'
import { Server, Socket } from 'socket.io'

// ─── In-Memory State ───────────────────────────────────────────────────────────
const connectedPartners = new Map<string, string>()        // partnerId → socketId
const partnerRooms = new Map<string, Set<string>>()         // partnerId → Set<dispatchId>
const clientSubscriptions = new Map<string, string>()       // bookingId → socketId

// Track dispatchId → bookingId for acceptance lookups
const dispatchBookingMap = new Map<string, string>()        // dispatchId → bookingId

// Track bookingId → Set<dispatchId> to know which dispatches belong to a booking
const bookingDispatches = new Map<string, Set<string>>()    // bookingId → Set<dispatchId>

// Track dispatchId → Set<partnerId> who received that dispatch
const dispatchPartners = new Map<string, Set<string>>()     // dispatchId → Set<partnerId>

// Track which partner accepted which booking
const bookingAcceptances = new Map<string, string>()        // bookingId → partnerId

// ─── Socket.io Server (created first, io reference needed in REST handlers) ────

// Create HTTP server with REST handler as the default callback
// socket.io will wrap this and only intercept requests to its own path
const httpServer = createServer(restHandler)

const io = new Server(httpServer, {
  // Default path: /socket.io/ — keeps REST endpoints on /internal/* free
  path: '/socket.io/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// ─── REST Endpoint Handler ─────────────────────────────────────────────────────

function restHandler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const pathname = url.pathname

  // Only handle /internal/* — everything else falls through to socket.io
  if (!pathname.startsWith('/internal')) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found. Use /internal/* endpoints or connect via socket.io.' }))
    return
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  // ─── POST /internal/dispatch ────────────────────────────────────────────
  if (req.method === 'POST' && pathname === '/internal/dispatch') {
    readBody(req, (body) => {
      try {
        const { bookingId, partnerIds, booking, round } = JSON.parse(body)
        if (!bookingId || !Array.isArray(partnerIds) || !booking) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing required fields: bookingId, partnerIds, booking' }))
          return
        }

        const dispatchId = `disp-${bookingId}-r${round || 1}`
        let dispatchedCount = 0

        // Track dispatch
        dispatchBookingMap.set(dispatchId, bookingId)

        if (!bookingDispatches.has(bookingId)) {
          bookingDispatches.set(bookingId, new Set())
        }
        bookingDispatches.get(bookingId)!.add(dispatchId)

        if (!dispatchPartners.has(dispatchId)) {
          dispatchPartners.set(dispatchId, new Set())
        }

        for (const partnerId of partnerIds) {
          dispatchPartners.get(dispatchId)!.add(partnerId)

          // Add to partner's pending rooms
          if (!partnerRooms.has(partnerId)) {
            partnerRooms.set(partnerId, new Set())
          }
          partnerRooms.get(partnerId)!.add(dispatchId)

          // Emit to the partner's room
          io.to(`partner:${partnerId}`).emit('booking:dispatched', {
            booking,
            dispatchId,
            round: round || 1,
          })

          dispatchedCount++
          console.log(`[REST] Dispatched booking ${bookingId} to partner ${partnerId} (round ${round || 1})`)
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ dispatched: dispatchedCount }))
      } catch (err) {
        console.error('[REST] /internal/dispatch error:', err)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON body' }))
      }
    })
    return
  }

  // ─── POST /internal/notify-client ───────────────────────────────────────
  if (req.method === 'POST' && pathname === '/internal/notify-client') {
    readBody(req, (body) => {
      try {
        const { bookingId, event, payload } = JSON.parse(body)
        if (!bookingId || !event || !payload) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing required fields: bookingId, event, payload' }))
          return
        }

        const clientSocketId = clientSubscriptions.get(bookingId)
        if (clientSocketId) {
          io.to(clientSocketId).emit(event, payload)
          console.log(`[REST] Notified client for booking ${bookingId} with event ${event}`)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ notified: true }))
        } else {
          console.log(`[REST] No client subscribed for booking ${bookingId}`)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ notified: false, reason: 'No client subscribed' }))
        }
      } catch (err) {
        console.error('[REST] /internal/notify-client error:', err)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON body' }))
      }
    })
    return
  }

  // ─── POST /internal/notify-partners ─────────────────────────────────────
  if (req.method === 'POST' && pathname === '/internal/notify-partners') {
    readBody(req, (body) => {
      try {
        const { partnerIds, event, payload } = JSON.parse(body)
        if (!Array.isArray(partnerIds) || !event || !payload) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing required fields: partnerIds, event, payload' }))
          return
        }

        let notifiedCount = 0
        for (const partnerId of partnerIds) {
          io.to(`partner:${partnerId}`).emit(event, payload)
          notifiedCount++
        }

        console.log(`[REST] Notified ${notifiedCount} partners with event ${event}`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ notified: notifiedCount }))
      } catch (err) {
        console.error('[REST] /internal/notify-partners error:', err)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON body' }))
      }
    })
    return
  }

  // ─── GET /internal/online-partners ──────────────────────────────────────
  if (req.method === 'GET' && pathname === '/internal/online-partners') {
    const onlinePartnerIds = Array.from(connectedPartners.keys())
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ partners: onlinePartnerIds, count: onlinePartnerIds.length }))
    return
  }

  // 404 for unknown /internal/* paths
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
}

// ─── Socket.io Connection Handling ─────────────────────────────────────────────

io.on('connection', (socket: Socket) => {
  console.log(`[WS] Client connected: ${socket.id}`)

  // ─── Partner Events ─────────────────────────────────────────────────────

  socket.on('partner:online', (data: { partnerId: string; latitude?: number; longitude?: number }) => {
    const { partnerId } = data
    console.log(`[WS] Partner online: ${partnerId} (socket: ${socket.id})`)

    // Remove old mapping if partner was connected on another socket
    const oldSocketId = connectedPartners.get(partnerId)
    if (oldSocketId && oldSocketId !== socket.id) {
      const oldSocket = io.sockets.sockets.get(oldSocketId)
      if (oldSocket) {
        oldSocket.leave(`partner:${partnerId}`)
      }
    }

    connectedPartners.set(partnerId, socket.id)
    socket.join(`partner:${partnerId}`)

    // Initialize partner rooms if not exists
    if (!partnerRooms.has(partnerId)) {
      partnerRooms.set(partnerId, new Set())
    }

    console.log(`[WS] Online partners: ${connectedPartners.size}`)
  })

  socket.on('partner:offline', (data: { partnerId: string }) => {
    const { partnerId } = data
    console.log(`[WS] Partner offline: ${partnerId}`)

    connectedPartners.delete(partnerId)
    partnerRooms.delete(partnerId)
    socket.leave(`partner:${partnerId}`)

    console.log(`[WS] Online partners: ${connectedPartners.size}`)
  })

  // ─── Booking Accept/Decline (Partner) ──────────────────────────────────

  socket.on('booking:accept', (data: { bookingId: string; partnerId: string; dispatchId: string }) => {
    const { bookingId, partnerId, dispatchId } = data
    console.log(`[WS] Partner ${partnerId} accepted booking ${bookingId} (dispatch: ${dispatchId})`)

    // Check if already accepted by someone else
    if (bookingAcceptances.has(bookingId)) {
      const acceptedBy = bookingAcceptances.get(bookingId)!
      if (acceptedBy !== partnerId) {
        // Already accepted by another partner — notify this partner
        socket.emit('booking:accepted-by-other', { bookingId, acceptedByPartnerId: acceptedBy })
        return
      }
    }

    // Store the acceptance
    bookingAcceptances.set(bookingId, partnerId)

    // Find all other partners who had this booking dispatched and notify them
    const allDispatchIds = bookingDispatches.get(bookingId)
    if (allDispatchIds) {
      for (const dId of allDispatchIds) {
        const pIds = dispatchPartners.get(dId)
        if (pIds) {
          for (const pId of pIds) {
            if (pId !== partnerId) {
              io.to(`partner:${pId}`).emit('booking:accepted-by-other', {
                bookingId,
                acceptedByPartnerId: partnerId,
              })
            }
          }
        }
      }
    }

    // Notify client if subscribed
    const clientSocketId = clientSubscriptions.get(bookingId)
    if (clientSocketId) {
      io.to(clientSocketId).emit('booking:partner-assigned', {
        bookingId,
        partnerId,
        partnerName: `Partner ${partnerId}`, // In production, look up from DB
      })

      // Also emit status update
      io.to(clientSocketId).emit('booking:status-update', {
        bookingId,
        status: 'CONFIRMED',
        previousStatus: 'PENDING',
      })
    }
  })

  socket.on('booking:decline', (data: { bookingId: string; partnerId: string; dispatchId: string }) => {
    const { bookingId, partnerId, dispatchId } = data
    console.log(`[WS] Partner ${partnerId} declined booking ${bookingId} (dispatch: ${dispatchId})`)

    // Remove this partner from the dispatch's partner set
    const pIds = dispatchPartners.get(dispatchId)
    if (pIds) {
      pIds.delete(partnerId)
    }

    // Remove from partner's pending rooms
    const pending = partnerRooms.get(partnerId)
    if (pending) {
      pending.delete(dispatchId)
    }
  })

  // ─── Client Events ─────────────────────────────────────────────────────

  socket.on('client:subscribe', (data: { bookingId: string }) => {
    const { bookingId } = data
    console.log(`[WS] Client subscribed to booking ${bookingId} (socket: ${socket.id})`)

    clientSubscriptions.set(bookingId, socket.id)
    socket.join(`booking:${bookingId}`)
  })

  // ─── Disconnect ─────────────────────────────────────────────────────────

  socket.on('disconnect', (reason) => {
    console.log(`[WS] Client disconnected: ${socket.id} (reason: ${reason})`)

    // Check if this socket belongs to a partner
    for (const [partnerId, socketId] of connectedPartners.entries()) {
      if (socketId === socket.id) {
        connectedPartners.delete(partnerId)
        partnerRooms.delete(partnerId)
        console.log(`[WS] Partner ${partnerId} disconnected. Online partners: ${connectedPartners.size}`)
        break
      }
    }

    // Check if this socket belongs to a client subscription
    for (const [bookingId, socketId] of clientSubscriptions.entries()) {
      if (socketId === socket.id) {
        clientSubscriptions.delete(bookingId)
        console.log(`[WS] Client unsubscribed from booking ${bookingId}`)
        break
      }
    }
  })

  socket.on('error', (error) => {
    console.error(`[WS] Socket error (${socket.id}):`, error)
  })
})

// ─── Helpers ───────────────────────────────────────────────────────────────────

function readBody(req: IncomingMessage, callback: (body: string) => void) {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })
  req.on('end', () => {
    callback(body)
  })
}

// ─── Start Server ──────────────────────────────────────────────────────────────

const PORT = 3003

httpServer.listen(PORT, () => {
  console.log(`[Orbit WS] Real-time notification service running on port ${PORT}`)
  console.log(`[Orbit WS] Socket.io path: /socket.io/`)
  console.log(`[Orbit WS] Internal REST endpoints:`)
  console.log(`[Orbit WS]   POST /internal/dispatch`)
  console.log(`[Orbit WS]   POST /internal/notify-client`)
  console.log(`[Orbit WS]   POST /internal/notify-partners`)
  console.log(`[Orbit WS]   GET  /internal/online-partners`)
  console.log(`[Orbit WS] Frontend connection: io({ path: '/socket.io/' }) with XTransformPort=3003`)
})

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────

function shutdown() {
  console.log('[Orbit WS] Shutting down...')
  io.disconnectSockets()
  httpServer.close(() => {
    console.log('[Orbit WS] Server closed')
    process.exit(0)
  })

  // Force close after 5 seconds
  setTimeout(() => {
    console.error('[Orbit WS] Forced shutdown after timeout')
    process.exit(1)
  }, 5000)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
