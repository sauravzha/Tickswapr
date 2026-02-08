import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Check, AlertCircle, Heart, ArrowUpRight, Users } from 'lucide-react';
import { useState } from 'react';
import Badge from '../ui/Badge';

const TicketCard = ({ ticket }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const {
        id,
        title,
        category,
        eventDate,
        venue,
        originalPrice,
        sellingPrice,
        imageUrl,
        status,
        isUrgent,
        quantity = 1,
        seller
    } = ticket;

    const discount = originalPrice ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) : 0;

    const getCategoryEmoji = (cat) => {
        const emojis = {
            concert: '🎵',
            movie: '🎬',
            train: '🚆',
            bus: '🚌',
            sports: '⚽'
        };
        return emojis[cat] || '🎫';
    };

    return (
        <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="group relative"
        >
            {/* Glow effect on hover */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            <Link to={`/ticket/${id}`}>
                <div className="relative glass-card overflow-hidden">
                    {/* Image Section */}
                    <div className="relative h-52 overflow-hidden">
                        <motion.img
                            src={imageUrl || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400'}
                            alt={title}
                            className="w-full h-full object-cover"
                            animate={{ scale: isHovered ? 1.1 : 1 }}
                            transition={{ duration: 0.5 }}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />

                        {/* Category & Urgent badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Badge variant={category}>
                                    <span className="mr-1">{getCategoryEmoji(category)}</span>
                                    {category}
                                </Badge>
                            </motion.div>
                            {isUrgent && (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Badge variant="urgent">🔥 Hot</Badge>
                                </motion.div>
                            )}
                        </div>

                        {/* Status & Like button */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                            {status === 'verified' && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30"
                                >
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-xs text-emerald-400 font-medium">Verified</span>
                                </motion.div>
                            )}
                            {status === 'pending' && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30">
                                    <AlertCircle className="w-3 h-3 text-yellow-400" />
                                    <span className="text-xs text-yellow-400 font-medium">Pending</span>
                                </div>
                            )}
                            <motion.button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsLiked(!isLiked);
                                }}
                                whileTap={{ scale: 0.8 }}
                                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                            >
                                <Heart
                                    className={`w-4 h-4 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-white/60'}`}
                                />
                            </motion.button>
                        </div>

                        {/* Discount badge */}
                        {discount > 0 && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-xs font-bold shadow-lg shadow-emerald-500/30"
                            >
                                -{discount}% OFF
                            </motion.div>
                        )}

                        {/* Quantity badge */}
                        {quantity > 1 && (
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs">
                                <Users className="w-3 h-3" />
                                <span>{quantity} tickets</span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                        {/* Title */}
                        <h3 className="font-bold text-lg mb-3 line-clamp-1 group-hover:gradient-text transition-all duration-300">
                            {title}
                        </h3>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                            <motion.div
                                className="flex items-center gap-2 text-sm text-gray-400"
                                animate={{ x: isHovered ? 5 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Calendar className="w-4 h-4 text-neon-purple flex-shrink-0" />
                                <span>{new Date(eventDate).toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short'
                                })}</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-2 text-sm text-gray-400"
                                animate={{ x: isHovered ? 5 : 0 }}
                                transition={{ duration: 0.2, delay: 0.05 }}
                            >
                                <MapPin className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                                <span className="line-clamp-1">{venue}</span>
                            </motion.div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-end justify-between pt-3 border-t border-white/5">
                            <div>
                                {originalPrice && originalPrice !== sellingPrice && (
                                    <div className="text-xs text-gray-500 line-through">
                                        ₹{originalPrice.toLocaleString()}
                                    </div>
                                )}
                                <div className="text-2xl font-bold">
                                    <span className="gradient-text">₹{sellingPrice?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* View button - appears on hover */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-sm font-semibold"
                            >
                                View
                                <ArrowUpRight className="w-4 h-4" />
                            </motion.div>

                            {/* Seller avatar - hidden on hover */}
                            <motion.div
                                animate={{ opacity: isHovered ? 0 : 1 }}
                                className="absolute right-5 bottom-5"
                            >
                                {seller && (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-sm font-bold ring-2 ring-dark-900">
                                        {seller.name?.charAt(0) || 'S'}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: isHovered ? '100%' : '-100%' }}
                        transition={{ duration: 0.6 }}
                    />
                </div>
            </Link>
        </motion.div>
    );
};

export default TicketCard;
