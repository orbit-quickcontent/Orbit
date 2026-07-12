from fastapi import FastAPI, Request, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os
import uvicorn
import json
import uuid
import random
import time
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional, Any

# Import firestoreDb
from services.firestore_client import firestoreDb
from services.cashfree_client import execute_payout, validate_bank_account

import firebase_admin
from firebase_admin import credentials, auth

# Initialize Firebase Admin SDK
try:
    project_id = os.getenv("FIREBASE_PROJECT_ID")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    
    if project_id and client_email and private_key:
        formatted_key = private_key.replace("\\n", "\n")
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": project_id,
            "private_key": formatted_key,
            "client_email": client_email,
            "token_url": "https://oauth2.googleapis.com/token"
        })
        firebase_admin.initialize_app(cred)
        print("[Firebase] Firebase Admin SDK initialized via env variables")
    else:
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "firebase-key.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print(f"[Firebase] Firebase Admin SDK initialized from file: {cred_path}")
        else:
            firebase_admin.initialize_app()
            print("[Firebase] Firebase Admin SDK initialized with default app credentials")
except Exception as e:
    print(f"[Firebase-Err] Failed to initialize Firebase Admin SDK: {e}")

from apscheduler.schedulers.background import BackgroundScheduler
scheduler = BackgroundScheduler()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants & Paths
PUBLIC_UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../dashboard-web-app/public/upload"))
PUBLIC_REELS_DIR = os.path.join(PUBLIC_UPLOAD_DIR, "reels")

# Ensure upload directories exist
os.makedirs(PUBLIC_REELS_DIR, exist_ok=True)

SECRET_KEY = "orbit_ultra_secure_video_pipeline_2026"

# --- Security & Token Validation Helpers ---

import hmac
import hashlib

def generate_presigned_url(url_path: str) -> str:
    if not url_path:
        return ""
    expires = int(time.time() * 1000) + 15 * 60 * 1000
    clean_path = url_path.split("?")[0]
    h = hmac.new(SECRET_KEY.encode(), f"{clean_path}:{expires}".encode(), hashlib.sha256)
    token = h.hexdigest()
    separator = "&" if "?" in url_path else "?"
    return f"{url_path}{separator}token={token}&expires={expires}"

def validate_presigned_token(url_path: str, token: Optional[str], expires_str: Optional[str]) -> bool:
    if not token or not expires_str:
        return False
    try:
        expires = int(expires_str)
    except ValueError:
        return False
    if expires < int(time.time() * 1000):
        print(f"[Presigned Security] Asset access attempt failed: Token expired.")
        return False
    clean_path = url_path.split("?")[0]
    h = hmac.new(SECRET_KEY.encode(), f"{clean_path}:{expires_str}".encode(), hashlib.sha256)
    expected_token = h.hexdigest()
    return hmac.compare_digest(token, expected_token)

# --- WS Internal Calls ---
import urllib.request

WS_HOST = os.getenv("WS_HOST", "websocket-node:3003")

def notify_ws_internal(path: str, body: dict):
    url = f"http://{WS_HOST}{path}"
    data_bytes = json.dumps(body).encode('utf-8')
    try:
        req = urllib.request.Request(
            url,
            data=data_bytes,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=5) as res:
            pass
    except Exception as e:
        fallback_url = f"http://localhost:3003{path}"
        try:
            req = urllib.request.Request(
                fallback_url,
                data=data_bytes,
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=3) as res:
                pass
        except Exception as fe:
            print(f"[WS-Notify-Err] Failed to notify websocket (host & fallback): {fe}")

# --- Global Firebase Admin Authentication Middleware ---

@app.middleware("http")
async def firebase_auth_middleware(request: Request, call_next):
    path = request.url.path
    if (
        path in ["/api/auth/send-otp", "/api/auth/verify-otp", "/api", "/docs", "/openapi.json"]
        or path.startswith("/upload/")
        or request.method == "OPTIONS"
    ):
        return await call_next(request)
        
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"detail": "Missing or invalid Authorization: Bearer token header"}
        )
        
    token = auth_header.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        request.state.user = decoded_token
    except Exception as e:
        return JSONResponse(
            status_code=401,
            content={"detail": f"Unauthorized: {e}"}
        )
        
    return await call_next(request)

# --- Cashfree Payout & Retry Logic ---

def execute_payout_for_booking(booking_id: str):
    b = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not b:
        print(f"[Payout-Err] Booking {booking_id} not found")
        return
        
    existing = firestoreDb.payoutRetries.find_unique(where={"id": booking_id})
    if existing and existing.get("status") in ["SUCCESS", "PROCESSING"]:
        return

    worker_id = b.get("partnerId") or b.get("editorId")
    if not worker_id:
        print(f"[Payout-Err] No assigned worker for booking {booking_id}")
        return

    profile = firestoreDb.partners.find_unique(where={"id": worker_id})
    role = "PARTNER"
    if not profile:
        profile = firestoreDb.editors.find_unique(where={"id": worker_id})
        role = "EDITOR"
        
    if not profile or not profile.get("encryptedAccountNumber") or not profile.get("ifscCode"):
        print(f"[Payout-Err] Bank details not linked/incomplete for worker {worker_id}")
        return

    acc_holder = profile.get("accountHolderName") or profile.get("name") or "Worker"
    acc_num = profile.get("encryptedAccountNumber")
    ifsc = profile.get("ifscCode")
    phone = profile.get("phone") or "+91 99999 99999"
    email = profile.get("email") or "worker@orbit.io"
    
    amount = 1000.0 if b.get("type") in ["editing", "media"] else 700.0
    idempotency_key = f"payout_{booking_id}_{int(time.time() * 1000)}"
    if existing:
        idempotency_key = existing.get("idempotencyKey")
        
    retry_doc = {
        "bookingId": booking_id,
        "amount": amount,
        "beneficiaryBankAccount": acc_num,
        "beneficiaryIFSC": ifsc,
        "status": "PROCESSING",
        "retryCount": existing.get("retryCount", 0) if existing else 0,
        "nextRetryAt": datetime.utcnow().isoformat() + "Z",
        "idempotencyKey": idempotency_key
    }
    
    if existing:
        firestoreDb.payoutRetries.update(where={"id": booking_id}, data=retry_doc)
    else:
        firestoreDb.payoutRetries.create({**retry_doc, "id": booking_id})

    print(f"[Cashfree-Payout] Triggering payout of ₹{amount} to {acc_holder} for {booking_id}...")
    res = execute_payout(
        transfer_id=idempotency_key,
        amount=amount,
        account_number=acc_num,
        ifsc=ifsc,
        name=acc_holder,
        phone=phone.replace("+91", "").strip(),
        email=email
    )

    if res.get("success"):
        print(f"[Cashfree-Payout-Success] Transfer succeeded for {booking_id}. Reference: {res.get('referenceId')}")
        firestoreDb.payoutRetries.update(where={"id": booking_id}, data={
            "status": "SUCCESS",
            "errorMessage": None
        })
        if role == "PARTNER":
            firestoreDb.transactions.create({
                "partnerId": worker_id,
                "bookingId": booking_id,
                "type": "EARNING",
                "amount": amount,
                "status": "COMPLETED",
                "description": f"Cashfree payout for booking {booking_id[:8]}..."
            })
    else:
        err_msg = res.get("message") or "Unknown Cashfree error"
        print(f"[Cashfree-Payout-Failed] Booking {booking_id}: {err_msg}")
        
        retry_count = existing.get("retryCount", 0) if existing else 0
        retry_count += 1
        
        backoffs = [300, 900, 3600, 21600]
        backoff = backoffs[min(retry_count - 1, len(backoffs) - 1)]
        next_time = time.time() + backoff
        next_retry_str = datetime.utcfromtimestamp(next_time).isoformat() + "Z"
        
        firestoreDb.payoutRetries.update(where={"id": booking_id}, data={
            "status": "FAILED",
            "retryCount": retry_count,
            "nextRetryAt": next_retry_str,
            "errorMessage": err_msg
        })

def check_and_retry_payouts():
    try:
        failed = firestoreDb.payoutRetries.find_many(where={"status": "FAILED"})
        pending = firestoreDb.payoutRetries.find_many(where={"status": "PENDING"})
        all_retries = failed + pending
        
        now_str = datetime.utcnow().isoformat() + "Z"
        for r in all_retries:
            next_retry = r.get("nextRetryAt")
            if not next_retry or next_retry <= now_str:
                execute_payout_for_booking(r["bookingId"])
    except Exception as e:
        print(f"[Payout-Scheduler-Err] Job check failed: {e}")

# --- Pydantic Request Models ---

class SendOtpBody(BaseModel):
    email: str

class VerifyOtpBody(BaseModel):
    email: str
    otp: str

class CreateUserBody(BaseModel):
    email: str
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    role: Optional[str] = "USER"
    brandLogo: Optional[str] = None
    brandFont: Optional[str] = None
    brandColor: Optional[str] = None
    editorRequirements: Optional[str] = None

class CreateBookingBody(BaseModel):
    userId: str
    packageId: str
    bookingDate: str
    timeSlot: str
    location: Optional[str] = None
    notes: Optional[str] = None
    razorpayPaymentId: Optional[str] = None
    type: Optional[str] = "delivery"

class AcceptBookingBody(BaseModel):
    partnerId: str

class DeclineBookingBody(BaseModel):
    partnerId: str

class SyncCompleteBody(BaseModel):
    footageUrls: List[str]
    proxyFootageUrl: Optional[str] = None
    fileName: Optional[str] = None
    fileSize: Optional[int] = None

class AcceptEditorBookingBody(BaseModel):
    editorId: str

class DeliverBookingBody(BaseModel):
    bookingId: str
    masterReelUrl: str

class PresignedUrlBody(BaseModel):
    fileName: str
    fileType: str
    bookingId: Optional[str] = None

class LinkBankBody(BaseModel):
    partnerId: str
    accountHolderName: str
    accountNumber: str
    ifscCode: str
    bankName: str
    branchName: Optional[str] = None
    panNumber: Optional[str] = None

class PartnerVerificationBody(BaseModel):
    partnerId: str
    status: str # VERIFIED or FAILED

class WithdrawBody(BaseModel):
    amount: float

# --- Secure Static Serving Middleware ---

@app.get("/upload/reels/{file_path:path}")
async def serve_secure_reels(file_path: str, request: Request):
    token = request.query_params.get("token")
    expires = request.query_params.get("expires")
    full_url_path = f"/upload/reels/{file_path}"
    
    if not validate_presigned_token(full_url_path, token, expires):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Invalid or Expired Presigned URL Token."
        )
    
    abs_path = os.path.join(PUBLIC_REELS_DIR, file_path)
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(abs_path)

# --- REST API Endpoints ---

import json

@app.get("/api")
async def api_root():
    return {"status": "ok", "service": "Orbit Unified REST Server (Python)"}

@app.post("/api/auth/send-otp")
async def send_otp(body: SendOtpBody):
    email = body.email.lower().strip()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Valid email is required")

    existing = firestoreDb.emailOtps.find_first(
        where={"email": email, "used": False, "verified": False}
    )

    otp = str(random.randint(100000, 999999))
    expires_at = (datetime.utcnow().timestamp() + 5 * 60) # 5 mins
    expires_str = datetime.utcfromtimestamp(expires_at).isoformat() + "Z"

    attempts = (existing.get("attempts") or 0) + 1 if existing else 1

    firestoreDb.emailOtps.create({
        "email": email,
        "otp": otp,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "expiresAt": expires_str,
        "verified": False,
        "attempts": attempts,
        "used": False,
        "ipAddress": "127.0.0.1",
        "userAgent": "N/A"
    })

    print(f"[OTP] Generated: {email} -> {otp}")
    
    # Always return devOtp in response for easy testing
    return {
        "success": True,
        "message": "OTP sent successfully",
        "devOtp": otp
    }

@app.post("/api/auth/verify-otp")
async def verify_otp(body: VerifyOtpBody):
    email = body.email.lower().strip()
    otp = body.otp.strip()

    record = firestoreDb.emailOtps.find_first(
        where={"email": email, "otp": otp, "used": False, "verified": False}
    )

    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Mark OTP as used
    firestoreDb.emailOtps.update(
        where={"id": record["id"]},
        data={"verified": True, "used": True}
    )

    # Check if client or partner exists
    client = firestoreDb.clientUsers.find_unique(where={"email": email})
    if client:
        return {"success": True, "role": "USER", "user": client}

    partner = firestoreDb.partnerUsers.find_unique(where={"email": email})
    if partner:
        # Load partner profile too
        profile = firestoreDb.partners.find_unique(where={"userId": partner["id"]})
        return {
            "success": True,
            "role": "PARTNER",
            "user": partner,
            "partnerProfile": profile
        }

    return {"success": True, "email": email, "newUser": True}

@app.get("/api/users")
async def list_users(email: Optional[str] = None):
    if email:
        email = email.lower().strip()
        client = firestoreDb.clientUsers.find_unique(where={"email": email})
        if client:
            return {"user": client}
        partner = firestoreDb.partnerUsers.find_unique(where={"email": email})
        if partner:
            return {"user": partner}
        return {"user": None}

    client_users = firestoreDb.clientUsers.find_many()
    partner_users = firestoreDb.partnerUsers.find_many()
    all_users = []
    
    for u in client_users + partner_users:
        bookings = firestoreDb.bookings.find_many(where={"userId": u["id"]})
        all_users.append({
            **u,
            "totalBookings": len(bookings)
        })

    all_users.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return {"users": all_users}

@app.post("/api/users")
async def create_user(body: CreateUserBody):
    email = body.email.lower().strip()
    
    # Check if user already exists
    existing = firestoreDb.clientUsers.find_unique(where={"email": email})
    if not existing:
        existing = firestoreDb.partnerUsers.find_unique(where={"email": email})
    
    if existing:
        return {"user": existing}

    target_col = firestoreDb.partnerUsers if body.role == "PARTNER" else firestoreDb.clientUsers
    user_id = "usr-" + str(uuid.uuid4())[:8]
    
    user = target_col.create({
        "id": user_id,
        "email": email,
        "name": body.name or email.split("@")[0],
        "phone": body.phone,
        "location": body.location,
        "role": body.role,
        "brandLogo": body.brandLogo,
        "brandFont": body.brandFont,
        "brandColor": body.brandColor,
        "editorRequirements": body.editorRequirements
    })

    if body.role == "PARTNER":
        # Create partner profile
        firestoreDb.partners.create({
            "id": "prt-" + str(uuid.uuid4())[:8],
            "userId": user_id,
            "location": body.location or "Mumbai",
            "latitude": 19.0596,
            "longitude": 72.8295,
            "availability": True,
            "isVerified": True, # Auto-verify for easy testing
            "rating": 5.0,
            "completedProjects": 0,
            "walletBalance": 0.0,
            "pendingClearance": 0.0,
            "totalWithdrawn": 0.0,
            "verificationStatus": "VERIFIED",
            "payoutEnabled": True
        })

    return {"user": user}

@app.get("/api/packages")
async def list_packages():
    pkgs = firestoreDb.packages.find_many()
    if not pkgs:
        # Default Seed
        pkg1 = firestoreDb.packages.create({
            "id": "pkg-personalized",
            "name": "Personalized",
            "tier": "PERSONALIZED",
            "price": 1999,
            "focus": "Individual/Event cinematic reels",
            "deliveryTime": "60-120 mins",
            "features": json.dumps([
                "Professional cinematic edit",
                "1 Reel (up to 60 sec)",
                "Color grading & transitions",
                "Background music sync"
            ]),
            "popular": False
        })
        pkg2 = firestoreDb.packages.create({
            "id": "pkg-professional",
            "name": "Professional (UGC)",
            "tier": "PROFESSIONAL",
            "price": 4999,
            "focus": "Brand-focused storytelling",
            "deliveryTime": "60-120 mins",
            "features": json.dumps([
                "All Personalized features",
                "Brand DNA integration",
                "Logo/Font matching",
                "Up to 3 Reels"
            ]),
            "popular": True
        })
        pkgs = [pkg1, pkg2]
    
    # Parse features field if stringified
    for p in pkgs:
        if isinstance(p.get("features"), str):
            try:
                p["features"] = json.loads(p["features"])
            except:
                pass
    return pkgs

@app.get("/api/bookings")
async def list_bookings(email: Optional[str] = None):
    if email:
        email = email.lower().strip()
        client = firestoreDb.clientUsers.find_unique(where={"email": email})
        if not client:
            return {"bookings": []}
        bookings = firestoreDb.bookings.find_many(where={"userId": client["id"]})
    else:
        bookings = firestoreDb.bookings.find_many()

    # Resolve details
    results = []
    for b in bookings:
        # Client info
        user_info = firestoreDb.clientUsers.find_unique(where={"id": b["userId"]})
        # Package info
        pkg = firestoreDb.packages.find_unique(where={"id": b["packageId"]})
        if pkg and isinstance(pkg.get("features"), str):
            try:
                pkg["features"] = json.loads(pkg["features"])
            except:
                pass
        
        # Partner info
        partner = None
        if b.get("partnerId"):
            p_profile = firestoreDb.partners.find_unique(where={"id": b["partnerId"]})
            if p_profile:
                p_user = firestoreDb.partnerUsers.find_unique(where={"id": p_profile["userId"]})
                partner = {
                    **p_profile,
                    "user": p_user
                }

        # Format footage urls and presigned urls
        footage_urls = []
        if b.get("footageUrls"):
            try:
                footage_urls = json.loads(b["footageUrls"])
            except:
                footage_urls = [b["footageUrls"]]
        
        master_reel = b.get("masterReelUrl")
        if master_reel:
            master_reel = generate_presigned_url(master_reel)

        results.append({
            **b,
            "footageUrls": footage_urls,
            "masterReelUrl": master_reel,
            "user": user_info,
            "package": pkg,
            "partner": partner
        })

    results.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return {"bookings": results}

@app.post("/api/bookings")
async def create_booking(body: CreateBookingBody):
    # Verify client exists
    client = firestoreDb.clientUsers.find_unique(where={"id": body.userId})
    if not client:
        raise HTTPException(status_code=404, detail="User not found")
        
    pkg = firestoreDb.packages.find_unique(where={"id": body.packageId})
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    booking_id = "bok-" + str(uuid.uuid4())[:8]
    
    # CRITICAL CHANGE: Start booking at PENDING status instead of PAID directly
    is_editing = body.type in ["editing", "media"]
    booking = firestoreDb.bookings.create({
        "id": booking_id,
        "userId": body.userId,
        "packageId": body.packageId,
        "bookingDate": body.bookingDate,
        "timeSlot": body.timeSlot,
        "location": body.location,
        "notes": body.notes,
        "status": "READY_TO_EDIT" if is_editing else "PENDING",
        "paymentStatus": "SUCCESS" if body.razorpayPaymentId else "UNPAID",
        "paymentId": body.razorpayPaymentId,
        "paymentMethod": "razorpay" if body.razorpayPaymentId else None,
        "syncPercentage": 100 if is_editing else 0,
        "type": body.type or "delivery"
    })

    # Trigger automatic dispatch immediately only if delivery (shoot) task
    if not is_editing:
        try:
            # Call dispatch route logic directly (inline)
            dispatch_booking_logic(booking_id)
        except Exception as e:
            print(f"[Dispatch-Err] Failed to auto-dispatch: {e}")

    # Re-fetch booking with resolved relationships
    return {"booking": {
        **booking,
        "user": client,
        "package": pkg
    }}

@app.get("/api/bookings/available")
async def list_available_bookings(partnerId: str):
    # Dispatched bookings has status PENDING in work_dispatches
    dispatches = firestoreDb.workDispatches.find_many(where={"partnerId": partnerId, "status": "PENDING"})
    results = []
    for d in dispatches:
        b = firestoreDb.bookings.find_unique(where={"id": d["bookingId"]})
        if b and b.get("status") == "PARTNER_DISPATCHED":
            client = firestoreDb.clientUsers.find_unique(where={"id": b["userId"]})
            pkg = firestoreDb.packages.find_unique(where={"id": b["packageId"]})
            results.append({
                **b,
                "user": client,
                "package": pkg
            })
    return {"bookings": results}

@app.get("/api/bookings/{booking_id}")
async def get_booking_details(booking_id: str):
    b = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    client = firestoreDb.clientUsers.find_unique(where={"id": b["userId"]})
    pkg = firestoreDb.packages.find_unique(where={"id": b["packageId"]})
    
    partner = None
    if b.get("partnerId"):
        p_profile = firestoreDb.partners.find_unique(where={"id": b["partnerId"]})
        if p_profile:
            p_user = firestoreDb.partnerUsers.find_unique(where={"id": p_profile["userId"]})
            partner = {
                **p_profile,
                "user": p_user
            }

    footage_urls = []
    if b.get("footageUrls"):
        try:
            footage_urls = json.loads(b["footageUrls"])
        except:
            footage_urls = [b["footageUrls"]]

    master_reel = b.get("masterReelUrl")
    if master_reel:
        master_reel = generate_presigned_url(master_reel)

    return {"booking": {
        **b,
        "footageUrls": footage_urls,
        "masterReelUrl": master_reel,
        "user": client,
        "package": pkg,
        "partner": partner
    }}

@app.patch("/api/bookings/{booking_id}")
async def update_booking(booking_id: str, request: Request):
    body = await request.json()
    b = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    updated = firestoreDb.bookings.update(where={"id": booking_id}, data=body)
    return {"booking": updated}

@app.get("/api/bookings/{booking_id}/track")
async def track_booking(booking_id: str):
    b = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    return {"bookingId": booking_id, "status": b.get("status")}

# Dispatch logic runner helper
def dispatch_booking_logic(booking_id: str):
    booking = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not booking or booking.get("status") not in ["PENDING", "PAID", "PARTNER_DISPATCHED"]:
        return

    # Find online / active partners
    active_partners = firestoreDb.partners.find_many(where={"availability": True})
    
    # Auto-provision a default partner if none are online, to avoid blockages
    if not active_partners:
        p_profile = firestoreDb.partners.find_unique(where={"id": "prt-arjun"})
        if not p_profile:
            # Create Arjun profile
            try:
                firestoreDb.partnerUsers.create({
                    "id": "usr-arjun",
                    "email": "arjun@orbitlogic.io",
                    "name": "Arjun Kapoor",
                    "phone": "+91 99999 88888",
                    "role": "PARTNER"
                })
            except: pass
            p_profile = firestoreDb.partners.create({
                "id": "prt-arjun",
                "userId": "usr-arjun",
                "location": "Bandra West, Mumbai",
                "latitude": 19.0596,
                "longitude": 72.8295,
                "availability": True,
                "isVerified": True,
                "rating": 5.0,
                "completedProjects": 0,
                "walletBalance": 0.0,
                "pendingClearance": 0.0,
                "totalWithdrawn": 0.0,
                "verificationStatus": "VERIFIED",
                "payoutEnabled": True
            })
        active_partners = [p_profile]

    new_round = (booking.get("dispatchRound") or 0) + 1
    
    # Create work dispatch records
    for p in active_partners[:5]:
        firestoreDb.workDispatches.create({
            "bookingId": booking_id,
            "partnerId": p["id"],
            "status": "PENDING",
            "round": new_round,
            "dispatchedAt": datetime.utcnow().isoformat() + "Z"
        })

    # Update booking
    updated_b = firestoreDb.bookings.update(
        where={"id": booking_id},
        data={
            "dispatchRound": new_round,
            "status": "PARTNER_DISPATCHED"
        }
    )

    pkg = firestoreDb.packages.find_unique(where={"id": updated_b["packageId"]})
    client = firestoreDb.clientUsers.find_unique(where={"id": updated_b["userId"]})

    # Notify WS
    partner_ids = [p["id"] for p in active_partners[:5]]
    notify_ws_internal("/internal/dispatch", {
        "bookingId": booking_id,
        "partnerIds": partner_ids,
        "round": new_round,
        "booking": {
            **updated_b,
            "package": pkg,
            "user": client
        }
    })

@app.post("/api/bookings/{booking_id}/dispatch")
async def dispatch_booking(booking_id: str):
    dispatch_booking_logic(booking_id)
    return {"success": True}

@app.post("/api/bookings/{booking_id}/accept")
async def accept_booking(booking_id: str, body: AcceptBookingBody):
    partner_id = body.partnerId
    
    # Verify partner bank details via Cashfree (Penny Drop check)
    partner = firestoreDb.partners.find_unique(where={"id": partner_id})
    if not partner:
        raise HTTPException(status_code=404, detail="Partner profile not found")
        
    acc_num = partner.get("encryptedAccountNumber")
    ifsc = partner.get("ifscCode")
    holder = partner.get("accountHolderName") or partner.get("name") or "Partner"
    phone = partner.get("phone") or "+91 99999 99999"
    
    if not acc_num or not ifsc:
        raise HTTPException(
            status_code=403,
            detail="Please verify your bank account details in settings before accepting tasks."
        )
        
    val_res = validate_bank_account(
        account_number=acc_num,
        ifsc=ifsc,
        name=holder,
        phone=phone.replace("+91", "").strip()
    )
    
    if not val_res.get("success") or val_res.get("accountStatus") != "VALID":
        raise HTTPException(
            status_code=403,
            detail="Please verify your bank account details in settings before accepting tasks."
        )

    booking = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.get("status") != "PARTNER_DISPATCHED":
        raise HTTPException(status_code=400, detail=f"Booking is not dispatched. Current status: {booking.get('status')}")
    if booking.get("partnerId"):
        raise HTTPException(status_code=400, detail="Booking already has partner assigned")

    # Find pending dispatch
    dispatch = firestoreDb.workDispatches.find_first(where={"bookingId": booking_id, "partnerId": partner_id, "status": "PENDING"})
    if not dispatch:
        raise HTTPException(status_code=404, detail="No pending dispatch found")

    # Accept dispatch
    firestoreDb.workDispatches.update(
        where={"id": dispatch["id"]},
        data={"status": "ACCEPTED", "respondedAt": datetime.utcnow().isoformat() + "Z"}
    )

    # Assign partner & set status to EN_ROUTE
    updated_booking = firestoreDb.bookings.update(
        where={"id": booking_id},
        data={"partnerId": partner_id, "status": "EN_ROUTE"}
    )

    # Mark other dispatches expired
    other_dispatches = firestoreDb.workDispatches.find_many(where={"bookingId": booking_id, "status": "PENDING"})
    for od in other_dispatches:
        firestoreDb.workDispatches.update(
            where={"id": od["id"]},
            data={"status": "EXPIRED", "respondedAt": datetime.utcnow().isoformat() + "Z"}
        )

    # Resolve objects
    client = firestoreDb.clientUsers.find_unique(where={"id": updated_booking["userId"]})
    pkg = firestoreDb.packages.find_unique(where={"id": updated_booking["packageId"]})
    partner_user = firestoreDb.partnerUsers.find_unique(where={"id": partner["userId"]})
    resolved_partner = {
        **partner,
        "user": partner_user
    }
    resolved_booking = {
        **updated_booking,
        "user": client,
        "package": pkg,
        "partner": resolved_partner
    }

    # Notify WS
    notify_ws_internal("/internal/accept", {
        "bookingId": booking_id,
        "partnerId": partner_id,
        "partnerName": partner_user.get("name") or "A partner",
        "booking": resolved_booking
    })
    notify_ws_internal("/internal/notify-client", {
        "bookingId": booking_id,
        "event": "booking:status-update",
        "payload": {
            "bookingId": booking_id,
            "status": "EN_ROUTE",
            "previousStatus": "PARTNER_DISPATCHED"
        }
    })

    return {"booking": resolved_booking}

@app.post("/api/bookings/{booking_id}/decline")
async def decline_booking(booking_id: str, body: DeclineBookingBody):
    partner_id = body.partnerId
    dispatch = firestoreDb.workDispatches.find_first(where={"bookingId": booking_id, "partnerId": partner_id, "status": "PENDING"})
    if not dispatch:
        raise HTTPException(status_code=404, detail="No pending dispatch found")

    firestoreDb.workDispatches.update(
        where={"id": dispatch["id"]},
        data={"status": "DECLINED", "respondedAt": datetime.utcnow().isoformat() + "Z"}
    )

    booking = firestoreDb.bookings.find_unique(where={"id": booking_id})
    declined_by = []
    if booking.get("declinedBy"):
        try:
            declined_by = json.loads(booking["declinedBy"])
        except:
            declined_by = [booking["declinedBy"]]
    declined_by.append(partner_id)

    firestoreDb.bookings.update(
        where={"id": booking_id},
        data={"declinedBy": json.dumps(declined_by)}
    )
    return {"success": True}

@app.post("/api/bookings/{booking_id}/sync-complete")
async def sync_complete(booking_id: str, body: SyncCompleteBody):
    booking = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if not booking.get("partnerId"):
        raise HTTPException(status_code=400, detail="No partner assigned")

    # Update status to READY_TO_EDIT
    updated_b = firestoreDb.bookings.update(
        where={"id": booking_id},
        data={
            "status": "READY_TO_EDIT",
            "syncPercentage": 100,
            "footageUrls": json.dumps(body.footageUrls),
            "proxyFootageUrl": body.proxyFootageUrl
        }
    )

    # Credit Partner Payout of ₹700
    already_credited = booking.get("status") in ["READY_TO_EDIT", "EDITING", "DELIVERED"]
    if not already_credited:
        partner_profile = firestoreDb.partners.find_unique(where={"id": booking["partnerId"]})
        if partner_profile:
            payout = 700.0
            new_balance = (partner_profile.get("walletBalance") or 0.0) + payout
            firestoreDb.partners.update(
                where={"id": partner_profile["id"]},
                data={
                    "walletBalance": new_balance,
                    "completedProjects": (partner_profile.get("completedProjects") or 0) + 1
                }
            )
            # Create transaction
            firestoreDb.transactions.create({
                "partnerId": booking["partnerId"],
                "bookingId": booking_id,
                "type": "EARNING",
                "amount": payout,
                "status": "COMPLETED",
                "description": f"Salary payout for shoot {booking_id[:8]}... (Personalized/Professional)"
            })

    # Notify WS
    notify_ws_internal("/internal/notify-client", {
        "bookingId": booking_id,
        "event": "booking:status-update",
        "payload": {
            "bookingId": booking_id,
            "status": "EDITING",
            "previousStatus": booking.get("status"),
            "reelUrl": None,
            "deliveredAt": None
        }
    })
    notify_ws_internal("/internal/notify-client", {
        "bookingId": booking_id,
        "event": "editor:booking-ready",
        "payload": {
            "bookingId": booking_id,
            "status": "READY_TO_EDIT",
            "footageUrls": body.footageUrls
        }
    })

    client = firestoreDb.clientUsers.find_unique(where={"id": updated_b["userId"]})

    return {
        "success": True,
        "booking": {
            **updated_b,
            "footageUrls": body.footageUrls,
            "editorRequirements": client.get("editorRequirements") if client else "",
            "brandLogo": client.get("brandLogo") if client else None,
            "brandFont": client.get("brandFont") if client else None,
            "brandColor": client.get("brandColor") if client else None
        }
    }

# --- Editor Routes ---

@app.get("/api/editor/bookings")
async def list_editor_bookings(editorId: Optional[str] = None):
    # Returns all bookings in READY_TO_EDIT or EDITING (if assigned to this editor)
    bookings = firestoreDb.bookings.find_many()
    results = []
    for b in bookings:
        status = b.get("status")
        # If it is ready to edit or is currently being edited by this editor
        is_ready = status == "READY_TO_EDIT"
        is_assigned_to_me = status == "EDITING" and b.get("editorId") == editorId
        is_delivered = status == "DELIVERED" and b.get("editorId") == editorId
        
        if is_ready or is_assigned_to_me or is_delivered:
            client = firestoreDb.clientUsers.find_unique(where={"id": b["userId"]})
            pkg = firestoreDb.packages.find_unique(where={"id": b["packageId"]})
            
            footage_urls = []
            if b.get("footageUrls"):
                try:
                    footage_urls = json.loads(b["footageUrls"])
                except:
                    footage_urls = [b["footageUrls"]]
            
            results.append({
                **b,
                "footageUrls": footage_urls,
                "client": client,
                "package": pkg
            })
    return {"bookings": results}

@app.get("/api/editor/bookings/{booking_id}")
async def get_editor_booking_details(booking_id: str):
    b = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    client = firestoreDb.clientUsers.find_unique(where={"id": b["userId"]})
    pkg = firestoreDb.packages.find_unique(where={"id": b["packageId"]})
    
    footage_urls = []
    if b.get("footageUrls"):
        try:
            footage_urls = json.loads(b["footageUrls"])
        except:
            footage_urls = [b["footageUrls"]]
            
    proxy_urls = []
    if b.get("proxyFootageUrl"):
        try:
            proxy_urls = json.loads(b["proxyFootageUrl"])
        except:
            proxy_urls = [b["proxyFootageUrl"]]

    return {
        "success": True,
        "booking": {
            **b,
            "footageUrls": footage_urls,
            "proxyFootageUrls": proxy_urls,
            "client": client,
            "package": pkg
        }
    }

@app.post("/api/editor/bookings/{booking_id}")
async def accept_editor_booking(booking_id: str, body: AcceptEditorBookingBody):
    b = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Load editor profile & perform Cashfree Penny Drop validation
    editor_id = body.editorId
    editor = firestoreDb.editors.find_unique(where={"id": editor_id})
    if not editor:
        raise HTTPException(
            status_code=403,
            detail="Please verify your bank account details in settings before accepting tasks."
        )

    acc_num = editor.get("encryptedAccountNumber")
    ifsc = editor.get("ifscCode")
    holder = editor.get("accountHolderName") or editor.get("name") or "Editor"
    phone = editor.get("phone") or "+91 99999 99999"

    if not acc_num or not ifsc:
        raise HTTPException(
            status_code=403,
            detail="Please verify your bank account details in settings before accepting tasks."
        )

    val_res = validate_bank_account(
        account_number=acc_num,
        ifsc=ifsc,
        name=holder,
        phone=phone.replace("+91", "").strip()
    )

    if not val_res.get("success") or val_res.get("accountStatus") != "VALID":
        raise HTTPException(
            status_code=403,
            detail="Please verify your bank account details in settings before accepting tasks."
        )

    updated = firestoreDb.bookings.update(
        where={"id": booking_id},
        data={"editorId": body.editorId, "status": "EDITING"}
    )
    
    # Notify Client via WS
    notify_ws_internal("/internal/notify-client", {
        "bookingId": booking_id,
        "event": "booking:status-update",
        "payload": {
            "bookingId": booking_id,
            "status": "EDITING",
            "previousStatus": "READY_TO_EDIT"
        }
    })
    
    return {"success": True, "booking": updated}

@app.post("/api/editor/deliver")
@app.post("/api/upload-reel")
async def deliver_booking(body: DeliverBookingBody):
    b = firestoreDb.bookings.find_unique(where={"id": body.bookingId})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    updated = firestoreDb.bookings.update(
        where={"id": body.bookingId},
        data={
            "status": "DELIVERED",
            "masterReelUrl": body.masterReelUrl,
            "deliveredAt": datetime.utcnow().isoformat() + "Z"
        }
    )

    # Notify WS
    presigned_reel = generate_presigned_url(body.masterReelUrl)
    notify_ws_internal("/internal/notify-client", {
        "bookingId": body.bookingId,
        "event": "booking:status-update",
        "payload": {
            "bookingId": body.bookingId,
            "status": "DELIVERED",
            "previousStatus": "EDITING",
            "reelUrl": presigned_reel,
            "deliveredAt": updated.get("deliveredAt")
        }
    })

    return {"success": True, "booking": updated}

# --- Partners Routes ---

@app.get("/api/partners")
async def list_partners():
    profiles = firestoreDb.partners.find_many()
    results = []
    for p in profiles:
        u = firestoreDb.partnerUsers.find_unique(where={"id": p["userId"]})
        results.append({
            **p,
            "user": u
        })
    return {"partners": results}

@app.post("/api/partners")
async def link_partner_profile(body: CreateUserBody):
    email = body.email.lower().strip()
    u = firestoreDb.partnerUsers.find_unique(where={"email": email})
    if not u:
        raise HTTPException(status_code=404, detail="Partner user not found")
    
    existing = firestoreDb.partners.find_unique(where={"userId": u["id"]})
    if existing:
        return {"partner": existing}

    profile = firestoreDb.partners.create({
        "id": "prt-" + str(uuid.uuid4())[:8],
        "userId": u["id"],
        "location": body.location or "Mumbai",
        "latitude": 19.0596,
        "longitude": 72.8295,
        "availability": True,
        "isVerified": True,
        "rating": 5.0,
        "completedProjects": 0,
        "walletBalance": 0.0,
        "pendingClearance": 0.0,
        "totalWithdrawn": 0.0,
        "verificationStatus": "VERIFIED",
        "payoutEnabled": True
    })
    return {"partner": profile}

@app.get("/api/partners/{partner_id}")
async def get_partner_details(partner_id: str):
    p = firestoreDb.partners.find_unique(where={"id": partner_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partner not found")
    u = firestoreDb.partnerUsers.find_unique(where={"id": p["userId"]})
    
    # Load partner bookings
    bookings = firestoreDb.bookings.find_many(where={"partnerId": partner_id})
    resolved_bookings = []
    for b in bookings:
        client = firestoreDb.clientUsers.find_unique(where={"id": b["userId"]})
        pkg = firestoreDb.packages.find_unique(where={"id": b["packageId"]})
        resolved_bookings.append({
            **b,
            "user": client,
            "package": pkg
        })

    return {
        "partner": {
            **p,
            "user": u,
            "bookings": resolved_bookings
        }
    }

@app.patch("/api/partners/{partner_id}")
async def update_partner_profile(partner_id: str, request: Request):
    body = await request.json()
    p = firestoreDb.partners.find_unique(where={"id": partner_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partner not found")
    updated = firestoreDb.partners.update(where={"id": partner_id}, data=body)
    return {"partner": updated}

@app.get("/api/partners/{partner_id}/wallet")
async def get_partner_wallet(partner_id: str):
    p = firestoreDb.partners.find_unique(where={"id": partner_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partner profile not found")
    
    transactions = firestoreDb.transactions.find_many(where={"partnerId": partner_id})
    transactions.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    
    return {
        "balance": p.get("walletBalance") or 0.0,
        "pendingClearance": p.get("pendingClearance") or 0.0,
        "totalWithdrawn": p.get("totalWithdrawn") or 0.0,
        "transactions": transactions
    }

@app.post("/api/partners/{partner_id}/withdraw")
async def partner_withdraw(partner_id: str, body: WithdrawBody):
    p = firestoreDb.partners.find_unique(where={"id": partner_id})
    if not p:
        raise HTTPException(status_code=404, detail="Partner not found")

    amount = body.amount
    current_balance = p.get("walletBalance") or 0.0
    if current_balance < amount:
        raise HTTPException(status_code=400, detail=f"Insufficient balance. Current balance: ₹{current_balance}")

    updated = firestoreDb.partners.update(
        where={"id": partner_id},
        data={
            "walletBalance": current_balance - amount,
            "totalWithdrawn": (p.get("totalWithdrawn") or 0.0) + amount
        }
    )

    # Record withdrawal transaction
    firestoreDb.transactions.create({
        "partnerId": partner_id,
        "type": "WITHDRAWAL",
        "amount": -amount,
        "status": "COMPLETED",
        "description": f"Bank withdrawal of ₹{amount}"
    })

    return {"success": True, "newBalance": updated["walletBalance"]}

@app.post("/api/partners/link-bank")
async def link_bank(body: LinkBankBody):
    p = firestoreDb.partners.find_unique(where={"id": body.partnerId})
    if not p:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    # Store plain bank details directly
    updated = firestoreDb.partners.update(
        where={"id": body.partnerId},
        data={
            "accountHolderName": body.accountHolderName,
            "encryptedAccountNumber": body.accountNumber, # Plain storage as requested
            "ifscCode": body.ifscCode,
            "bankName": body.bankName,
            "branchName": body.branchName or "Main Branch",
            "panNumber": body.panNumber,
            "verificationStatus": "VERIFIED", # Auto verify linked bank
            "payoutEnabled": True
        }
    )
    return {"success": True, "partner": updated}

# --- Upload routes ---

@app.post("/api/upload/presigned-url")
async def get_upload_presigned_url(body: PresignedUrlBody):
    # Mock return
    url_path = f"/upload/reels/{body.fileName}"
    signed = generate_presigned_url(url_path)
    return {
        "url": "http://localhost:5000/api/upload/mock-s3",
        "fields": {"key": body.fileName},
        "signedGetUrl": f"http://localhost:5000{signed}"
    }

@app.get("/api/media/presign")
async def get_media_presigned_url(fileId: str):
    # If the fileId is already a full local/absolute URL path (e.g. starting with /upload/)
    url_path = fileId
    if fileId.startswith("http"):
        # Extract path
        try:
            from urllib.parse import urlparse
            url_path = urlparse(fileId).path
        except:
            pass
            
    signed = generate_presigned_url(url_path)
    # Check if host is from request or localhost
    return {
        "presignedUrl": f"http://localhost:5000{signed}"
    }

@app.put("/api/upload/mock-s3")
async def mock_s3_upload(request: Request, key: str = Query(...)):
    body_data = await request.body()
    file_name = os.path.basename(key)
    dest_path = os.path.join(PUBLIC_REELS_DIR, file_name)
    
    with open(dest_path, "wb") as f:
        f.write(body_data)
        
    print(f"[Upload] File successfully saved to: {dest_path}")
    return {"success": True, "path": f"/upload/reels/{file_name}"}

# --- Admin Routes ---

@app.get("/api/admin/onboarded-directory")
async def admin_directory():
    clients = firestoreDb.clientUsers.find_many()
    partners = firestoreDb.partners.find_many()
    resolved_partners = []
    for p in partners:
        u = firestoreDb.partnerUsers.find_unique(where={"id": p["userId"]})
        resolved_partners.append({**p, "user": u})
        
    return {
        "clients": clients,
        "partners": resolved_partners
    }

@app.post("/api/admin/verify-partner")
async def verify_partner(body: PartnerVerificationBody):
    p = firestoreDb.partners.find_unique(where={"id": body.partnerId})
    if not p:
        raise HTTPException(status_code=404, detail="Partner not found")
        
    firestoreDb.partners.update(
        where={"id": body.partnerId},
        data={"isVerified": body.status == "VERIFIED"}
    )
    return {"success": True}

@app.post("/api/admin/seed")
async def seed_data():
    # Seeding demo data
    try:
        firestoreDb.clientUsers.create({
            "id": "usr-demo",
            "email": "demo@orbitlogic.io",
            "name": "Test User",
            "phone": "+91 98765 43210",
            "role": "USER",
            "avatar": "from-orbit-cyan to-orbit-purple"
        })
    except: pass
    
    try:
        firestoreDb.partnerUsers.create({
            "id": "usr-arjun",
            "email": "arjun@orbitlogic.io",
            "name": "Arjun Kapoor",
            "phone": "+91 99999 88888",
            "role": "PARTNER"
        })
    except: pass
    
    try:
        firestoreDb.partners.create({
            "id": "prt-arjun",
            "userId": "usr-arjun",
            "location": "Bandra West, Mumbai",
            "latitude": 19.0596,
            "longitude": 72.8295,
            "availability": True,
            "isVerified": True,
            "rating": 4.9,
            "completedProjects": 48,
            "deviceInfo": "iPhone 15 Pro Max",
            "walletBalance": 24500.0,
            "pendingClearance": 4200.0,
            "totalWithdrawn": 12000.0,
            "verificationStatus": "VERIFIED",
            "payoutEnabled": True
        })
    except: pass

    return {"success": True}

@app.get("/api/admin/audit-logs")
async def get_audit_logs():
    client_logs = firestoreDb.clientAuditLogs.find_many()
    partner_logs = firestoreDb.partnerAuditLogs.find_many()
    all_logs = client_logs + partner_logs
    all_logs.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
    return {"auditLogs": all_logs}


class CompleteBookingBody(BaseModel):
    finalMediaUrl: str

@app.post("/api/bookings/{booking_id}/complete")
async def complete_booking(booking_id: str, body: CompleteBookingBody):
    b = firestoreDb.bookings.find_unique(where={"id": booking_id})
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")

    updated = firestoreDb.bookings.update(
        where={"id": booking_id},
        data={
            "status": "COMPLETED",
            "masterReelUrl": body.finalMediaUrl,
            "completedAt": datetime.utcnow().isoformat() + "Z"
        }
    )

    try:
        execute_payout_for_booking(booking_id)
    except Exception as e:
        print(f"[Payout-Trigger-Err] Failed: {e}")

    notify_ws_internal("/internal/notify-client", {
        "bookingId": booking_id,
        "event": "booking:status-update",
        "payload": {
            "bookingId": booking_id,
            "status": "COMPLETED",
            "previousStatus": b.get("status"),
            "reelUrl": generate_presigned_url(body.finalMediaUrl)
        }
    })

    return {"success": True, "booking": updated}

@app.post("/api/admin/payouts/retry/{booking_id}")
async def force_retry_payout(booking_id: str):
    try:
        execute_payout_for_booking(booking_id)
        return {"success": True, "message": "Payout execution attempted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount the normal upload directory static files on /upload path as fallback
app.mount("/upload", StaticFiles(directory=PUBLIC_UPLOAD_DIR), name="upload")

def start_server():
    print("[Server] Starting FastAPI production REST API server on port 5000...")
    
    # Start Payout retry scheduler background job
    try:
        scheduler.add_job(check_and_retry_payouts, "interval", minutes=5, id="payout_retry_job")
        scheduler.start()
        print("[Scheduler] Payout retry scheduler started successfully (runs every 5m)")
    except Exception as e:
        print(f"[Scheduler-Err] Failed to start: {e}")
        
    # Start FastAPI
    uvicorn.run(app, host="0.0.0.0", port=5000)

if __name__ == "__main__":
    start_server()
