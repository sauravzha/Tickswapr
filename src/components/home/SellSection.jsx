import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Wallet, Shield, Zap, TrendingUp,
    ArrowRight, Upload, CheckCircle,
    DollarSign, Clock, Users
} from 'lucide-react';
import Button from '../ui/Button';

const SellSection = () => {
    const benefits = [
        {
            icon: Wallet,
            title: 'Earn Money',
            description: "Turn unused tickets into cash instantly",
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Shield,
            title: '100% Secure',
            description: 'Protected transactions with Razorpay',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Zap,
            title: 'Fast Payouts',
            description: 'Get paid within 24 hours of sale',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: TrendingUp,
            title: 'Best Prices',
            description: 'Set your own price, keep 95%',
            color: 'from-purple-500 to-pink-500'
        }
    ];

    const steps = [
        { number: '01', title: 'Upload Ticket', desc: 'Add your ticket details and photo' },
        { number: '02', title: 'Get Verified', desc: 'Quick AI verification process' },
        { number: '03', title: 'Set Price', desc: 'You decide what to charge' },
        { number: '04', title: 'Get Paid', desc: 'Money sent after confirmation' }
    ];

    const stats = [
        { value: '₹2 Cr+', label: 'Paid to Sellers' },
        { value: '24hrs', label: 'Avg Payout Time' },
        { value: '15K+', label: 'Active Sellers' },
        { value: '95%', label: 'You Keep' }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-green/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-purple/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6"
                    >
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400 font-medium">Start Earning Today</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Have Unused Tickets?{' '}
                        <span className="gradient-text-alt">Sell Them!</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Don't let your tickets go to waste. List them on TickSwapr and
                        connect with thousands of eager buyers.
                    </p>
                </motion.div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    {/* Left - Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ x: 10, scale: 1.02 }}
                                className="flex items-start gap-4 p-5 rounded-2xl glass-hover cursor-default"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <benefit.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                                    <p className="text-gray-400">{benefit.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Right - CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />

                        <div className="relative glass-premium p-8 md:p-10 rounded-3xl">
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                                ✨ Free to List
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                List Your First Ticket
                            </h3>
                            <p className="text-gray-400 mb-8">
                                Join 15,000+ sellers who trust TickSwapr to sell their tickets safely.
                            </p>

                            {/* Steps */}
                            <div className="space-y-4 mb-8">
                                {steps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-neon-cyan">
                                            {step.number}
                                        </div>
                                        <div>
                                            <div className="font-medium">{step.title}</div>
                                            <div className="text-sm text-gray-500">{step.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/sell" className="flex-1">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                        <Button className="w-full justify-center gap-2 py-4 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500">
                                            <Upload className="w-5 h-5" />
                                            Start Selling
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link to="/browse" className="flex-1">
                                    <Button variant="secondary" className="w-full justify-center py-4">
                                        See Listings
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust badges */}
                            <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    <span>No listing fees</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Clock className="w-4 h-4 text-cyan-400" />
                                    <span>2 min setup</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="text-center p-6 rounded-2xl glass-card"
                        >
                            <div className="text-2xl md:text-3xl font-bold gradient-text-alt mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Testimonial teaser */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                        <div className="flex -space-x-2">
                            {['🧑', '👩', '👨', '👧'].map((emoji, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm ring-2 ring-dark-900">
                                    {emoji}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-400">
                            <span className="text-white font-medium">15,000+</span> sellers trust TickSwapr
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SellSection;
