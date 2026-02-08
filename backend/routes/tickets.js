import express from 'express';
import Ticket from '../models/Ticket.js';
import { protect, adminCheck } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router();

// @desc    Get APPROVED tickets (Public Marketplace)
// @route   GET /api/tickets
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, limit } = req.query;
        // ONLY SHOW APPROVED TICKETS PUBLICLY
        let query = { status: 'approved' };

        if (category && category !== 'all') {
            query.category = category;
        }

        let tickets = Ticket.find(query).sort({ createdAt: -1 });

        if (limit) {
            tickets = tickets.limit(parseInt(limit));
        }

        const result = await tickets;
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get logged in user's tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
router.get('/my-tickets', protect, async (req, res) => {
    try {
        const tickets = await Ticket.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get ALL tickets (Admin - Pending, Active, Rejected)
// @route   GET /api/tickets/admin/all
// @access  Private (Admin)
router.get('/admin/all', protect, adminCheck, async (req, res) => {
    try {
        const tickets = await Ticket.find({}).sort({ createdAt: -1 }).populate('sellerId', 'name email');
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Verify/Reject Ticket
// @route   PUT /api/tickets/:id/verify
// @access  Private (Admin)
router.put('/:id/verify', protect, adminCheck, async (req, res) => {
    const { verified, reason } = req.body; // verified: true/false

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.verified = verified;
        ticket.status = verified ? 'approved' : 'rejected'; // Update status based on verification
        ticket.isVerified = verified; // Sync boolean flag

        if (!verified && reason) {
            ticket.rejectionReason = reason;
        } else if (verified) {
            ticket.rejectionReason = undefined; // Clear reason if approved
        }

        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('sellerId', 'name email');
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a ticket
// @route   POST /api/tickets
// @access  Private (Seller/Admin)
router.post('/', protect, upload.single('image'), async (req, res) => {
    const {
        title,
        category,
        originalPrice,
        sellingPrice,
        description,
        city,
        venue,
        eventDate,
    } = req.body;

    if (!title || !originalPrice || !sellingPrice || !eventDate) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    let imageUrl = 'no-photo.jpg';

    // Upload to Cloudinary
    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'tickswapr/tickets',
            });
            imageUrl = result.secure_url;

            // Remove file from local upload folder
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(err);
            });
        } catch (error) {
            console.error('❌ Cloudinary Upload Failed (Likely missing credentials):', error.message);
            // SOFT FAIL: Use placeholder image so user can still create ticket for testing
            imageUrl = 'https://via.placeholder.com/300x200?text=Upload+Failed';
        }
    }

    try {
        const ticket = await Ticket.create({
            title,
            category,
            originalPrice,
            sellingPrice,
            description,
            imageUrl,
            city,
            venue,
            eventDate,
            sellerId: req.user.id,
            sellerName: req.user.name,
            status: 'pending_verification', // STRICT DEFAULT
            verified: false
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ticket data', error: error.message });
    }
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Seller/Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check user
        if (ticket.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await ticket.deleteOne();
        res.json({ message: 'Ticket removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

export default router;
