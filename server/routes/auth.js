const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Kept if needed, but we rely on Firebase Token mostly
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register new user (Legacy/Local Auth - Optional)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    // This route is less relevant with Firebase Auth on frontend, 
    // but kept if you want to support direct DB creation without Firebase
    // OR if you want to manually create users.
    // Ideally, frontend uses Firebase and then Syncs.
    res.status(400).json({ message: 'Please use Firebase Signup on frontend' });
});

// @desc    Authenticate a user (Legacy/Local Auth - Optional)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    res.status(400).json({ message: 'Please use Firebase Login on frontend' });
});

// @desc    Sync Firebase User with MongoDB
// @route   POST /api/auth/firebase-login
// @access  Private (Protected by Firebase Token)
router.post('/firebase-login', protect, async (req, res) => {
    try {
        // req.user is already set by the protect middleware (which verifies Firebase Token)
        const user = req.user;

        // Update user info if needed
        if (req.body.name && user.name !== req.body.name) {
            user.name = req.body.name;
            await user.save();
        }

        if (req.body.role && user.role === 'buyer' && req.body.role !== 'buyer') {
            // Allow upgrading role on first sync if needed, or via admin panel. 
            // For now, accept what frontend claims only if currently buyer? 
            // Or just trust the DB. Let's trust DB.
            // But if it's the first time (created in middleware), we might want to set role.
            // Middleware sets default to buyer.
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            googleId: user.googleId,
            token: req.headers.authorization.split(' ')[1]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = router;
