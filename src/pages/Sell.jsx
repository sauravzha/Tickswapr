import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createTicket } from '../services/ticketService';
// import { uploadTicketImage } from '../services/storageService';
import TicketForm from '../components/tickets/TicketForm';
import Button from '../components/ui/Button';

const Sell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (formData) => {
        console.log('🚀 Starting ticket submission...');
        setLoading(true);

        try {
            // Create FormData object for multipart/form-data upload
            const data = new FormData();

            // Append simple fields
            Object.keys(formData).forEach(key => {
                if (key !== 'image' && formData[key] !== undefined && formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            // Append image if present
            if (formData.image) {
                console.log('📸 Attaching image to request...');
                data.append('image', formData.image);
            }

            // createTicket will handle the API call
            console.log('📝 Sending ticket data to backend...');
            await createTicket(data);
            console.log('✅ Ticket created successfully');

            setSubmitted(true);
        } catch (error) {
            console.error('❌ Error submitting ticket:', error);
            alert(`Failed to list ticket: ${error.message}. Please check your connection and try again.`);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center max-w-md"
                >
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                    <p className="text-gray-400 mb-6">
                        You need to be logged in to sell tickets on TickSwapr
                    </p>
                    <Button onClick={() => navigate('/login?signup=true')}>
                        Create Account
                    </Button>
                </motion.div>
            </main>
        );
    }

    if (submitted) {
        return (
            <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center max-w-md"
                >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Ticket Submitted!</h2>
                    <p className="text-gray-400 mb-6">
                        Your ticket has been submitted for verification. Our team will review it within 24 hours.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="secondary" onClick={() => setSubmitted(false)}>
                            List Another
                        </Button>
                        <Button onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Sell Your <span className="gradient-text">Ticket</span>
                    </h1>
                    <p className="text-gray-400">
                        List your unused ticket and find a buyer in minutes
                    </p>
                </motion.div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-start gap-3"
                >
                    <AlertCircle className="w-5 h-5 text-neon-purple flex-shrink-0 mt-0.5" />
                    <div>
                        <div className="font-medium text-neon-purple">Quick Listing</div>
                        <div className="text-sm text-gray-400 mt-1">
                            Fill in your ticket details and interested buyers will contact you directly via chat.
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8"
                >
                    <TicketForm onSubmit={handleSubmit} loading={loading} />
                </motion.div>
            </div>
        </main>
    );
};

export default Sell;
