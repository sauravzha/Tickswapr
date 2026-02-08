# 🎫 TickSwapr

A modern ticket marketplace platform where users can list and discover tickets for concerts, movies, trains, buses, and sports events.

## ✨ Features

- **Ticket Listings** - List any type of ticket (Concert, Movie, Train, Bus, Sports)
- **Direct Contact** - Buyers contact sellers directly via chat, email, or phone
- **No Payment Processing** - Peer-to-peer arrangement for maximum flexibility
- **Modern UI** - Beautiful glassmorphism design with smooth animations
- **Mobile Responsive** - Works perfectly on all devices

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Express.js with JSON file storage
- **Auth**: Firebase Authentication

## 📦 Quick Start

### Development

```bash
# Terminal 1: Frontend
npm install
npm run dev

# Terminal 2: Backend
cd server
npm install
node index.js
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:5000>

## 🌐 Production Deployment

### Backend (Railway)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select this repo, set Root Directory: `server`
4. Auto-deploys on push!

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Import Project → Select this repo
3. Add env variable: `VITE_API_URL` = your Railway URL + `/api/tickets`
4. Deploy!

## 📁 Project Structure

```
TickSwapr/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   └── services/          # API services
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── data/              # JSON storage
└── public/                # Static assets
```

## 🔑 Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api/tickets
```

### Backend (server/.env)

```
PORT=5000
```

## 📄 License

MIT License - feel free to use for any purpose!

---

Made with ❤️ by Saurav Jha
