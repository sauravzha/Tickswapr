const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/tickets.json');

// Ensure data file exists
const ensureDataFile = () => {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
    }
};

// Read all tickets
const getAllTickets = () => {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
};

// Save all tickets
const saveTickets = (tickets) => {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(tickets, null, 2), 'utf8');
};

// Get ticket by ID
const getTicketById = (id) => {
    const tickets = getAllTickets();
    return tickets.find(t => t.id === id || t._id === id);
};

// Create new ticket
const createTicket = (ticketData, sellerInfo) => {
    const tickets = getAllTickets();

    const newTicket = {
        id: uuidv4(),
        _id: uuidv4(), // For compatibility
        ...ticketData,
        seller: {
            id: sellerInfo._id || sellerInfo.id || 'user-' + Date.now(),
            name: sellerInfo.name || 'Anonymous Seller',
            email: sellerInfo.email || '',
            phone: sellerInfo.phone || '',
            verified: true,
            rating: 4.5,
            salesCount: 0
        },
        status: 'approved', // Auto-approve for simplified flow
        verified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tickets.push(newTicket);
    saveTickets(tickets);

    return newTicket;
};

// Update ticket
const updateTicket = (id, updates) => {
    const tickets = getAllTickets();
    const index = tickets.findIndex(t => t.id === id || t._id === id);

    if (index === -1) return null;

    tickets[index] = {
        ...tickets[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    saveTickets(tickets);
    return tickets[index];
};

// Delete ticket
const deleteTicket = (id) => {
    const tickets = getAllTickets();
    const filtered = tickets.filter(t => t.id !== id && t._id !== id);

    if (filtered.length === tickets.length) return false;

    saveTickets(filtered);
    return true;
};

// Get tickets by seller
const getTicketsBySeller = (sellerId) => {
    const tickets = getAllTickets();
    return tickets.filter(t => t.seller?.id === sellerId || t.seller?.email === sellerId);
};

// Get approved/active tickets
const getActiveTickets = (category = null, limit = null) => {
    let tickets = getAllTickets().filter(t => t.status === 'approved' || t.verified);

    if (category && category !== 'all') {
        tickets = tickets.filter(t => t.category === category);
    }

    // Sort by newest first
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (limit) {
        tickets = tickets.slice(0, parseInt(limit));
    }

    return tickets;
};

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketsBySeller,
    getActiveTickets
};
