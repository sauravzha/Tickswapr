import { motion } from 'framer-motion';
import { Shield, Scan, UserCheck, CreditCard, Clock, HeadphonesIcon } from 'lucide-react';

const TrustSection = () => {
    const features = [
        {
            icon: Scan,
            title: 'AI Verification',
            description: 'Our AI scans every ticket to detect duplicates and ensure authenticity',
            color: 'text-neon-purple',
            bg: 'bg-neon-purple/10'
        },
        {
            icon: UserCheck,
            title: 'Manual Review',
            description: 'Expert team manually verifies high-value and urgent tickets',
            color: 'text-neon-cyan',
            bg: 'bg-neon-cyan/10'
        },
        {
            icon: Shield,
            title: '100% Money Back',
            description: 'Full refund if the ticket turns out to be invalid',
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10'
        },
        {
            icon: CreditCard,
            title: 'Secure Payments',
            description: 'Razorpay-powered escrow keeps your money safe until confirmation',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            icon: Clock,
            title: 'Instant Transfer',
            description: 'Get your tickets delivered instantly after purchase',
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10'
        },
        {
            icon: HeadphonesIcon,
            title: '24/7 Support',
            description: 'Our support team is always ready to help with any issues',
            color: 'text-pink-400',
            bg: 'bg-pink-400/10'
        },
    ];

    return (
        <section className="py-24 bg-dark-800 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400 font-medium">Verified & Secure</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Trust{' '}
                        <span className="gradient-text">TickSwapr?</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We combine AI technology with human expertise to ensure every ticket is genuine
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-8"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 glass-card p-8"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '0.01%', label: 'Fraud Rate', color: 'text-emerald-400' },
                            { value: '< 2 min', label: 'Avg Verification Time', color: 'text-cyan-400' },
                            { value: '99.9%', label: 'Uptime', color: 'text-purple-400' },
                            { value: '4.9/5', label: 'User Rating', color: 'text-yellow-400' },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustSection;
