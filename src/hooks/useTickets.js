import { useState, useEffect, useCallback } from 'react';
import { getTickets, getTicketById, getFeaturedTickets } from '../services/ticketService';

// Hook to fetch multiple tickets with filters
export const useTickets = (filters = {}) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTickets(filters);
            setTickets(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return { tickets, loading, error, refetch: fetchTickets };
};

// Hook to fetch a single ticket by ID
export const useTicket = (ticketId) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            if (!ticketId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await getTicketById(ticketId);
                setTicket(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching ticket:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [ticketId]);

    return { ticket, loading, error };
};

// Hook to fetch featured tickets for homepage
export const useFeaturedTickets = (limit = 6) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getFeaturedTickets(limit);
                setTickets(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching featured tickets:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, [limit]);

    return { tickets, loading, error };
};

// Hook for ticket search/filter
export const useTicketSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        searchTerm: '',
        category: 'all',
        priceRange: [0, 100000],
        sortBy: 'newest'
    });

    const search = useCallback(async (params) => {
        setLoading(true);
        setSearchParams(params);
        try {
            const data = await getTickets({
                category: params.category !== 'all' ? params.category : undefined,
                status: 'verified'
            });

            // Client-side filtering for search term and price range
            let filtered = data;

            if (params.searchTerm) {
                const term = params.searchTerm.toLowerCase();
                filtered = filtered.filter(t =>
                    t.title?.toLowerCase().includes(term) ||
                    t.venue?.toLowerCase().includes(term)
                );
            }

            if (params.priceRange) {
                filtered = filtered.filter(t =>
                    t.sellingPrice >= params.priceRange[0] &&
                    t.sellingPrice <= params.priceRange[1]
                );
            }

            // Sorting
            switch (params.sortBy) {
                case 'price_low':
                    filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
                    break;
                case 'price_high':
                    filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
                    break;
                case 'oldest':
                    filtered.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                    break;
                default:
                    // newest - already sorted by createdAt desc from Firestore
                    break;
            }

            setResults(filtered);
        } catch (err) {
            console.error('Error searching tickets:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { results, loading, searchParams, search };
};

export default useTickets;
