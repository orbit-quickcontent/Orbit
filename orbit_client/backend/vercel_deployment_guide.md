# Orbit Backend — Vercel Deployment Guide

Since Vercel is the creator of Next.js, it offers the most seamless, high-performance, and zero-configuration hosting experience for your Orbit application. Here is how to deploy it in less than 5 minutes.

---

## 🚀 Step 1: Connect to Vercel

1. Go to [Vercel](https://vercel.com/) and log in (or sign up using your GitHub account).
2. On the dashboard, click **Add New** → **Project**.
3. Under "Import Git Repository", find and import your **`Orbit`** repository.

---

## ⚙️ Step 2: Configure Root Directory

Since your repository contains both the Flutter mobile apps and the backend in a subfolder, configure the root directory:
1. Under **Project Settings**, click **Edit** next to "Root Directory".
2. Select **`orbit_client/backend`** as the root folder.
3. Click **Continue**.

---

## 🔑 Step 3: Add Environment Variables

In the **Environment Variables** section, copy and paste the following keys from your local configuration:

| Key | Example / Description |
|---|---|
| **`DATABASE_URL`** | `postgresql://username:password@host:port/database?sslmode=require` (your PostgreSQL URL) |
| **`NEXTAUTH_SECRET`** | `orbit-super-secret-jwt-key` (any secure random string) |
| **`NEXTAUTH_URL`** | `https://your-app-name.vercel.app` (your live Vercel URL once deployed) |
| **`AWS_ACCESS_KEY_ID`** | Your AWS S3/Cloudflare R2 access key (optional) |
| **`AWS_SECRET_ACCESS_KEY`**| Your AWS S3/Cloudflare R2 secret key (optional) |
| **`AWS_S3_BUCKET_NAME`** | Your S3 bucket name (optional) |
| **`AWS_REGION`** | Your S3 bucket region, e.g. `ap-south-1` (optional) |

---

## 📦 Step 4: Deploy!

1. Click the **Deploy** button.
2. Vercel will automatically download dependencies, compile the TypeScript pages, build the Prisma client, and deploy your site to a public HTTPS URL (e.g. `https://orbit-backend.vercel.app`).

---

## 🔄 Step 5: Update the Mobile App URL

Once the backend is live on Vercel:
1. Copy your live Vercel URL (e.g., `https://orbit-backend.vercel.app`).
2. Open **Android Studio** (or VS Code).
3. In `orbit_client/lib/main.dart` and `orbit_partner/lib/main.dart`, update the server URL variable (or change it dynamically via the in-app Settings gear icon) to point to your new Vercel URL instead of `10.0.2.2:3000`.
