# 🚀 Complete Deployment & Domain Guide

This document provides a step-by-step roadmap for launching your Dementia Detection platform globally and submitting it to the Apple App Store.

---

## 🌎 1. Hosting the Web App (Frontend + Backend)

To make your website live (not just on `localhost`), we recommend using **Vercel** for the frontend and **Render** for the backend.

### Step A: Push to GitHub
If you haven't already, push your code to a GitHub repository:
1. Initialize git: `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial Launch"`
4. Push to your GitHub repo.

### Step B: Host the Backend (API) on Render
1. Create a free account at [render.com](https://render.com).
2. Create a "Web Service" and link your GitHub repo.
3. Use these settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**: Add your `.env` variables from `backend/.env` (MONGO_URI, JWT_SECRET, etc.).

### Step C: Host the Frontend on Vercel
1. Create a free account at [vercel.com](https://vercel.com).
2. Connect your GitHub repo.
3. Use these settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
4. **Environment Variables**: Add `VITE_API_URL` pointing to your Render backend URL (e.g., `https://your-backend.onrender.com/api`).

---

## 🔗 2. Connecting Your Custom Domain

Once you buy a domain (from GoDaddy, Google, etc.):

1. Go to your **Vercel Dashboard > Project > Settings > Domains**.
2. Type in your domain (e.g., `www.neuroloop.ai`) and click **Add**.
3. Vercel will give you "DNS Records" (Type A and CNAME).
4. Log in to your **Domain Provider's** website (e.g., GoDaddy).
5. Go to **DNS Management** and add the records Vercel provided.
6. Wait 1-24 hours for the domain to activate.

---

## 🍏 3. App Store Submission (iOS)

Preparing the iOS version for Apple:

1. **Requirements**: You MUST have a **Mac** and an **Apple Developer Account** ($99/year).
2. **Build your web app**:
   ```bash
   cd frontend && npm run build
   ```
3. **Sync with iOS**:
   ```bash
   npx cap sync ios
   ```
4. **Open in Xcode**:
   ```bash
   npx cap open ios
   ```
5. In Xcode:
   - Select your "Team" (your Apple Developer account).
   - Click **Product > Archive**.
   - Click **Distribute App** to send it to "App Store Connect".
6. Finalize the listing at [appstoreconnect.apple.com](https://appstoreconnect.apple.com).

---

## 📂 Project Update Status
- **Backend**: Ready for Render/Railway deployment.
- **Frontend**: Vite caching issues resolved via clean install.
- **iOS/Android**: Platforms initialized and ready in `/frontend`.
- **Domain**: Ready for DNS linkage.
