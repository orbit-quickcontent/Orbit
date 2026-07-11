import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List, Any

# Create SocketIO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Create FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Socket.IO to FastAPI app
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# In-memory tracking
online_partners = {} # partner_id -> set of socket_ids
socket_subscriptions = {} # socket_id -> booking_id
socket_partner_ids = {} # socket_id -> partner_id

@sio.event
async def connect(sid, environ):
    print(f"[WS] Socket connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"[WS] Socket disconnected: {sid}")
    partner_id = socket_partner_ids.get(sid)
    if partner_id:
        if partner_id in online_partners:
            online_partners[partner_id].discard(sid)
            if not online_partners[partner_id]:
                del online_partners[partner_id]
        del socket_partner_ids[sid]
    if sid in socket_subscriptions:
        del socket_subscriptions[sid]

@sio.on('partner:online')
async def partner_online(sid, data):
    partner_id = data.get('partnerId')
    if not partner_id:
        return
    print(f"[WS] Partner online: {partner_id} (socket: {sid})")
    if partner_id not in online_partners:
        online_partners[partner_id] = set()
    online_partners[partner_id].add(sid)
    socket_partner_ids[sid] = partner_id

@sio.on('partner:offline')
async def partner_offline(sid, data):
    partner_id = data.get('partnerId')
    if not partner_id:
        return
    print(f"[WS] Partner offline: {partner_id} (socket: {sid})")
    if partner_id in online_partners:
        online_partners[partner_id].discard(sid)
        if not online_partners[partner_id]:
            del online_partners[partner_id]
    if sid in socket_partner_ids:
        del socket_partner_ids[sid]

@sio.on('client:subscribe')
async def client_subscribe(sid, data):
    booking_id = data.get('bookingId')
    if not booking_id:
        return
    print(f"[WS] Client subscribed to booking: {booking_id} (socket: {sid})")
    sio.enter_room(sid, f"booking:{booking_id}")
    socket_subscriptions[sid] = booking_id

# --- REST endpoints for internal communications ---

class DispatchPayload(BaseModel):
    bookingId: str
    partnerIds: List[str]
    booking: Any
    round: int

@app.post("/internal/dispatch")
async def internal_dispatch(payload: DispatchPayload):
    print(f"[WS] Internal Dispatch: booking:{payload.bookingId} to partners: {payload.partnerIds}")
    for partner_id in payload.partnerIds:
        sids = online_partners.get(partner_id, [])
        for sid in sids:
            await sio.emit('booking:dispatched', {
                'booking': payload.booking,
                'dispatchId': payload.bookingId,
                'round': payload.round
            }, to=sid)
    return {"success": True}

class AcceptPayload(BaseModel):
    bookingId: str
    partnerId: str
    partnerName: str
    booking: Any

@app.post("/internal/accept")
async def internal_accept(payload: AcceptPayload):
    print(f"[WS] Internal Accept: booking:{payload.bookingId} accepted by partner:{payload.partnerId}")
    
    # Notify subscribed clients
    await sio.emit('booking:partner-assigned', {
        'bookingId': payload.bookingId,
        'partnerId': payload.partnerId,
        'partnerName': payload.partnerName
    }, room=f"booking:{payload.bookingId}")

    # Notify other online partners to remove the dispatch card
    for online_partner_id, sids in online_partners.items():
        if online_partner_id != payload.partnerId:
            for sid in sids:
                await sio.emit('booking:accepted-by-other', {
                    'bookingId': payload.bookingId,
                    'acceptedByPartnerId': payload.partnerId
                }, to=sid)
    return {"success": True}

class NotifyPayload(BaseModel):
    bookingId: str
    event: str
    payload: Any

@app.post("/internal/notify-client")
async def internal_notify_client(payload: NotifyPayload):
    print(f"[WS] Internal notify: booking:{payload.bookingId} -> event: {payload.event}")
    await sio.emit(payload.event, payload.payload, room=f"booking:{payload.bookingId}")
    return {"success": True}

@app.get("/internal/partners/{partner_id}/status")
async def check_partner_status(partner_id: str):
    is_online = partner_id in online_partners
    return {"partnerId": partner_id, "isOnline": is_online}

def start_ws_server():
    print("[WS] Starting Socket.IO WebSocket server on port 3003...")
    uvicorn.run(socket_app, host="0.0.0.0", port=3003)

if __name__ == "__main__":
    start_ws_server()
