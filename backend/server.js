import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";


import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import urgentRequestRoutes from './routes/urgentRequests.js';
import paymentRoutes from './routes/payments.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/urgent-requests', urgentRequestRoutes);
app.use('/api/payments', paymentRoutes);

app.get("/", (req, res) => {
    res.send("TickSwapr Backend Running");
});

app.listen(process.env.PORT, () => {
    console.log(`🚀 Backend running on port ${process.env.PORT}`);
});
