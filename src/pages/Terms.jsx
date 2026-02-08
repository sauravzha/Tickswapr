import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
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
                        <Shield className="w-8 h-8 text-neon-purple" />
                        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                        <p className="text-sm text-gray-500">Last updated: February 2026</p>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using TickSwapr ("Platform"), you agree to be bound by these Terms & Conditions.
                                If you do not agree, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">2. Platform Description</h2>
                            <p>
                                TickSwapr is a peer-to-peer ticket resale marketplace that connects buyers and sellers of event tickets.
                                We act as an intermediary and do not own or sell tickets directly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">3. User Eligibility</h2>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>You must be at least 18 years old to use this platform</li>
                                <li>You must provide accurate and complete registration information</li>
                                <li>You are responsible for maintaining account security</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Seller Responsibilities</h2>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Sellers must only list genuine, valid tickets they own</li>
                                <li>Ticket details must be accurate (date, venue, seat numbers)</li>
                                <li>Fraudulent listings will result in immediate account termination</li>
                                <li>Sellers must transfer tickets within 24 hours of payment confirmation</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Buyer Responsibilities</h2>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Verify ticket details before purchasing</li>
                                <li>Report any issues within 24 hours of receiving the ticket</li>
                                <li>Do not attempt to reverse payments fraudulently</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">6. Platform Fees</h2>
                            <p>
                                TickSwapr charges a service fee of 5-12% on each transaction, depending on the ticket value.
                                This fee is added to the ticket price at checkout and is non-refundable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">7. Payment Processing</h2>
                            <p>
                                All payments are processed securely through Razorpay. TickSwapr does not store your
                                payment card details. Transactions are subject to Razorpay's terms of service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">8. Dispute Resolution</h2>
                            <p>
                                In case of disputes between buyers and sellers, TickSwapr will mediate and make a final
                                decision based on available evidence. Our decision is binding on all parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">9. Prohibited Activities</h2>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>Selling counterfeit or invalid tickets</li>
                                <li>Price gouging beyond reasonable limits</li>
                                <li>Creating multiple accounts to circumvent bans</li>
                                <li>Using automated bots or scrapers</li>
                                <li>Harassment of other users</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">10. Limitation of Liability</h2>
                            <p>
                                TickSwapr is not liable for any losses arising from ticket authenticity issues,
                                event cancellations, or disputes between users. Our total liability is limited
                                to the platform fee charged for the transaction.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
                            <p>
                                For any questions about these terms, please contact us at:<br />
                                <span className="text-neon-purple">support@tickswapr.com</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default Terms;
