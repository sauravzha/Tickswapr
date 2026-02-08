# TickSwapr Production Deployment Guide

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│   Vercel (Frontend) │────▶│  Railway (Backend)  │
│  tickswapr.vercel   │     │  api.tickswapr.up   │
│     React + Vite    │     │   Express + JSON    │
└─────────────────────┘     └─────────────────────┘
```

---

## Step 1: Prepare Backend for Railway

### Files to create

- `server/Procfile` - Tells Railway how to start
- Update `server/package.json` - Add start script

---

## Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `sauravzha/Tickswapr`
5. Set **Root Directory**: `server`
6. Railway auto-deploys!

**Get your backend URL** (e.g., `https://tickswapr-production.up.railway.app`)

---

## Step 3: Update Frontend API URL

Update `src/services/ticketService.js` to use environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tickets';
```

---

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project" → Select `Tickswapr`
4. Set **Root Directory**: `.` (root)
5. Add environment variable:
   - `VITE_API_URL` = `https://YOUR-RAILWAY-URL/api/tickets`
6. Deploy!

---

## Result

- Frontend: `https://tickswapr.vercel.app`
- Backend: `https://tickswapr-xxx.up.railway.app`
