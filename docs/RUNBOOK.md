# Orbit Deployment Runbook

This guide covers local development run details and production deployments.

---

## 1. Local Development Setup

To run the REST APIs and websocket servers locally for testing Android/iOS emulators:

```bash
# 1. Start backend Redis & SQLite DB migrations
cd backend
python -m pip install -r requirements.txt
# Run Firestore verification
python test_firestore.py

# 2. Run REST API server (port 5000)
python src/main.py

# 3. Run WebSocket server in another terminal (port 3003)
python src/services/websocket_server.py
```

### Emulator configuration links
Emulators map to localhost services using the following redirect links:
- **Android emulator base link**: `http://10.0.2.2:5000/api/`
- **Android WebSocket link**: `http://10.0.2.2:3003`

---

## 2. Production Docker Deployment

Deploy the entire microservice stack using Docker Compose:

```bash
# Start backend API, WebSocket, Dashboard, and Nginx proxy
docker-compose -f docker-compose.prod.yml up --build -d
```

### System Services
- **Backend API**: port `5000` (FastAPI REST service)
- **Websocket Node**: port `3003` (Socket.IO python server)
- **Nginx**: port `80` (HTTP routing) / `443` (SSL verification)
