import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Ticket, Clock, CheckCircle, XCircle, AlertCircle, Plus, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getMyTickets } from '../services/ticketService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const MyTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            if (user) {
                try {
                    const data = await getMyTickets();
                    setTickets(data);
                } catch (error) {
                    console.error("Failed to load tickets", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTickets();
    }, [user]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
            case 'active':
                return <Badge variant="verified">Approved & Live</Badge>;
            case 'pending_verification':
            case 'pending':
                return <Badge variant="pending">Pending Verification</Badge>;
            case 'rejected':
                return <Badge variant="danger">Rejected</Badge>;
            case 'sold':
                return <Badge variant="concert">Sold Out</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-16 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-purple"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-16 container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
                    <p className="text-gray-400">Manage your listings and track verification status</p>
                </div>
                <Link to="/sell" className="mt-4 md:mt-0">
                    <Button icon={<Plus className="w-4 h-4" />}>Sell New Ticket</Button>
                </Link>
            </div>

            {tickets.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-white/10">
                    <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No tickets listed yet</h3>
                    <p className="text-gray-400 mb-6">Start selling your extra tickets today!</p>
                    <Link to="/sell">
                        <Button>List a Ticket</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {tickets.map((ticket) => (
                        <motion.div
                            key={ticket._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-0 overflow-hidden flex flex-col md:flex-row">
                                <div className="md:w-48 h-48 md:h-auto relative">
                                    <img
                                        src={ticket.imageUrl}
                                        alt={ticket.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <Badge variant={ticket.category}>{ticket.category}</Badge>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold">{ticket.title}</h3>
                                                {getStatusBadge(ticket.status)}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(ticket.eventDate).toLocaleDateString()}
                                                </div>
                                                <div>{ticket.city} • {ticket.venue}</div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-emerald-400">
                                            ₹{ticket.sellingPrice.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Rejection Reason */}
                                    {ticket.status === 'rejected' && ticket.rejectionReason && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                            <div className="flex items-start gap-2 text-red-400 text-sm">
                                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="font-bold">Rejection Reason: </span>
                                                    {ticket.rejectionReason}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                        <div className="text-sm text-gray-500">
                                            Listed on {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-3">
                                            {ticket.status === 'rejected' && (
                                                <Button variant="secondary" size="sm" icon={<Edit className="w-4 h-4" />}>
                                                    Edit & Resubmit
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default MyTickets;
