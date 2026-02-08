import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Eye, EyeOff, AlertTriangle } from 'lucide-react';

/**
 * ProtectedTicketImage - Blurs ticket images and hides QR codes until payment
 * Part of TickSwapr Guard AI system
 */
const ProtectedTicketImage = ({
    src,
    alt = "Ticket",
    isPaid = false,
    className = "",
    showPreview = true
}) => {
    const [showBlurred, setShowBlurred] = useState(!isPaid);
    const [imageError, setImageError] = useState(false);

    // If paid, show full image
    if (isPaid) {
        return (
            <div className={`relative overflow-hidden rounded-xl ${className}`}>
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                />
                {/* Verified badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                </div>
            </div>
        );
    }

    // Unpaid - show blurred with watermark
    return (
        <div className={`relative overflow-hidden rounded-xl ${className}`}>
            {/* Blurred Image */}
            <div className="relative">
                {!imageError ? (
                    <img
                        src={src}
                        alt={alt}
                        className={`w-full h-full object-cover transition-all duration-300 ${showBlurred ? 'blur-lg scale-105' : ''
                            }`}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-gray-500" />
                    </div>
                )}

                {/* Blur Overlay */}
                {showBlurred && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 backdrop-blur-md bg-dark-900/60"
                    />
                )}
            </div>

            {/* Watermark */}
            {showBlurred && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    {/* Lock Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center mb-4 shadow-lg shadow-neon-purple/30"
                    >
                        <Lock className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Watermark Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <p className="text-white font-bold text-lg mb-1">
                            Protected Ticket
                        </p>
                        <p className="text-gray-300 text-sm max-w-[200px]">
                            Not valid until purchased on TickSwapr
                        </p>
                    </motion.div>

                    {/* Diagonal Watermark Pattern */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute whitespace-nowrap text-white font-bold text-xs"
                                style={{
                                    top: `${i * 40}px`,
                                    left: '-50%',
                                    width: '200%',
                                    transform: 'rotate(-30deg)',
                                }}
                            >
                                TICKSWAPR • NOT VALID UNTIL PURCHASED • TICKSWAPR • NOT VALID UNTIL PURCHASED •
                            </div>
                        ))}
                    </div>

                    {/* Preview Toggle (optional) */}
                    {showPreview && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onClick={() => setShowBlurred(!showBlurred)}
                            className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm text-white/80"
                        >
                            {showBlurred ? (
                                <>
                                    <Eye className="w-4 h-4" />
                                    <span>Preview</span>
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-4 h-4" />
                                    <span>Hide</span>
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            )}

            {/* Security Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/90 text-dark-900 text-xs font-bold">
                <Lock className="w-3 h-3" />
                <span>Protected</span>
            </div>

            {/* QR Code Warning */}
            <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-900/90 border border-yellow-500/30 text-xs">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-300">
                        QR code & ticket details hidden until purchase
                    </span>
                </div>
            </div>
        </div>
    );
};

/**
 * ProtectedSellerInfo - Shows seller contact only after payment
 */
export const ProtectedSellerInfo = ({ seller, isPaid }) => {
    if (!seller) return null;

    const maskInfo = (info) => {
        if (!info) return '••••••••';
        if (info.includes('@')) {
            const [local, domain] = info.split('@');
            return `${local.substring(0, 2)}•••@${domain}`;
        }
        if (info.length >= 10) {
            return `${info.substring(0, 4)}••••${info.substring(info.length - 2)}`;
        }
        return '••••••••';
    };

    return (
        <div className={`p-4 rounded-xl ${isPaid ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-white/5 border border-white/10'}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-400">Seller Contact</span>
                {isPaid ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <ShieldCheck className="w-3 h-3" />
                        Unlocked
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-xs text-yellow-400">
                        <Lock className="w-3 h-3" />
                        Locked
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Name</span>
                    <span className="font-medium">{seller.name}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Email</span>
                    <span className={`font-medium ${!isPaid && 'blur-sm select-none'}`}>
                        {isPaid ? seller.email : maskInfo(seller.email)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Phone</span>
                    <span className={`font-medium ${!isPaid && 'blur-sm select-none'}`}>
                        {isPaid ? seller.phone : maskInfo(seller.phone)}
                    </span>
                </div>
            </div>

            {!isPaid && (
                <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-500 text-center">
                        🔒 Complete purchase to unlock seller contact
                    </p>
                </div>
            )}
        </div>
    );
};

/**
 * EscrowStatusBadge - Shows escrow status
 */
export const EscrowStatusBadge = ({ status, holdDays }) => {
    const statusConfig = {
        INSTANT_RELEASE: {
            color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            icon: ShieldCheck,
            label: 'Instant Release'
        },
        HOLD_FOR_CONFIRMATION: {
            color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            icon: Lock,
            label: `Hold (${holdDays} days)`
        },
        MANUAL_ADMIN_REVIEW: {
            color: 'bg-red-500/20 text-red-400 border-red-500/30',
            icon: AlertTriangle,
            label: 'Under Review'
        }
    };

    const config = statusConfig[status] || statusConfig.HOLD_FOR_CONFIRMATION;
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.color}`}>
            <Icon className="w-3 h-3" />
            <span>{config.label}</span>
        </div>
    );
};

export default ProtectedTicketImage;
