import { motion } from 'framer-motion';
import { RefreshCcw, ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Refund = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <RefreshCcw className="w-8 h-8 text-neon-pink" />
                        <h1 className="text-3xl font-bold">Refund Policy</h1>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                        <p className="text-sm text-gray-500">Last updated: February 2026</p>

                        {/* Quick Summary */}
                        <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
                            <h3 className="text-lg font-semibold text-neon-purple mb-2">Quick Summary</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    Full refund if ticket is invalid or not delivered
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    24-hour window to report issues
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-400" />
                                    No refunds for event cancellations (contact organizer)
                                </li>
                            </ul>
                        </div>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Buyer Protection Guarantee</h2>
                            <p>
                                TickSwapr offers 100% Buyer Protection. If you receive an invalid ticket or
                                the seller fails to deliver, you are entitled to a full refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">2. Eligible Refund Scenarios</h2>
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 font-medium text-emerald-400 mb-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Full Refund Eligible
                                    </div>
                                    <ul className="text-sm ml-6 list-disc space-y-1">
                                        <li>Ticket not delivered within 24 hours</li>
                                        <li>Ticket is counterfeit or invalid</li>
                                        <li>Ticket details don't match listing (wrong date, wrong seat)</li>
                                        <li>Duplicate ticket already used by someone else</li>
                                    </ul>
                                </div>

                                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                    <div className="flex items-center gap-2 font-medium text-yellow-400 mb-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Partial Refund Cases
                                    </div>
                                    <ul className="text-sm ml-6 list-disc space-y-1">
                                        <li>Ticket is valid but significantly different from description</li>
                                        <li>Technical issues on our platform causing purchase errors</li>
                                    </ul>
                                </div>

                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                                    <div className="flex items-center gap-2 font-medium text-red-400 mb-1">
                                        <XCircle className="w-4 h-4" />
                                        Not Eligible for Refund
                                    </div>
                                    <ul className="text-sm ml-6 list-disc space-y-1">
                                        <li>Event is cancelled or postponed (contact event organizer)</li>
                                        <li>Buyer changed mind after purchase</li>
                                        <li>Buyer unable to attend the event</li>
                                        <li>Ticket resold to another party by buyer</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">3. How to Request a Refund</h2>
                            <ol className="list-decimal ml-6 space-y-2">
                                <li>Go to your Dashboard → My Orders</li>
                                <li>Select the order and click "Report Issue"</li>
                                <li>Describe the problem and upload evidence (screenshots, etc.)</li>
                                <li>Our team will review within 24-48 hours</li>
                                <li>If approved, refund will be processed within 5-7 business days</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Refund Timeline</h2>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2">Payment Method</th>
                                        <th className="text-left py-2">Refund Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-white/10">
                                        <td className="py-2">UPI</td>
                                        <td className="py-2">1-3 business days</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                        <td className="py-2">Debit Card</td>
                                        <td className="py-2">5-7 business days</td>
                                    </tr>
                                    <tr className="border-b border-white/10">
                                        <td className="py-2">Credit Card</td>
                                        <td className="py-2">5-7 business days</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Net Banking</td>
                                        <td className="py-2">5-7 business days</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Platform Fee Refund</h2>
                            <p>
                                In case of full refund, the platform fee will also be refunded. For partial refunds,
                                platform fee refund will be calculated proportionally.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">6. Seller Disputes</h2>
                            <p>
                                If a seller disputes a refund request, TickSwapr will investigate and make a final
                                decision based on evidence from both parties. All decisions are final.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">7. Contact Support</h2>
                            <p>
                                For refund inquiries:<br />
                                <span className="text-neon-pink">support@tickswapr.com</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default Refund;
