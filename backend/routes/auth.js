import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Sync user from Firebase to MongoDB
// @route   POST /api/auth/sync
// @access  Private
router.post('/sync', protect, (req, res) => {
    // protect middleware already handles user creation/fetching
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        token: req.headers.authorization.split(' ')[1]
    });
});

export default router;
