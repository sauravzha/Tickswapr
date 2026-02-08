import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Ticket, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import TicketCard from '../tickets/TicketCard';
import { getTickets } from '../../services/ticketService';

const FeaturedListings = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                // Fetch up to 6 recent tickets
                const data = await getTickets({ limit: 6 });
                setTickets(data);
            } catch (error) {
                console.error('Failed to fetch featured tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    return (
        <section className="py-20 relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800/50 to-dark-900 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-neon-purple" />
                            <span className="text-sm font-medium text-neon-purple uppercase tracking-wider">
                                Hot Right Now
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Featured <span className="gradient-text">Listings</span>
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Verified tickets selling fast - don't miss out!
                        </p>
                    </div>
                    <Link
                        to="/browse"
                        className="group flex items-center gap-2 text-neon-cyan hover:text-neon-purple transition-colors"
                    >
                        <span>View all tickets</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div >

                {/* Tickets Grid */}
                {
                    loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
                        </div>
                    ) : tickets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tickets.map((ticket, index) => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to={`/ticket/${ticket.id}`}>
                                        <TicketCard ticket={ticket} />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 glass rounded-xl">
                            <Ticket className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-400 mb-2">No tickets yet</h3>
                            <p className="text-gray-500 mb-6">Be the first to list a ticket!</p>
                            <Link to="/sell" className="text-neon-cyan hover:underline">
                                List a ticket now
                            </Link>
                        </div>
                    )
                }

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full">
                        <Clock className="w-5 h-5 text-neon-cyan animate-pulse" />
                        <span className="text-sm text-gray-300">
                            <strong className="text-neon-cyan">127 tickets</strong> sold in the last 24 hours
                        </span>
                    </div>
                </motion.div>
            </div >
        </section >
    );
};

export default FeaturedListings;
