# Entertainment System - Deployment Guide

This guide covers deploying the backend on Render and frontend on Netlify.

## Prerequisites

- GitHub repository with both `server` and `client` folders
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Netlify account
- Render account

---

## Part 1: Backend Deployment (Render)

### 1. Prepare Server for Production

The server already has a production build script in `package.json`. No changes needed.

### 2. Create Render Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: entertainment-api
   - **Root Directory**: server
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or $7/month for paid tier)

### 3. Environment Variables

Add these in Render's "Environment" section:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
ADMIN_PASSWORD=your_secure_password
```

### 4. Deploy

Click "Create Web Service". Wait for build to complete.

### 5. Note Your Backend URL

Your backend will be available at:
```
https://entertainment-api.onrender.com
```

---

## Part 2: Frontend Deployment (Netlify)

### 1. Create Production Environment Variables

Create `.env.production` in `client/` folder:

```
VITE_API_BASE_URL=https://entertainment-api.onrender.com/api/v1
```

### 2. Update Vite Config for Production

Update `client/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
```

### 3. Build the Client

Test locally first:
```bash
cd client
npm install
npm run build
```

### 4. Deploy to Netlify

**Option A: GitHub Integration (Recommended)**

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: client
   - **Build command**: npm run build
   - **Publish directory**: dist
5. Add environment variable:
   - `VITE_API_BASE_URL` = `https://entertainment-api.onrender.com/api/v1`
6. Click "Deploy site"

**Option B: Drag & Drop**

1. Run `npm run build` locally
2. Go to Netlify → "Add new site" → "Drag and drop your dist folder here"

### 5. Configure CORS on Backend

In your server code or Cloudinary config, ensure your Netlify domain is allowed:
- Domain: `https://your-site.netlify.app`

---

## Part 3: Verify Deployment

### Test Backend

```bash
curl https://entertainment-api.onrender.com/api/v1/home
```

Expected: JSON response with data

### Test Frontend

1. Open your Netlify URL
2. Click on any movie/music item
3. Verify the media player loads correctly

---

## Troubleshooting

### CORS Errors
If you see CORS errors in browser console:
- Ensure backend `CORS` middleware allows your Netlify domain
- Update the cors origin in `server/src/index.ts`:
```typescript
app.use(cors({
  origin: ['https://your-site.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

### 403 Forbidden on API Calls
- Check that `ADMIN_PASSWORD` environment variable is set correctly on Render
- Clear browser localStorage if you cached an old password

### Media Player Not Loading
- Verify `VITE_API_BASE_URL` is set correctly on Netlify
- Check browser console for errors

### MongoDB Connection Failed
- Ensure your MongoDB Atlas IP whitelist includes Render's IP
- Or set "Allow Access from Anywhere" (0.0.0.0) for testing

---

## Project Structure

```
Movieapp/
├── server/              # Backend (Render)
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── services/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/            # Frontend (Netlify)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── hooks/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Server Build Command | `npm install && npm run build` |
| Server Start Command | `npm start` |
| Client Build Command | `npm run build` |
| Client Publish Directory | `dist` |
| API Base URL Env | `VITE_API_BASE_URL` |

---

## Seed Data (Optional)

To seed demo data after deployment:

1. Set `ADMIN_PASSWORD` in browser localStorage:
```javascript
localStorage.setItem('adminPassword', 'your_admin_password')
```

2. Access the admin page at `/admin` and use the seed functionality

Or call directly via curl:
```bash
curl -X POST https://entertainment-api.onrender.com/api/v1/movies \
  -H "x-admin-password: your_password" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Movie", "movieLink": "https://youtube.com/watch?v=...", ...}'
```