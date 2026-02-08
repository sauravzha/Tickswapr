import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import Button from '../ui/Button';

const CTASection = () => {
    return (
        <section className="py-24 bg-dark-800 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-pink/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-12 md:p-16 text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/30 mb-6">
                        <Zap className="w-4 h-4 text-neon-pink" />
                        <span className="text-sm text-neon-pink font-medium">Start Trading Today</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Ready to{' '}
                        <span className="gradient-text">Buy or Sell</span>{' '}
                        Tickets?
                    </h2>

                    {/* Description */}
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                        Join thousands of happy users who trust TickSwapr for their ticket needs.
                        It's free to sign up and takes less than a minute.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login?signup=true">
                            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                                Create Free Account
                            </Button>
                        </Link>
                        <Link to="/browse">
                            <Button variant="secondary" size="lg">
                                Browse Tickets First
                            </Button>
                        </Link>
                    </div>

                    {/* Trust Note */}
                    <p className="text-sm text-gray-500 mt-8">
                        🔒 No credit card required • Free to sign up • Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
