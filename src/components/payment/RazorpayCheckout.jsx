import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, CreditCard, AlertCircle, Check } from 'lucide-react';
import Button from '../ui/Button';
import { calculatePaymentBreakdown, initializeRazorpayCheckout } from '../../services/paymentService';

const RazorpayCheckout = ({
    ticket,
    buyer,
    onSuccess,
    onFailure,
    onClose
}) => {
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState('review'); // review, processing, success, failure

    const breakdown = calculatePaymentBreakdown(ticket.sellingPrice);

    const handlePayment = async () => {
        setProcessing(true);
        setStep('processing');

        try {
            await initializeRazorpayCheckout(
                {
                    ticketId: ticket.id,
                    ticketTitle: ticket.title,
                    amount: breakdown.totalAmount,
                    buyerEmail: buyer.email,
                    buyerName: buyer.displayName,
                    buyerPhone: buyer.phone
                },
                (response) => {
                    setStep('success');
                    onSuccess?.(response);
                },
                (error) => {
                    setStep('failure');
                    onFailure?.(error);
                }
            );
        } catch (error) {
            setStep('failure');
            onFailure?.(error);
        } finally {
            setProcessing(false);
        }
    };

    if (step === 'success') {
        return (
            <div className="text-center py-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
                >
                    <Check className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-gray-400 mb-6">
                    Your ticket has been purchased. You'll receive it in your dashboard.
                </p>
                <Button onClick={onClose}>View My Tickets</Button>
            </div>
        );
    }

    if (step === 'failure') {
        return (
            <div className="text-center py-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6"
                >
                    <AlertCircle className="w-10 h-10 text-red-400" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Payment Failed</h3>
                <p className="text-gray-400 mb-6">
                    Something went wrong with your payment. Please try again.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => setStep('review')}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Ticket Summary */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                <img
                    src={ticket.imageUrl || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=100'}
                    alt={ticket.title}
                    className="w-20 h-16 rounded-lg object-cover"
                />
                <div>
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-gray-400">
                        {new Date(ticket.eventDate).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                    <span>Ticket Price</span>
                    <span>₹{breakdown.ticketPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Platform Fee ({breakdown.commissionRate}%)</span>
                    <span>₹{breakdown.platformFee.toLocaleString()}</span>
                </div>
                <hr className="border-white/10" />
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="gradient-text">₹{breakdown.totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* Security Info */}
            <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-neon-purple flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                        <strong className="text-neon-purple">Buyer Protection:</strong> Your payment is held securely until
                        the ticket transfer is confirmed. Full refund if there are any issues.
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Payment powered by</span>
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400">Secure Payment</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="px-3 py-2 rounded-lg bg-white/5 text-sm">💳 Cards</div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 text-sm">🏦 Net Banking</div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 text-sm">📱 UPI</div>
                    <div className="px-3 py-2 rounded-lg bg-white/5 text-sm">💰 Wallets</div>
                </div>
            </div>

            {/* Pay Button */}
            <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                loading={processing}
                icon={<CreditCard className="w-5 h-5" />}
            >
                Pay ₹{breakdown.totalAmount.toLocaleString()}
            </Button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center">
                By proceeding, you agree to our Terms of Service, Refund Policy, and Privacy Policy.
            </p>
        </div>
    );
};

export default RazorpayCheckout;
