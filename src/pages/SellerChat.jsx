import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Send, Phone, Mail, Copy, Check, MessageCircle,
    User, Shield, CreditCard, Wallet, AlertCircle, Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

// Mock ticket and chat data
const mockTicketData = {
    id: '1',
    title: 'Coldplay Music of the Spheres Tour',
    price: 9500,
    eventDate: '2026-03-15',
    venue: 'DY Patil Stadium, Mumbai',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
    seller: {
        id: 'seller123',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 98765 43210',
        upiId: 'rahul@paytm',
        verified: true,
        rating: 4.8
    }
};

const SellerChat = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'seller',
            text: 'Hi! Thanks for your interest in my Coldplay ticket. The seat is in Block A, Row 15. Great view of the stage!',
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 2,
            sender: 'buyer',
            text: 'That sounds great! Is the ticket still available?',
            timestamp: new Date(Date.now() - 3000000).toISOString()
        },
        {
            id: 3,
            sender: 'seller',
            text: 'Yes, it\'s still available! I can transfer it to you immediately after payment confirmation.',
            timestamp: new Date(Date.now() - 2400000).toISOString()
        }
    ]);
    const [copied, setCopied] = useState(null);
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);
    const messagesEndRef = useRef(null);

    const ticket = mockTicketData;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'buyer',
            text: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Simulate seller reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'seller',
                text: 'Got your message! Let me know if you have any questions.',
                timestamp: new Date().toISOString()
            }]);
        }, 2000);
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const quickMessages = [
        'Is the ticket still available?',
        'Can you share your UPI ID?',
        'What\'s your phone number?',
        'I\'m interested in buying!'
    ];

    if (!user) {
        return (
            <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <MessageCircle className="w-16 h-16 text-neon-purple mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                    <p className="text-gray-400 mb-4">Please login to chat with sellers</p>
                    <Button onClick={() => navigate('/login')}>Login</Button>
                </Card>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-4 bg-dark-950">
            <div className="max-w-4xl mx-auto px-4 h-[calc(100vh-100px)] flex flex-col">
                {/* Header */}
                <div className="glass-card p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <img
                            src={ticket.imageUrl}
                            alt={ticket.title}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                            <h2 className="font-semibold line-clamp-1">{ticket.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>₹{ticket.price.toLocaleString()}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {ticket.seller.name}
                                </span>
                                {ticket.seller.verified && (
                                    <Badge variant="success" className="text-xs py-0">Verified</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        Payment Info
                    </Button>
                </div>

                {/* Payment Info Panel */}
                <AnimatePresence>
                    {showPaymentInfo && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mb-4"
                        >
                            <Card className="p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="w-5 h-5 text-neon-purple" />
                                    <h3 className="font-semibold">Seller Payment Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* UPI ID */}
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-xs text-gray-400 mb-1">UPI ID</div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-emerald-400">{ticket.seller.upiId}</span>
                                            <button
                                                onClick={() => handleCopy(ticket.seller.upiId, 'upi')}
                                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                {copied === 'upi' ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-xs text-gray-400 mb-1">Phone</div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{ticket.seller.phone}</span>
                                            <button
                                                onClick={() => handleCopy(ticket.seller.phone.replace(/\s/g, ''), 'phone')}
                                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                {copied === 'phone' ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="text-xs text-gray-400 mb-1">Email</div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm">{ticket.seller.email}</span>
                                            <button
                                                onClick={() => handleCopy(ticket.seller.email, 'email')}
                                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                {copied === 'email' ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-yellow-400/80">
                                        <strong>Tip:</strong> Always verify the seller before making payment.
                                        Ask for ticket proof and confirm all details through chat.
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Messages */}
                <div className="flex-1 glass-card p-4 overflow-y-auto mb-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.sender === 'buyer'
                                        ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-br-md'
                                        : 'bg-white/10 text-white rounded-bl-md'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className="text-[10px] opacity-60 mt-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Quick Messages */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 hide-scrollbar">
                    {quickMessages.map((qm, i) => (
                        <button
                            key={i}
                            onClick={() => setMessage(qm)}
                            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
                        >
                            {qm}
                        </button>
                    ))}
                </div>

                {/* Message Input */}
                <div className="glass-card p-3 flex items-center gap-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-purple/50 transition-colors"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${message.trim()
                                ? 'bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-lg hover:shadow-neon-purple/30'
                                : 'bg-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <Send className="w-5 h-5 text-white" />
                    </motion.button>
                </div>

                {/* Info Footer */}
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Info className="w-3 h-3" />
                    <span>Messages are stored locally for demo purposes</span>
                </div>
            </div>
        </main>
    );
};

export default SellerChat;
