/**
 * TickSwapr Guard AI - Commission & Fraud Protection System
 * 
 * Core responsibilities:
 * - Prevent off-platform payments
 * - Detect contact info sharing before payment
 * - Risk scoring and intent classification
 * - Escrow decision logic
 */

// ==================== DETECTION PATTERNS ====================

// Phone number patterns (Indian and International)
const PHONE_PATTERNS = [
    /(\+91[\s-]?)?[6-9]\d{9}/g,                      // Indian mobile
    /(\+91[\s-]?)?\d{5}[\s-]?\d{5}/g,                // With spaces
    /\b\d{10}\b/g,                                    // Plain 10 digits
    /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g,  // International
];

// Email patterns
const EMAIL_PATTERNS = [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    /[a-zA-Z0-9._%+-]+\s*[@at]\s*[a-zA-Z0-9.-]+\s*[.dot]\s*[a-zA-Z]{2,}/gi,
];

// UPI patterns
const UPI_PATTERNS = [
    /[a-zA-Z0-9._-]+@[a-zA-Z]{2,}/g,                 // UPI ID format
    /\b(paytm|gpay|phonepe|upi)\b/gi,                // Payment app mentions
];

// Social media patterns
const SOCIAL_PATTERNS = [
    /\b(whatsapp|whats\s*app|wa|telegram|tg|instagram|insta|ig)\b/gi,
    /@[a-zA-Z0-9_]{3,}/g,                            // Social handles
    /t\.me\/[a-zA-Z0-9_]+/g,                         // Telegram links
];

// Bypass intent keywords
const BYPASS_KEYWORDS = {
    HIGH: [
        'direct payment', 'pay directly', 'pay me directly', 'outside platform',
        'cheaper if', 'save commission', 'no commission', 'without platform',
        'bank transfer', 'google pay me', 'paytm me', 'phonepe me',
        'cash payment', 'meet and pay', 'pay outside'
    ],
    MEDIUM: [
        'call me', 'text me', 'message me', 'contact me', 'reach me',
        'whatsapp', 'telegram', 'personal number', 'my number',
        'discuss outside', 'talk on phone'
    ],
    LOW: [
        'can we talk', 'later discuss', 'after this', 'personally',
        'offline', 'in person'
    ]
};

// ==================== GUARD AI CLASS ====================

class GuardAI {
    constructor() {
        this.riskScores = new Map(); // userId -> riskScore
        this.violations = new Map(); // userId -> violations[]
    }

    /**
     * Analyze a message for contact info and bypass intent
     * @param {string} message - The message to analyze
     * @param {string} userId - User ID
     * @param {boolean} isPaid - Whether payment is complete
     * @returns {Object} Analysis result with action and details
     */
    analyzeMessage(message, userId, isPaid = false) {
        // If payment is complete, allow contact sharing
        if (isPaid) {
            return {
                action: 'ALLOW',
                reason: 'Payment completed - contact sharing allowed',
                riskScoreDelta: 0,
                userMessage: null,
                adminNote: null
            };
        }

        const text = message.toLowerCase();
        const detections = [];

        // Check for phone numbers
        for (const pattern of PHONE_PATTERNS) {
            const matches = message.match(pattern);
            if (matches) {
                detections.push({ type: 'PHONE', matches, severity: 'HIGH' });
            }
        }

        // Check for emails
        for (const pattern of EMAIL_PATTERNS) {
            const matches = message.match(pattern);
            if (matches) {
                detections.push({ type: 'EMAIL', matches, severity: 'HIGH' });
            }
        }

        // Check for UPI IDs
        for (const pattern of UPI_PATTERNS) {
            const matches = message.match(pattern);
            if (matches) {
                detections.push({ type: 'UPI', matches, severity: 'HIGH' });
            }
        }

        // Check for social media
        for (const pattern of SOCIAL_PATTERNS) {
            const matches = message.match(pattern);
            if (matches) {
                detections.push({ type: 'SOCIAL', matches, severity: 'MEDIUM' });
            }
        }

        // Check bypass intent
        const intentLevel = this.classifyIntent(text);

        // Determine action based on detections
        if (detections.some(d => d.severity === 'HIGH') || intentLevel === 'HIGH') {
            this.recordViolation(userId, 'HIGH', detections, message);
            return {
                action: 'BLOCK',
                reason: `Detected: ${detections.map(d => d.type).join(', ')} | Intent: ${intentLevel}`,
                riskScoreDelta: 20,
                userMessage: '🛡️ For your safety, contact details can only be shared after payment is complete on TickSwapr.',
                adminNote: `User attempted to share contact info. Detections: ${JSON.stringify(detections)}`
            };
        }

        if (detections.length > 0 || intentLevel === 'MEDIUM') {
            this.recordViolation(userId, 'MEDIUM', detections, message);
            return {
                action: 'WARN',
                reason: `Warning: Potential bypass attempt | Intent: ${intentLevel}`,
                riskScoreDelta: 10,
                userMessage: '⚠️ Please complete your purchase on TickSwapr to unlock seller contact details.',
                adminNote: `Warning issued for potential bypass. Intent: ${intentLevel}`
            };
        }

        if (intentLevel === 'LOW') {
            return {
                action: 'ALLOW',
                reason: 'Low risk message',
                riskScoreDelta: 0,
                userMessage: null,
                adminNote: null
            };
        }

        return {
            action: 'ALLOW',
            reason: 'Clean message',
            riskScoreDelta: 0,
            userMessage: null,
            adminNote: null
        };
    }

    /**
     * Classify bypass intent level
     * @param {string} text - Lowercased message text
     * @returns {'HIGH'|'MEDIUM'|'LOW'|'NONE'}
     */
    classifyIntent(text) {
        for (const keyword of BYPASS_KEYWORDS.HIGH) {
            if (text.includes(keyword)) return 'HIGH';
        }
        for (const keyword of BYPASS_KEYWORDS.MEDIUM) {
            if (text.includes(keyword)) return 'MEDIUM';
        }
        for (const keyword of BYPASS_KEYWORDS.LOW) {
            if (text.includes(keyword)) return 'LOW';
        }
        return 'NONE';
    }

    /**
     * Record a violation for a user
     */
    recordViolation(userId, severity, detections, message) {
        if (!this.violations.has(userId)) {
            this.violations.set(userId, []);
        }
        this.violations.get(userId).push({
            timestamp: new Date().toISOString(),
            severity,
            detections,
            messageSample: message.substring(0, 100)
        });

        // Update risk score
        const currentScore = this.riskScores.get(userId) || 0;
        const delta = severity === 'HIGH' ? 20 : severity === 'MEDIUM' ? 10 : 5;
        this.riskScores.set(userId, Math.min(100, currentScore + delta));
    }

    /**
     * Get user's risk score
     * @param {string} userId
     * @returns {number} Risk score 0-100
     */
    getRiskScore(userId) {
        return this.riskScores.get(userId) || 0;
    }

    /**
     * Get risk level from score
     * @param {number} score
     * @returns {'NORMAL'|'RESTRICTED'|'BLOCKED'}
     */
    getRiskLevel(score) {
        if (score < 30) return 'NORMAL';
        if (score < 60) return 'RESTRICTED';
        return 'BLOCKED';
    }

    /**
     * Get user violations
     */
    getViolations(userId) {
        return this.violations.get(userId) || [];
    }

    /**
     * Decide escrow action based on risk factors
     * @param {Object} params
     * @returns {Object} Escrow decision
     */
    decideEscrow({ sellerId, ticketPrice, ticketType, sellerReputation = 0 }) {
        const riskScore = this.getRiskScore(sellerId);
        const violations = this.getViolations(sellerId);

        // High risk seller
        if (riskScore >= 60 || violations.length >= 3) {
            return {
                action: 'MANUAL_ADMIN_REVIEW',
                holdDays: 7,
                reason: 'High risk seller - manual review required',
                adminNote: `Risk Score: ${riskScore}, Violations: ${violations.length}`
            };
        }

        // Medium risk or high value ticket
        if (riskScore >= 30 || ticketPrice > 10000 || violations.length >= 1) {
            return {
                action: 'HOLD_FOR_CONFIRMATION',
                holdDays: 3,
                reason: 'Standard escrow hold for buyer confirmation',
                adminNote: `Medium risk. Holding payment for ${3} days.`
            };
        }

        // Low risk, good reputation
        if (sellerReputation >= 4.5 && riskScore < 10) {
            return {
                action: 'INSTANT_RELEASE',
                holdDays: 0,
                reason: 'Trusted seller - instant release',
                adminNote: 'Seller has excellent reputation'
            };
        }

        // Default: short hold
        return {
            action: 'HOLD_FOR_CONFIRMATION',
            holdDays: 1,
            reason: 'Standard escrow hold',
            adminNote: 'Normal transaction'
        };
    }

    /**
     * Analyze ticket description for contact info
     */
    analyzeTicketDescription(description) {
        return this.analyzeMessage(description, 'system', false);
    }

    /**
     * Check if QR code or barcode is visible in image
     * (Placeholder - would need actual image processing)
     */
    shouldBlurTicketImage(isPaid) {
        return !isPaid;
    }

    /**
     * Generate admin summary for a user
     */
    generateAdminSummary(userId, userName) {
        const riskScore = this.getRiskScore(userId);
        const violations = this.getViolations(userId);
        const riskLevel = this.getRiskLevel(riskScore);

        return {
            userId,
            userName,
            riskScore,
            riskLevel,
            totalViolations: violations.length,
            recentViolations: violations.slice(-5),
            suggestedAction: riskScore >= 60 ? 'SUSPEND_ACCOUNT' :
                riskScore >= 30 ? 'RESTRICT_FEATURES' : 'NONE',
            summary: `User has ${violations.length} violation(s). Risk score: ${riskScore}/100. Status: ${riskLevel}`
        };
    }

    /**
     * Reset user risk (for admin use)
     */
    resetUserRisk(userId) {
        this.riskScores.set(userId, 0);
        this.violations.set(userId, []);
    }
}

// Export singleton instance
export const guardAI = new GuardAI();

// Export utility functions
export const analyzeMessage = (msg, userId, isPaid) => guardAI.analyzeMessage(msg, userId, isPaid);
export const getRiskScore = (userId) => guardAI.getRiskScore(userId);
export const getRiskLevel = (score) => guardAI.getRiskLevel(score);
export const decideEscrow = (params) => guardAI.decideEscrow(params);
export const getViolations = (userId) => guardAI.getViolations(userId);
export const generateAdminSummary = (userId, userName) => guardAI.generateAdminSummary(userId, userName);

export default guardAI;
