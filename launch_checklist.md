# Orbit — Production Launch Checklist

To go live with Orbit as quickly as possible, you must prepare five categories of production credentials, configure the hosting platforms, and initialize your database/gateway services. Use this interactive checklist to track your progress.

---

## 🔑 1. Required API Keys & Credentials

### Maps & Geolocation
- [ ] **`GOOGLE_MAPS_API_KEY_IOS`**: REST API Key with bundle ID restriction for Apple devices.
- [ ] **`GOOGLE_MAPS_API_KEY_ANDROID`**: REST API Key with package name & SHA-1 restriction for Android devices.
- [ ] **`GOOGLE_MAPS_API_KEY_SERVER`**: Server-side API key (IP restricted) for back-end geocoding and routing calculations.

### Authentication
- [ ] **`FIREBASE_WEB_API_KEY`**: Web API Key for client side firebase instance.
- [ ] **`TWILIO_ACCOUNT_SID`**: Twilio Account Identifier for SMS delivery.
- [ ] **`TWILIO_AUTH_TOKEN`**: Secure authentication token for Twilio.
- [ ] **`TWILIO_VERIFY_SERVICE_SID`**: Twilio Verify Service ID to manage OTP lifecycle.

### Push Notifications
- [ ] **`FCM_SERVICE_ACCOUNT_JSON`**: Google Firebase Service Account JSON credentials for Android notifications.
- [ ] **`APNS_P8_CERTIFICATE`**: Apple `.p8` Push Notification Certificate containing Key ID and Team ID.

### Payments & Escrow
- [ ] **`RAZORPAY_KEY_ID`**: Production Razorpay Key ID for payments.
- [ ] **`RAZORPAY_KEY_SECRET`**: Production Razorpay Secret Key.
- [ ] **`RAZORPAY_WEBHOOK_SECRET`**: Secures Razorpay transaction events callback endpoint.
- [ ] **`STRIPE_SECRET_KEY`**: (Alternative) Stripe Secret key for international card capture.
- [ ] **`STRIPE_WEBHOOK_SECRET`**: (Alternative) Stripe webhook signature validator key.

### Media Cloud Storage
- [ ] **`AWS_ACCESS_KEY_ID`**: Access key for AWS S3 Storage programmatic access.
- [ ] **`AWS_SECRET_ACCESS_KEY`**: Secret access key for AWS S3.
- [ ] **`AWS_S3_BUCKET_NAME`**: Name of the target S3 bucket.
- [ ] **`AWS_REGION`**: S3 bucket region (e.g. `ap-south-1`).
- [ ] **Configure S3 bucket CORS for direct PUT uploads**:
  ```json
  [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["PUT", "POST", "GET"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
  ```

---

## 🖥️ 2. Production Infrastructure Hosting

1. **Database**: PostgreSQL (with PostGIS spatial extension enabled)
   * *Providers*: Supabase, Neon, AWS RDS.
2. **Next.js Backend API & Web App**:
   * *Providers*: Vercel, Render, AWS ECS.
3. **Standalone WS Gateway (`orbit-ws`)**:
   * *Providers*: Render, AWS App Runner, DigitalOcean Droplet (requires persistent WebSocket support).

---

## 🚀 3. Steps to Initialize Database & Gateway

Run these commands inside your monorepo workspace to verify the database and compile the WebSocket gateway:

### Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Apply schema migrations to production database
npx prisma db push
```

### Initialize WebSocket Gateway
```bash
# Navigate to the WS Gateway service directory
cd mini-services/orbit-ws

# Install WebSocket dependencies
npm install

# Compile the gateway code
npm run build

# Start the socket service in production mode
npm run start
```
