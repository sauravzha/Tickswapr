import { motion } from 'framer-motion';
import { Search, Upload, CreditCard, Ticket, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
    const buyerSteps = [
        {
            icon: Search,
            title: 'Browse Tickets',
            description: 'Search for tickets by event, date, or category'
        },
        {
            icon: CheckCircle,
            title: 'Check Verification',
            description: 'All tickets are verified by AI + manual review'
        },
        {
            icon: CreditCard,
            title: 'Pay Securely',
            description: 'Pay via Razorpay. Money held until confirmation'
        },
        {
            icon: Ticket,
            title: 'Get Your Ticket',
            description: 'Receive your ticket instantly after purchase'
        },
    ];

    const sellerSteps = [
        {
            icon: Upload,
            title: 'List Your Ticket',
            description: 'Upload ticket details and set your price'
        },
        {
            icon: CheckCircle,
            title: 'Get Verified',
            description: 'Our team verifies your ticket authenticity'
        },
        {
            icon: Search,
            title: 'Find a Buyer',
            description: 'Your listing goes live for thousands of users'
        },
        {
            icon: CreditCard,
            title: 'Get Paid',
            description: 'Receive payment directly to your wallet'
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-dark-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        How{' '}
                        <span className="gradient-text">TickSwapr</span>{' '}
                        Works
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Simple, secure, and transparent ticket trading in just a few steps
                    </p>
                </motion.div>

                {/* Two Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Buyers */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                                <Ticket className="w-6 h-6 text-neon-cyan" />
                            </div>
                            <h3 className="text-2xl font-bold">For Buyers</h3>
                        </div>

                        <div className="space-y-6">
                            {buyerSteps.map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                                            <step.icon className="w-5 h-5 text-neon-cyan" />
                                        </div>
                                        {index < buyerSteps.length - 1 && (
                                            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-b from-neon-cyan/30 to-transparent" />
                                        )}
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="font-semibold mb-1">{step.title}</h4>
                                        <p className="text-sm text-gray-400">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sellers */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                                <Upload className="w-6 h-6 text-neon-purple" />
                            </div>
                            <h3 className="text-2xl font-bold">For Sellers</h3>
                        </div>

                        <div className="space-y-6">
                            {sellerSteps.map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center">
                                            <step.icon className="w-5 h-5 text-neon-purple" />
                                        </div>
                                        {index < sellerSteps.length - 1 && (
                                            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-b from-neon-purple/30 to-transparent" />
                                        )}
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="font-semibold mb-1">{step.title}</h4>
                                        <p className="text-sm text-gray-400">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
