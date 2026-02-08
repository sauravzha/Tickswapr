import express from 'express';
import UrgentRequest from '../models/UrgentRequest.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all urgent requests
// @route   GET /api/urgent-requests
// @access  Public
router.get('/', async (req, res) => {
    try {
        const requests = await UrgentRequest.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create urgent request
// @route   POST /api/urgent-requests
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, category, city, maxPrice, note } = req.body;

    if (!title || !city || !category) {
        return res.status(400).json({ message: 'Please add title, category and city' });
    }

    try {
        const request = await UrgentRequest.create({
            title,
            category,
            city,
            maxPrice,
            note,
            userId: req.user.id
        });

        const populatedRequest = await UrgentRequest.findById(request._id).populate('userId', 'name');

        res.status(201).json(populatedRequest);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
});

// @desc    Delete urgent request
// @route   DELETE /api/urgent-requests/:id
// @access  Private (Owner/Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const request = await UrgentRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Check user
        if (request.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await request.deleteOne();
        res.json({ message: 'Request removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
