# Dementia Detection Platform (NeuroLoop) 👋

An AI-powered cognitive assessment application designed for early dementia detection using voice analysis, drawing tests, and clinical modules.

## 🚀 Quick Start (Development)

This project uses a unified development workflow. You can start both the Frontend (React/Vite) and Backend (Node/Express) with a single command.

1. **Prerequisites**: 
   - Node.js (v18+)
   - MongoDB (Local instance or Atlas account)
   - Android Studio (For mobile deployment)

2. **Setup**:
   ```bash
   npm run install:all
   ```

3. **Running**:
   ```bash
   npm run dev
   ```

The app will be available at:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

## 📱 Mobile Deployment (Play Store)

The web app is integrated with **Capacitor** for Android.

1. **Build Web App**:
   ```bash
   cd frontend && npm run build
   ```

2. **Sync with Android**:
   ```bash
   npm run mobile:sync
   ```

3. **Open in Android Studio**:
   ```bash
   npm run mobile:open
   ```
   *From Android Studio, you can build the Signed APK/Bundle for Play Store.*

## 📂 Project Structure

- `frontend/`: React + Vite application (UI, Assessment Logic, Firebase Integration)
- `backend/`: Node.js + Express API (Email handling, AI analysis, MongoDB storage)
- `package.json`: Root manager for the entire project.

## 🛠 Troubleshooting

- **MongoDB Failure**: If the backend says `ECONNREFUSED`, make sure your IP is whitelisted in MongoDB Atlas or that your local MongoDB service is running.
- **Vite Build Error**: The project is optimized for modern browsers. Ensure all dependencies are installed correctly with `npm run install:all`.

---
*Built with React, Firebase, Capacitor, and AI Intelligence.*
