import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Star, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import Button from '../ui/Button';

const HeroSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const floatingTickets = [
        {
            id: 1,
            title: 'Coldplay',
            type: 'Concert',
            price: '₹8,500',
            emoji: '🎵',
            delay: 0,
            position: 'left-[5%] top-[18%]',
            rotate: -12,
            duration: 6
        },
        {
            id: 2,
            title: 'Dune 3',
            type: 'Movie',
            price: '₹450',
            emoji: '🎬',
            delay: 0.3,
            position: 'right-[12%] top-[22%]',
            rotate: 8,
            duration: 7
        },
        {
            id: 3,
            title: 'IPL Final',
            type: 'Sports',
            price: '₹12,000',
            emoji: '🏏',
            delay: 0.6,
            position: 'left-[8%] bottom-[28%]',
            rotate: 15,
            duration: 5.5
        },
        {
            id: 4,
            title: 'Rajdhani Express',
            type: 'Train',
            price: '₹2,850',
            emoji: '🚆',
            delay: 0.9,
            position: 'right-[10%] bottom-[32%]',
            rotate: -8,
            duration: 6.5
        },
    ];

    const stats = [
        { value: '50K+', label: 'Tickets Sold', icon: '🎫' },
        { value: '25K+', label: 'Happy Users', icon: '😊' },
        { value: '99%', label: 'Success Rate', icon: '✨' },
        { value: '₹2Cr+', label: 'Saved by Users', icon: '💰' },
    ];

    return (
        <section ref={containerRef} className="relative min-h-screen pt-24 pb-16 overflow-hidden hero-bg">
            {/* Animated Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: i % 2 === 0 ? 'var(--neon-purple)' : 'var(--neon-cyan)',
                        }}
                        animate={{
                            y: [-20, -100],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </div>

            {/* Floating Tickets with Parallax */}
            <motion.div style={{ y: y1 }} className="absolute inset-0 pointer-events-none hidden lg:block">
                {floatingTickets.map((ticket) => (
                    <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 60, rotateY: -30 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{
                            delay: ticket.delay,
                            duration: 1,
                            type: "spring",
                            stiffness: 50
                        }}
                        className={`absolute ${ticket.position}`}
                    >
                        <motion.div
                            animate={{
                                y: [-10, 10, -10],
                                rotate: [ticket.rotate - 2, ticket.rotate + 2, ticket.rotate - 2]
                            }}
                            transition={{
                                duration: ticket.duration,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="floating-ticket w-52 cursor-pointer"
                            whileHover={{
                                scale: 1.1,
                                rotateY: 10,
                                boxShadow: "0 30px 60px rgba(168, 85, 247, 0.4)"
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{ticket.emoji}</span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                                    {ticket.type}
                                </span>
                            </div>
                            <div className="font-bold text-lg">{ticket.title}</div>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xl font-bold gradient-text">{ticket.price}</span>
                                <motion.div
                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                                    whileHover={{ scale: 1.2, rotate: 90 }}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[85vh] text-center"
            >
                {/* Animated Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="relative group"
                >
                    <motion.div
                        className="absolute inset-0 rounded-full bg-neon-purple/30 blur-xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-purple/10 border border-neon-purple/40 mb-8 backdrop-blur-sm">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-neon-purple" />
                        </motion.div>
                        <span className="text-sm text-neon-purple font-semibold">India's #1 Ticket Resale Platform</span>
                        <motion.div
                            className="flex items-center gap-1 ml-1"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-yellow-400 font-bold">4.9</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Headline with Enhanced Animation */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 50 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 max-w-5xl leading-tight"
                >
                    <span className="block">Buy & Sell Tickets.</span>
                    <motion.span
                        className="gradient-text inline-block"
                        animate={{
                            textShadow: [
                                "0 0 20px rgba(168, 85, 247, 0)",
                                "0 0 40px rgba(168, 85, 247, 0.5)",
                                "0 0 20px rgba(168, 85, 247, 0)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Safely.
                    </motion.span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed"
                >
                    Your unused ticket is someone's best night. Join{' '}
                    <span className="text-white font-semibold">25,000+</span> verified users
                    trading tickets securely.
                </motion.p>

                {/* CTAs with Enhanced Hover */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-16"
                >
                    <Link to="/browse">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Button size="lg" className="btn-glow text-lg px-10 py-4">
                                <span>Browse Tickets</span>
                                <motion.span
                                    className="ml-2 inline-block"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.span>
                            </Button>
                        </motion.div>
                    </Link>
                    <Link to="/sell">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="secondary" size="lg" className="text-lg px-10 py-4">
                                Sell Your Ticket
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Animated Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="text-center p-4 rounded-2xl glass-hover cursor-default"
                        >
                            <motion.div
                                className="text-2xl mb-2"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                            >
                                {stat.icon}
                            </motion.div>
                            <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-wrap items-center justify-center gap-8 mt-16"
                >
                    {[
                        { icon: Shield, text: '100% Verified', color: 'text-emerald-400' },
                        { icon: Zap, text: 'Instant Transfer', color: 'text-yellow-400' },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5"
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        >
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                            <span className="text-sm text-gray-300">{item.text}</span>
                        </motion.div>
                    ))}
                    <motion.div
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5"
                        whileHover={{ scale: 1.05 }}
                    >
                        <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-5 h-5" />
                        <span className="text-sm text-gray-300">Secured by Razorpay</span>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-gray-500"
                    >
                        <span className="text-xs uppercase tracking-wider">Scroll</span>
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
