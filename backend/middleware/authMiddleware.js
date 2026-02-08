import admin from 'firebase-admin';
import User from '../models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Initialize Firebase Admin
try {
    if (!admin.apps.length) {
        let credential;
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            // Fix newlines in private key
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }
            credential = admin.credential.cert(serviceAccount);
            admin.initializeApp({ credential });
            console.log('✅ Firebase Admin Initialized with Service Account');
        } else {
            // Fallback for when no service account is provided (not ideal for production)
            console.warn('⚠️ No FIREBASE_SERVICE_ACCOUNT found. Auth might fail.');
        }
    }
} catch (error) {
    console.error('❌ Firebase Admin Init Failed:', error.message);
}

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify Firebase ID Token
            let decodedToken;
            try {
                decodedToken = await admin.auth().verifyIdToken(token);
            } catch (verifyError) {
                console.warn('⚠️ Token Verification Failed:', verifyError.message);
                throw verifyError;
            }

            const { uid, email, name, picture } = decodedToken;

            // Find or Create User in MongoDB
            let user = await User.findOne({ email });

            if (!user) {
                console.log('👤 Creating new user in MongoDB...');

                // STRICT ADMIN CHECK
                const isAdminEmail = email === 'jhasaurav562@gmail.com';

                user = await User.create({
                    name: name || 'User',
                    email: email,
                    role: isAdminEmail ? 'admin' : 'buyer', // Only specific email gets admin role
                    googleId: uid
                });
            } else {
                // Ensure admin role is correct 
                if (email === 'jhasaurav562@gmail.com' && user.role !== 'admin') {
                    user.role = 'admin';
                    await user.save();
                }
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('❌ Auth Middleware Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export { protect, adminCheck };
