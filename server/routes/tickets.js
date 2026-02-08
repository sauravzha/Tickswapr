const express = require('express');
const router = express.Router();
const ticketStorage = require('../services/ticketStorage');
const { protect, adminCheck } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');

// Try to load cloudinary, but don't fail if not configured
let cloudinary;
try {
    cloudinary = require('../config/cloudinary');
} catch (e) {
    console.log('⚠️ Cloudinary not configured - images will use placeholders');
}

// @desc    Get APPROVED tickets (Public Marketplace)
// @route   GET /api/tickets
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, limit } = req.query;
        const tickets = ticketStorage.getActiveTickets(category, limit);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get logged in user's tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
router.get('/my-tickets', protect, async (req, res) => {
    try {
        const tickets = ticketStorage.getTicketsBySeller(req.user.email || req.user._id);
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get ALL tickets (Admin)
// @route   GET /api/tickets/admin/all
// @access  Private (Admin)
router.get('/admin/all', protect, adminCheck, async (req, res) => {
    try {
        const tickets = ticketStorage.getAllTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Verify/Reject Ticket
// @route   PUT /api/tickets/:id/verify
// @access  Private (Admin)
router.put('/:id/verify', protect, adminCheck, async (req, res) => {
    const { verified, reason } = req.body;

    try {
        const updates = {
            verified: verified,
            status: verified ? 'approved' : 'rejected',
            isVerified: verified
        };

        if (!verified && reason) {
            updates.rejectionReason = reason;
        }

        const ticket = ticketStorage.updateTicket(req.params.id, updates);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const ticket = ticketStorage.getTicketById(req.params.id);
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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
        eventTime,
        quantity,
        urgency,
        // Train fields
        fromStation,
        toStation,
        trainNumber,
        trainName,
        pnr,
        coach,
        berth,
        // Bus fields
        boardingPoint,
        droppingPoint,
        busOperator,
        busNumber,
        // Movie fields
        theater,
        screen,
        row,
        seatNumber,
        // Sports fields
        stadium,
        gate,
        seatSection
    } = req.body;

    if (!title || !originalPrice || !sellingPrice || !eventDate) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    let imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';

    // Upload to Cloudinary if configured
    if (req.file && cloudinary) {
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
            console.log('⚠️ Image upload failed, using placeholder');
            imageUrl = 'https://via.placeholder.com/300x200?text=Upload+Failed';
        }
    } else if (req.file) {
        // Cloudinary not configured, clean up temp file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error(err);
        });
    }

    try {
        const ticketData = {
            title,
            category: category || 'concert',
            originalPrice: parseFloat(originalPrice),
            sellingPrice: parseFloat(sellingPrice),
            description: description || '',
            imageUrl,
            city: city || '',
            venue: venue || '',
            eventDate,
            eventTime: eventTime || '',
            quantity: parseInt(quantity) || 1,
            urgency: urgency || 'normal',
            // Category-specific fields
            fromStation, toStation, trainNumber, trainName, pnr, coach, berth,
            boardingPoint, droppingPoint, busOperator, busNumber,
            theater, screen, row, seatNumber,
            stadium, gate, seatSection
        };

        const ticket = ticketStorage.createTicket(ticketData, req.user);

        console.log('✅ Ticket created:', ticket.id);
        res.status(201).json(ticket);
    } catch (error) {
        console.error('❌ Error creating ticket:', error);
        res.status(400).json({ message: 'Invalid ticket data', error: error.message });
    }
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Seller/Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const ticket = ticketStorage.getTicketById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Check user (skip for demo users)
        if (ticket.seller?.id !== req.user._id && req.user.role !== 'admin' && !req.user._id.startsWith('demo')) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        ticketStorage.deleteTicket(req.params.id);
        res.json({ message: 'Ticket removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
