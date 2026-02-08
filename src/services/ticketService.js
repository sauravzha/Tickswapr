import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tickets';

// Helper to get token (Async)
const getAuthHeader = async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            const token = await user.getIdToken();
            return { 'Authorization': `Bearer ${token}` };
        } catch (error) {
            console.error("Error getting ID token:", error);
            return {};
        }
    }
    return {};
};

// Create a new ticket listing
export const createTicket = async (ticketData) => {
    // ticketData should be FormData if it contains an image
    // If it's just JSON, we need to send JSON headers

    // Start by getting auth headers
    const authHeaders = await getAuthHeader();

    const isFormData = ticketData instanceof FormData;
    const headers = isFormData ? authHeaders : {
        'Content-Type': 'application/json',
        ...authHeaders
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: headers,
            body: ticketData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create ticket');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};

// Get user's own tickets
export const getMyTickets = async () => {
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_URL}/my-tickets`, {
            headers: headers
        });

        if (!response.ok) throw new Error('Failed to fetch your tickets');
        return await response.json();
    } catch (error) {
        console.error('Error fetching my tickets:', error);
        throw error;
    }
};

// Get all active APPROVED tickets (Public)
export const getTickets = async (filters = {}) => {
    try {
        // Build query string
        const params = new URLSearchParams();
        if (filters.category && filters.category !== 'all') {
            params.append('category', filters.category);
        }
        if (filters.limit) {
            params.append('limit', filters.limit);
        }

        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch tickets');

        return await response.json();
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
};

// ADMIN: Get ALL tickets
export const getTicketsForAdmin = async () => {
    try {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_URL}/admin/all`, {
            headers: headers
        });

        if (!response.ok) throw new Error('Failed to fetch admin tickets');
        return await response.json();
    } catch (error) {
        console.error('Error fetching admin tickets:', error);
        throw error;
    }
};

// ADMIN: Real-time listener (Simulated with polling for MVP MERN)
export const listenToTicketsForAdmin = (callback) => {
    getTicketsForAdmin().then(callback).catch(console.error);
    const interval = setInterval(() => {
        getTicketsForAdmin().then(callback).catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
};

// Get a single ticket by ID
export const getTicketById = async (ticketId) => {
    try {
        const response = await fetch(`${API_URL}/${ticketId}`);
        if (!response.ok) throw new Error('Ticket not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching ticket:', error);
        throw error;
    }
};

// ADMIN: Verify or Reject a ticket
export const updateTicketVerification = async (ticketId, isVerified, rejectionReason = null) => {
    try {
        const authHeaders = await getAuthHeader();
        const headers = {
            'Content-Type': 'application/json',
            ...authHeaders
        };

        const response = await fetch(`${API_URL}/${ticketId}/verify`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ verified: isVerified, reason: rejectionReason })
        });

        if (!response.ok) throw new Error('Failed to update ticket verification');
        return await response.json();
    } catch (error) {
        console.error('Error verifying ticket:', error);
        throw error;
    }
};

// Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
    // Placeholder
    return true;
};

// Search tickets
export const searchTickets = async (searchTerm) => {
    try {
        const tickets = await getTickets();
        const lowerTerm = searchTerm.toLowerCase();

        return tickets.filter(ticket =>
            ticket.title.toLowerCase().includes(lowerTerm) ||
            ticket.venue.toLowerCase().includes(lowerTerm) ||
            ticket.description.toLowerCase().includes(lowerTerm)
        );
    } catch (error) {
        console.error('Error searching tickets:', error);
        throw error;
    }
};
