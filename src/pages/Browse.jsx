import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import TicketCard from '../components/tickets/TicketCard';
import TicketFilters from '../components/tickets/TicketFilters';

import { getTickets } from '../services/ticketService';
import { Loader2 } from 'lucide-react';

const Browse = () => {
    const [searchParams] = useSearchParams();
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryParam = searchParams.get('category');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getTickets();
                setTickets(data);
                // Initial filter will happen in the next useEffect
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    useEffect(() => {
        if (categoryParam && categoryParam !== 'all') {
            setFilteredTickets(tickets.filter(t => t.category === categoryParam));
        } else {
            setFilteredTickets(tickets);
        }
    }, [categoryParam, tickets]);

    const handleFilterChange = (filters) => {
        let result = [...tickets];

        // Search
        if (filters.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            result = result.filter(t =>
                t.title.toLowerCase().includes(term) ||
                t.venue.toLowerCase().includes(term)
            );
        }

        // Category
        if (filters.category && filters.category !== 'all') {
            result = result.filter(t => t.category === filters.category);
        }

        // Price range
        if (filters.priceRange) {
            result = result.filter(t =>
                t.sellingPrice >= filters.priceRange[0] &&
                t.sellingPrice <= filters.priceRange[1]
            );
        }

        // Sort
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price_low':
                    result.sort((a, b) => a.sellingPrice - b.sellingPrice);
                    break;
                case 'price_high':
                    result.sort((a, b) => b.sellingPrice - a.sellingPrice);
                    break;
                case 'oldest':
                    result.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                    break;
                case 'discount':
                    result.sort((a, b) => {
                        const discA = (a.originalPrice - a.sellingPrice) / a.originalPrice;
                        const discB = (b.originalPrice - b.sellingPrice) / b.originalPrice;
                        return discB - discA;
                    });
                    break;
                default:
                    result.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
            }
        }

        setFilteredTickets(result);
    };

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Browse <span className="gradient-text">Tickets</span>
                    </h1>
                    <p className="text-gray-400">
                        Find verified tickets for concerts, movies, trains, buses & sports events
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <TicketFilters onFilterChange={handleFilterChange} />
                </motion.div>

                {/* Results */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-400">
                        Showing <span className="text-white font-medium">{filteredTickets.length}</span> tickets
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Tickets Grid */}
                        {filteredTickets.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTickets.map((ticket, index) => (
                                    <motion.div
                                        key={ticket.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <TicketCard ticket={ticket} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="text-6xl mb-4">🎫</div>
                                <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
                                <p className="text-gray-400">Try adjusting your filters or search term</p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};

export default Browse;
