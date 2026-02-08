import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, User, Shield, AlertCircle, Check, Loader2, CheckCircle, MessageCircle, Phone, Mail, Copy } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { getTicketById } from '../services/ticketService';


// Mock ticket data
const mockTicket = {
    id: '1',
    title: 'Coldplay Music of the Spheres Tour',
    category: 'concert',
    eventDate: '2026-03-15',
    eventTime: '19:00',
    venue: 'DY Patil Stadium, Mumbai',
    seatNumber: 'Block A, Row 15, Seat 23',
    originalPrice: 12000,
    sellingPrice: 9500,
    description: 'Amazing front row seats! Unfortunately cannot attend due to travel plans. Ticket is 100% genuine and will be transferred immediately after payment.',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    status: 'verified',
    urgency: 'normal',
    seller: {
        name: 'Rahul Sharma',
        rating: 4.8,
        salesCount: 24,
        verified: true
    }
};

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const data = await getTicketById(id);
                // Ensure seller object exists even if missing in old data
                if (!data.seller) {
                    data.seller = {
                        name: data.sellerName || 'Anonymous Seller',
                        rating: 4.8, // Mock default
                        salesCount: 12, // Mock default
                        verified: false,
                        id: data.sellerId
                    };
                }
                setTicket(data);
            } catch (err) {
                console.error('Error fetching ticket:', err);
                setError('Ticket not found or has been removed');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTicket();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Ticket Not Found</h2>
                    <p className="text-gray-400 mb-6">{error || "The ticket you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate('/browse')}>Browse Tickets</Button>
                </div>
            </div>
        );
    }

    const discount = ticket.originalPrice && ticket.sellingPrice
        ? Math.round(((ticket.originalPrice - ticket.sellingPrice) / ticket.originalPrice) * 100)
        : 0;

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleContactSeller = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/chat/${ticket.id}`);
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Browse
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left - Image & Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3"
                    >
                        {/* Image */}
                        <div className="relative rounded-2xl overflow-hidden mb-6">
                            <img
                                src={ticket.imageUrl}
                                alt={ticket.title}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge variant={ticket.category}>{ticket.category}</Badge>
                                {ticket.urgency === 'urgent' && <Badge variant="urgent">Urgent</Badge>}
                            </div>
                            {ticket.status === 'verified' && (
                                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm text-emerald-400 font-medium">Verified</span>
                                </div>
                            )}
                        </div>

                        {/* Title & Details */}
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">{ticket.title}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-neon-purple" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Date</div>
                                    <div>{new Date(ticket.eventDate).toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-neon-cyan" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Time</div>
                                    <div>{ticket.eventTime}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-xl bg-neon-pink/20 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-neon-pink" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Venue</div>
                                    <div>{ticket.venue}</div>
                                </div>
                            </div>

                            {ticket.seatNumber && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                        <span className="text-yellow-400">💺</span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Seat</div>
                                        <div>{ticket.seatNumber}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="glass-card p-6 mb-6">
                            <h3 className="font-semibold mb-3">Description</h3>
                            <p className="text-gray-400">{ticket.description}</p>
                        </div>

                        {/* How It Works */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MessageCircle className="w-5 h-5 text-neon-purple" />
                                <h3 className="font-semibold">How It Works</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    Contact the seller via chat or their contact info
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    Discuss ticket details and verify authenticity
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    Arrange payment directly with the seller
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    Receive your ticket via transfer or handover
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Right - Purchase Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass-card p-6 sticky top-24">
                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl font-bold gradient-text">
                                        ₹{ticket.sellingPrice.toLocaleString()}
                                    </span>
                                    {discount > 0 && (
                                        <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold">
                                            {discount}% OFF
                                        </span>
                                    )}
                                </div>
                                <div className="text-gray-500 line-through">
                                    Original: ₹{ticket.originalPrice.toLocaleString()}
                                </div>
                            </div>

                            {/* Seller Info with Contact */}
                            <div className="glass p-4 rounded-xl mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-lg font-bold">
                                        {ticket.seller.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{ticket.seller.name}</span>
                                            {ticket.seller.verified && (
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            ⭐ {ticket.seller.rating} • {ticket.seller.salesCount} sales
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2 pt-3 border-t border-white/10">
                                    {ticket.seller.email && (
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-neon-cyan" />
                                                <span className="text-sm">{ticket.seller.email}</span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(ticket.seller.email, 'email')}
                                                className="p-1 rounded hover:bg-white/10"
                                            >
                                                {copied === 'email' ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                    {ticket.seller.phone && (
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-neon-pink" />
                                                <span className="text-sm">{ticket.seller.phone}</span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(ticket.seller.phone, 'phone')}
                                                className="p-1 rounded hover:bg-white/10"
                                            >
                                                {copied === 'phone' ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleContactSeller}
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Contact Seller
                            </Button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Connect directly with the seller via chat to arrange the purchase
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

        </main>
    );
};

export default TicketDetail;

