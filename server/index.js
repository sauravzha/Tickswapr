const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Try to load urgent requests route if it exists
try {
    app.use('/api/urgent-requests', require('./routes/urgentRequests'));
} catch (e) {
    console.log('⚠️ Urgent requests route not loaded');
}

app.get('/', (req, res) => {
    res.send('TickSwapr API is running... (No MongoDB - File Storage Mode)');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(50));
    console.log('🎫 TickSwapr Server Started!');
    console.log('='.repeat(50));
    console.log(`📍 Server running on port ${PORT}`);
    console.log(`💾 Using JSON file storage (no MongoDB required)`);
    console.log(`📁 Data stored in: server/data/tickets.json`);
    console.log('='.repeat(50));
    console.log('');
});
