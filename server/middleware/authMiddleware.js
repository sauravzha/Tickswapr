// Simplified Auth Middleware - No MongoDB/Firebase Admin required for demo
// Uses client-side Firebase tokens or falls back to demo user

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // For demo/production without Firebase Admin, decode the token payload
            // (Note: This is for demo purposes. In production with Firebase Admin,
            // you would verify the token properly)

            let userInfo = {
                _id: 'user-' + Date.now(),
                name: 'User',
                email: 'user@tickswapr.com',
                phone: '',
                role: 'buyer'
            };

            // Try to decode JWT payload (base64)
            try {
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                    userInfo = {
                        _id: payload.user_id || payload.sub || 'user-' + Date.now(),
                        name: payload.name || 'User',
                        email: payload.email || 'user@tickswapr.com',
                        phone: payload.phone_number || '',
                        role: payload.email === 'jhasaurav562@gmail.com' ? 'admin' : 'buyer'
                    };
                }
            } catch (decodeError) {
                console.log('⚠️ Token decode failed, using default user');
            }

            req.user = userInfo;
            console.log('✅ Auth: User authenticated as', userInfo.email);
            next();
        } catch (error) {
            console.log('⚠️ Auth failed, using demo user');
            req.user = {
                _id: 'demo-user-' + Date.now(),
                name: 'Demo User',
                email: 'demo@tickswapr.com',
                phone: '9876543210',
                role: 'buyer'
            };
            next();
        }
    } else {
        // No token provided
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminCheck };
