import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Music, Film, Train, Bus, Trophy, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const CategoryCard = ({ category, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);

    const springConfig = { stiffness: 300, damping: 20 };
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: rotateXSpring,
                rotateY: rotateYSpring,
                transformStyle: 'preserve-3d'
            }}
            className="perspective cursor-pointer"
        >
            <Link to={`/browse?category=${category.id}`}>
                <div className="relative group">
                    {/* Glow effect */}
                    <motion.div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
                    />

                    <div className="relative glass-card p-6 md:p-8 text-center h-full overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                                backgroundSize: '20px 20px'
                            }} />
                        </div>

                        {/* 3D Icon Container */}
                        <motion.div
                            animate={{
                                y: isHovered ? -10 : 0,
                                scale: isHovered ? 1.1 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative mb-5 flex justify-center"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Icon glow */}
                            <motion.div
                                className={`absolute w-20 h-20 rounded-3xl bg-gradient-to-br ${category.color} blur-2xl`}
                                animate={{ opacity: isHovered ? 0.6 : 0.2 }}
                            />

                            {/* Icon box */}
                            <motion.div
                                animate={{ rotateY: isHovered ? 15 : 0 }}
                                className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-2xl`}
                                style={{ transform: 'translateZ(30px)' }}
                            >
                                <category.icon className="w-9 h-9 text-white drop-shadow-lg" />

                                {/* Shine effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/30 via-transparent to-transparent"
                                    animate={{ opacity: isHovered ? 1 : 0.5 }}
                                />
                            </motion.div>

                            {/* Emoji floating */}
                            <motion.div
                                className="absolute -right-2 -top-2 text-2xl"
                                animate={{
                                    y: isHovered ? [-5, 5, -5] : 0,
                                    scale: isHovered ? 1.2 : 1,
                                }}
                                transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                            >
                                {category.emoji}
                            </motion.div>
                        </motion.div>

                        {/* Name */}
                        <motion.h3
                            animate={{ y: isHovered ? -5 : 0 }}
                            className="font-bold text-lg md:text-xl mb-2 group-hover:gradient-text transition-all"
                        >
                            {category.name}
                        </motion.h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-3">
                            {category.description}
                        </p>

                        {/* Count badge */}
                        <motion.div
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.color} bg-opacity-20`}
                            style={{ background: `linear-gradient(135deg, ${category.startColor}20, ${category.endColor}20)` }}
                        >
                            <span className="text-white">{category.count}</span>
                        </motion.div>

                        {/* Arrow - appears on hover */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                            className="absolute bottom-4 right-4"
                        >
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                                <ArrowRight className="w-4 h-4 text-white" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const CategorySection = () => {
    const categories = [
        {
            id: 'concert',
            name: 'Concerts',
            icon: Music,
            color: 'from-purple-500 to-pink-500',
            startColor: '#a855f7',
            endColor: '#ec4899',
            emoji: '🎵',
            description: 'Live music vibes',
            count: '2.5K+ tickets'
        },
        {
            id: 'movie',
            name: 'Movies',
            icon: Film,
            color: 'from-red-500 to-orange-500',
            startColor: '#ef4444',
            endColor: '#f97316',
            emoji: '🎬',
            description: 'Cinema premieres',
            count: '5K+ tickets'
        },
        {
            id: 'train',
            name: 'Trains',
            icon: Train,
            color: 'from-cyan-500 to-blue-500',
            startColor: '#22d3ee',
            endColor: '#3b82f6',
            emoji: '🚆',
            description: 'Railway journeys',
            count: '10K+ tickets'
        },
        {
            id: 'bus',
            name: 'Buses',
            icon: Bus,
            color: 'from-green-500 to-emerald-500',
            startColor: '#22c55e',
            endColor: '#10b981',
            emoji: '🚌',
            description: 'Bus travels',
            count: '8K+ tickets'
        },
        {
            id: 'sports',
            name: 'Sports',
            icon: Trophy,
            color: 'from-orange-500 to-yellow-500',
            startColor: '#f97316',
            endColor: '#eab308',
            emoji: '⚽',
            description: 'Live matches',
            count: '3K+ tickets'
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-sm text-gray-400 mb-4"
                    >
                        ✨ All Categories
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Find Tickets in{' '}
                        <span className="gradient-text">Every Category</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        From electrifying concerts to last-minute train tickets — we've got you covered
                    </p>
                </motion.div>

                {/* Categories Grid with 3D effect */}
                <div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
                    style={{ perspective: '1000px' }}
                >
                    {categories.map((category, index) => (
                        <CategoryCard key={category.id} category={category} index={index} />
                    ))}
                </div>

                {/* View All with animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <Link to="/browse">
                        <motion.button
                            whileHover={{ scale: 1.05, gap: '12px' }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-neon-purple/50 transition-colors group"
                        >
                            <span className="text-gray-300 group-hover:text-white transition-colors">
                                View All Categories
                            </span>
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="w-4 h-4 text-neon-purple" />
                            </motion.span>
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CategorySection;
