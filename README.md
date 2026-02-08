# TickSwapr 🎫

India's trusted Gen-Z ticket resale marketplace. Buy and sell verified tickets for concerts, movies, trains, buses, and sports events with 100% buyer protection.

![TickSwapr](https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200)

## ✨ Features

- 🎵 **Multi-Category Support** - Concerts, Movies, Trains, Buses, Sports
- ✅ **Verified Tickets** - Manual verification by admin
- 🔒 **Secure Payments** - Razorpay integration with escrow
- 🛡️ **Buyer Protection** - 100% money-back guarantee
- 🎨 **Premium UI** - Glassmorphism, animations, dark theme
- 📱 **Fully Responsive** - Works on all devices
- 🚀 **Fast & Modern** - Built with React + Vite

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Animations:** Framer Motion
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Payments:** Razorpay
- **Icons:** Lucide React
- **Deployment:** Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Razorpay account (for payments)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/tickswapr.git
cd tickswapr
```

1. Install dependencies

```bash
npm install
```

1. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your Firebase and Razorpay credentials
```

1. Start development server

```bash
npm run dev
```

1. Build for production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── home/         # Landing page sections
│   ├── layout/       # Navbar, Footer
│   ├── payment/      # Razorpay checkout
│   ├── tickets/      # Ticket cards, forms
│   └── ui/           # Reusable UI components
├── config/
│   └── firebase.js   # Firebase configuration
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   └── useTickets.js
├── pages/
│   ├── Home.jsx
│   ├── Browse.jsx
│   ├── Sell.jsx
│   ├── TicketDetail.jsx
│   ├── Dashboard.jsx
│   └── AdminDashboard.jsx
└── services/
    ├── ticketService.js
    └── paymentService.js
```

## 🔐 Environment Variables

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx

# Admin (only this email can access /admin)
VITE_ADMIN_EMAIL=admin@example.com
```

## 👑 Admin Panel

Access the admin panel at `/admin` (only for authorized admin email).

Features:

- 📊 Dashboard with stats
- ✅ Ticket verification queue
- 👥 User management
- 🛒 Order tracking
- ⚠️ Dispute handling
- 📈 Analytics

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/tickswapr)

### Netlify

```bash
npm run build
# Upload dist folder to Netlify
```

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Saurav Jha**

- Email: <jhasaurav562@gmail.com>

---

Made with ❤️ in India 🇮🇳
