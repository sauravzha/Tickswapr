import { motion } from 'framer-motion';
import { Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
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
                        <Eye className="w-8 h-8 text-neon-cyan" />
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                        <p className="text-sm text-gray-500">Last updated: February 2026</p>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                            <p>We collect the following types of information:</p>
                            <ul className="list-disc ml-6 space-y-2 mt-2">
                                <li><strong>Account Information:</strong> Name, email, phone number</li>
                                <li><strong>Transaction Data:</strong> Purchase history, payment information (processed via Razorpay)</li>
                                <li><strong>Usage Data:</strong> Pages visited, features used, device information</li>
                                <li><strong>Communication Data:</strong> Chat messages between buyers and sellers</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                            <ul className="list-disc ml-6 space-y-2">
                                <li>To facilitate ticket transactions between users</li>
                                <li>To verify user identity and prevent fraud</li>
                                <li>To communicate important updates and notifications</li>
                                <li>To improve our platform and user experience</li>
                                <li>To comply with legal requirements</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage & Security</h2>
                            <p>
                                Your data is stored securely using Firebase services with encryption at rest and in transit.
                                We implement industry-standard security measures including:
                            </p>
                            <ul className="list-disc ml-6 space-y-2 mt-2">
                                <li>SSL/TLS encryption for all data transmission</li>
                                <li>Secure authentication via Firebase Auth</li>
                                <li>Regular security audits and updates</li>
                                <li>Payment data processed by PCI-DSS compliant Razorpay</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
                            <p>We may share your information with:</p>
                            <ul className="list-disc ml-6 space-y-2 mt-2">
                                <li><strong>Other Users:</strong> Limited info shared between buyers/sellers for transactions</li>
                                <li><strong>Payment Processors:</strong> Razorpay for payment processing</li>
                                <li><strong>Law Enforcement:</strong> When required by law or court order</li>
                            </ul>
                            <p className="mt-2">We do NOT sell your personal data to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc ml-6 space-y-2 mt-2">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of your account</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Download your data in a portable format</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
                            <p>
                                We use essential cookies for authentication and session management.
                                We may also use analytics cookies to understand platform usage.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">7. Data Retention</h2>
                            <p>
                                We retain your data for as long as your account is active. Transaction records
                                are kept for 7 years for tax and legal compliance. You may request account
                                deletion at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">8. Children's Privacy</h2>
                            <p>
                                TickSwapr is not intended for users under 18 years of age. We do not knowingly
                                collect data from minors.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
                            <p>
                                We may update this policy periodically. Users will be notified of significant
                                changes via email or platform notification.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
                            <p>
                                For privacy-related inquiries:<br />
                                <span className="text-neon-cyan">privacy@tickswapr.com</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default Privacy;
