import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, Ticket, AlertTriangle, CreditCard, Settings,
    Check, X, Eye, Search, Filter, TrendingUp, Clock, ShieldCheck,
    DollarSign, ShoppingCart, UserCheck, Mail, Phone, Calendar,
    ChevronDown, ChevronRight, Trash2, Edit, Ban, CheckCircle,
    RefreshCw, Download, BarChart3, PieChart, Activity, ArrowUpRight,
    ExternalLink, Image, FileText, MapPin, Shield, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_EMAIL } from '../config/firebase';
import { guardAI, getRiskLevel } from '../services/guardAI';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

import { getTicketsForAdmin, updateTicketVerification, listenToTicketsForAdmin } from '../services/ticketService';

const mockUsers = [
    { id: '1', name: 'Rahul Sharma', email: 'rahul@email.com', role: 'seller', status: 'active', joinedAt: '2025-12-15', tickets: 5, sales: 12500 },
    { id: '2', name: 'Priya Mehta', email: 'priya@email.com', role: 'buyer', status: 'active', joinedAt: '2026-01-10', tickets: 0, sales: 0 },
    { id: '3', name: 'Amit Kumar', email: 'amit@email.com', role: 'seller', status: 'active', joinedAt: '2026-01-25', tickets: 3, sales: 8400 },
    { id: '4', name: 'Sneha Patel', email: 'sneha@email.com', role: 'buyer', status: 'suspended', joinedAt: '2025-11-20', tickets: 0, sales: 0 },
    { id: '5', name: 'Vikram Singh', email: 'vikram@email.com', role: 'seller', status: 'active', joinedAt: '2026-02-01', tickets: 8, sales: 25000 },
];

const mockOrders = [
    { id: 'ORD001', ticket: 'Coldplay Concert', buyer: 'Sneha Patel', seller: 'Rahul Sharma', amount: 9975, status: 'completed', date: '2026-02-08T14:30:00' },
    { id: 'ORD002', ticket: 'IPL Final Match', buyer: 'Vikram Singh', seller: 'Amit Kumar', amount: 5500, status: 'pending', date: '2026-02-08T12:15:00' },
    { id: 'ORD003', ticket: 'Avengers Movie', buyer: 'Priya Mehta', seller: 'Amit Kumar', amount: 840, status: 'completed', date: '2026-02-07T18:45:00' },
];

const mockDisputes = [
    { id: 'DIS001', orderId: 'ORD002', reason: 'Ticket not received', status: 'open', reporter: 'Vikram Singh', reportedAt: '2026-02-08T15:00:00' },
];

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [tickets, setTickets] = useState([]);
    const [pendingTickets, setPendingTickets] = useState([]);
    const [users, setUsers] = useState(mockUsers);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Filter tickets for different views
    useEffect(() => {
        if (tickets.length > 0) {
            // Strict check for pending_verification status
            setPendingTickets(tickets.filter(t => t.status === 'pending_verification' || (t.status === 'pending' && !t.verified)));
        }
    }, [tickets]);

    const processTickets = (allTickets) => {
        return allTickets.map(t => ({
            ...t,
            seller: t.seller || {
                name: t.sellerName || 'Anonymous',
                email: t.sellerEmail || 'No email',
                phone: 'Not provided'
            },
            price: t.sellingPrice || 0,
            submitted: t.createdAt || new Date().toISOString()
        }));
    };

    const fetchAdminData = async () => {
        try {
            const allTickets = await getTicketsForAdmin();
            setTickets(processTickets(allTickets));
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    useEffect(() => {
        let unsubscribe;
        if (user?.email === ADMIN_EMAIL) {
            // Initial fetch
            fetchAdminData();

            // Setup real-time listener
            unsubscribe = listenToTicketsForAdmin((updatedTickets) => {
                const processed = processTickets(updatedTickets);
                setTickets(prev => {
                    // Alert if we have new tickets (and it's not the initial load)
                    if (prev.length > 0 && processed.length > prev.length) {
                        // Native notification if supported, or just a simple alert for now
                        // In a real app, use a Toast component.
                        // For now, we'll assume the UI updates are enough, but let's add a console log
                        // and maybe a temporary sound effect or title change?
                        console.log("🔔 New ticket received!");
                        // We can also set a specific "new" flag on the tickets if we wanted animation
                    }
                    return processed;
                });
            });
        }
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    // Check if user is admin (only jhasaurav562@gmail.com)
    const isAdmin = user?.email === ADMIN_EMAIL;

    if (!user) {
        return (
            <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Please Login</h2>
                    <p className="text-gray-400 mb-4">You need to login to access the admin panel.</p>
                    <Button onClick={() => navigate('/login')}>Login</Button>
                </Card>
            </main>
        );
    }

    if (!isAdmin) {
        return (
            <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <Card className="p-8 text-center max-w-md">
                    <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-gray-400 mb-4">
                        Only <span className="text-neon-purple font-medium">{ADMIN_EMAIL}</span> has admin access.
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                        Current user: {user?.email}
                    </p>
                    <Button variant="secondary" onClick={() => navigate('/')}>Go Home</Button>
                </Card>
            </main>
        );
    }

    const sidebarItems = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'verification', label: 'Verify Tickets', icon: ShieldCheck, badge: pendingTickets.length },
        { id: 'riskAlerts', label: 'Risk Alerts', icon: Shield, badge: 3 },
        { id: 'users', label: 'Users', icon: Users, badge: users.length },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'disputes', label: 'Disputes', icon: AlertTriangle, badge: mockDisputes.length },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const stats = [
        { label: 'Total Users', value: '25,432', change: '+12%', icon: Users, color: 'from-purple-500 to-pink-500' },
        { label: 'Active Listings', value: '1,847', change: '+8%', icon: Ticket, color: 'from-cyan-500 to-blue-500' },
        { label: 'Pending Verification', value: pendingTickets.length, change: 'Review now', icon: Clock, color: 'from-yellow-500 to-orange-500' },
        { label: 'Revenue (Today)', value: '₹45,230', change: '+23%', icon: DollarSign, color: 'from-emerald-500 to-green-500' }
    ];

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAdminData();
        setRefreshing(false);
    };

    const handleApprove = async (ticketId) => {
        try {
            await updateTicketVerification(ticketId, true);
            // Optimistic update
            setTickets(prev => prev.map(t =>
                t.id === ticketId ? { ...t, verified: true, status: 'active' } : t
            ));
            setShowTicketModal(false);
        } catch (error) {
            console.error('Error approving ticket:', error);
            alert('Failed to approve ticket');
        }
    };

    const handleReject = async (ticketId) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            try {
                await updateTicketVerification(ticketId, false, reason);
                // Optimistic update
                setTickets(prev => prev.map(t =>
                    t.id === ticketId ? { ...t, verified: false, status: 'rejected' } : t
                ));
                setShowTicketModal(false);
            } catch (error) {
                console.error('Error rejecting ticket:', error);
                alert('Failed to reject ticket');
            }
        }
    };

    const viewTicketDetails = (ticket) => {
        setSelectedTicket(ticket);
        setShowTicketModal(true);
    };

    const handleUserAction = (userId, action) => {
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                return { ...u, status: action === 'suspend' ? 'suspended' : 'active' };
            }
            return u;
        }));
    };

    return (
        <main className="min-h-screen pt-16 bg-dark-950">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-[calc(100vh-64px)] glass border-r border-white/10 p-4 hidden lg:block fixed top-16 left-0 overflow-y-auto">
                    {/* Admin Info */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center font-bold">
                                {user?.displayName?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <div className="font-medium text-sm">{user?.displayName || 'Admin'}</div>
                                <div className="text-xs text-neon-purple">Super Admin</div>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeSection === item.id
                                    ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg shadow-neon-purple/25'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                {item.badge !== undefined && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeSection === item.id
                                        ? 'bg-white/20'
                                        : 'bg-neon-purple/20 text-neon-purple'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 lg:ml-64 p-6 pt-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
                    >
                        <div>
                            <h1 className="text-3xl font-bold mb-1">
                                {sidebarItems.find(s => s.id === activeSection)?.label || 'Dashboard'}
                            </h1>
                            <p className="text-gray-400">Welcome back, {user?.displayName} 👋</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
                                onClick={handleRefresh}
                            >
                                Refresh
                            </Button>
                            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                                Export
                            </Button>
                        </div>
                    </motion.div>

                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <>
                            {/* Stats Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8"
                            >
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card hover className="p-5 relative overflow-hidden group">
                                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                                    <stat.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${stat.change.startsWith('+')
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : stat.change.startsWith('-')
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {stat.change}
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                            <div className="text-sm text-gray-400">{stat.label}</div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pending Verifications */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Card className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <ShieldCheck className="w-5 h-5 text-yellow-400" />
                                                Pending Verification
                                            </h3>
                                            <button
                                                onClick={() => setActiveSection('verification')}
                                                className="text-sm text-neon-purple hover:underline"
                                            >
                                                View All →
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {pendingTickets.slice(0, 3).map((ticket) => (
                                                <div
                                                    key={ticket.id}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                                                    onClick={() => viewTicketDetails(ticket)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <img src={ticket.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                                        <div>
                                                            <div className="font-medium text-sm line-clamp-1">{ticket.title}</div>
                                                            <div className="text-xs text-gray-400">₹{ticket.price.toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                    <Badge variant={ticket.category}>{ticket.category}</Badge>
                                                </div>
                                            ))}
                                            {pendingTickets.length === 0 && (
                                                <div className="text-center py-6 text-gray-400">
                                                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                                                    All caught up! 🎉
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>

                                {/* Recent Orders */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Card className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                                                Recent Orders
                                            </h3>
                                            <button
                                                onClick={() => setActiveSection('orders')}
                                                className="text-sm text-neon-purple hover:underline"
                                            >
                                                View All →
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {mockOrders.slice(0, 3).map((order) => (
                                                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                                    <div>
                                                        <div className="font-medium text-sm">{order.ticket}</div>
                                                        <div className="text-xs text-gray-400">{order.buyer} → {order.seller}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-emerald-400">₹{order.amount.toLocaleString()}</div>
                                                        <Badge variant={order.status === 'completed' ? 'verified' : 'pending'} className="text-xs">
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </>
                    )}

                    {/* Verification Section */}
                    {activeSection === 'verification' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search tickets..."
                                        icon={<Search className="w-4 h-4" />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
                                    Filter
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {pendingTickets.filter(t =>
                                    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    t.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((ticket) => (
                                    <Card key={ticket.id} className="p-6">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Image */}
                                            <div className="lg:w-48 flex-shrink-0">
                                                <img
                                                    src={ticket.imageUrl}
                                                    alt={ticket.title}
                                                    className="w-full h-32 lg:h-full object-cover rounded-xl"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <Badge variant={ticket.category}>{ticket.category}</Badge>
                                                    <Badge variant="pending">Pending Review</Badge>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(ticket.submitted).toLocaleString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold mb-2">{ticket.title}</h3>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                                    <div>
                                                        <div className="text-gray-500">Seller</div>
                                                        <div className="font-medium">{ticket.seller.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-500">Price</div>
                                                        <div className="font-medium text-emerald-400">₹{ticket.price.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-500">Event Date</div>
                                                        <div className="font-medium">{new Date(ticket.eventDate).toLocaleDateString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-500">Venue</div>
                                                        <div className="font-medium line-clamp-1">{ticket.venue}</div>
                                                    </div>
                                                </div>

                                                <p className="text-gray-400 text-sm mb-4">{ticket.description}</p>

                                                <div className="flex flex-wrap gap-3">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={<Eye className="w-4 h-4" />}
                                                        onClick={() => viewTicketDetails(ticket)}
                                                    >
                                                        Full Details
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        icon={<Check className="w-4 h-4" />}
                                                        onClick={() => handleApprove(ticket.id)}
                                                        className="bg-emerald-500 hover:bg-emerald-600"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        icon={<X className="w-4 h-4" />}
                                                        onClick={() => handleReject(ticket.id)}
                                                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                {pendingTickets.length === 0 && (
                                    <Card className="p-12 text-center">
                                        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">All Clear!</h3>
                                        <p className="text-gray-400">No pending tickets to verify. Great job! 🎉</p>
                                    </Card>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Users Section */}
                    {activeSection === 'riskAlerts' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Risk Alerts Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Shield className="w-6 h-6 text-neon-purple" />
                                        Guard AI - Risk Alerts
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">Monitor fraud attempts and protect platform commission</p>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
                                    onClick={handleRefresh}
                                >
                                    Refresh
                                </Button>
                            </div>

                            {/* Risk Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                            <AlertCircle className="w-6 h-6 text-red-400" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">3</div>
                                            <div className="text-sm text-gray-400">Active Alerts</div>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">12</div>
                                            <div className="text-sm text-gray-400">Blocked Attempts</div>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-neon-purple" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">98.5%</div>
                                            <div className="text-sm text-gray-400">On-Platform Rate</div>
                                        </div>
                                    </div>
                                </Card>
                                <Card className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">₹45K</div>
                                            <div className="text-sm text-gray-400">Commission Protected</div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Active Alerts */}
                            <Card className="p-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                    Active Risk Alerts
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 1, user: 'Rahul M.', type: 'HIGH', reason: 'Attempted to share UPI ID before payment', time: '5 min ago', action: 'BLOCKED' },
                                        { id: 2, user: 'Priya S.', type: 'MEDIUM', reason: 'Mentioned WhatsApp in chat', time: '15 min ago', action: 'WARNED' },
                                        { id: 3, user: 'Amit K.', type: 'HIGH', reason: 'Multiple phone number share attempts', time: '1 hour ago', action: 'ACCOUNT_FLAGGED' }
                                    ].map((alert) => (
                                        <div key={alert.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.type === 'HIGH' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                                                    }`}>
                                                    {alert.type === 'HIGH' ? (
                                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                                    ) : (
                                                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{alert.user}</div>
                                                    <div className="text-sm text-gray-400">{alert.reason}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={alert.type === 'HIGH' ? 'danger' : 'warning'}>{alert.type}</Badge>
                                                <span className={`text-xs px-2 py-1 rounded-full ${alert.action === 'BLOCKED' ? 'bg-red-500/20 text-red-400' :
                                                    alert.action === 'WARNED' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-orange-500/20 text-orange-400'
                                                    }`}>
                                                    {alert.action.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Escrow Queue */}
                            <Card className="p-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                    Escrow Hold Queue
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                                                <th className="pb-3">Order ID</th>
                                                <th className="pb-3">Seller</th>
                                                <th className="pb-3">Amount</th>
                                                <th className="pb-3">Risk Score</th>
                                                <th className="pb-3">Hold Type</th>
                                                <th className="pb-3">Release Date</th>
                                                <th className="pb-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { id: 'ORD-4521', seller: 'Vikram S.', amount: 9500, riskScore: 45, holdType: 'HOLD_FOR_CONFIRMATION', releaseDate: '2026-02-11' },
                                                { id: 'ORD-4520', seller: 'Sneha P.', amount: 2800, riskScore: 72, holdType: 'MANUAL_ADMIN_REVIEW', releaseDate: 'Pending' },
                                                { id: 'ORD-4518', seller: 'Raj K.', amount: 1500, riskScore: 15, holdType: 'HOLD_FOR_CONFIRMATION', releaseDate: '2026-02-10' }
                                            ].map((order) => (
                                                <tr key={order.id} className="border-b border-white/5">
                                                    <td className="py-3 font-medium">{order.id}</td>
                                                    <td className="py-3">{order.seller}</td>
                                                    <td className="py-3 text-emerald-400">₹{order.amount.toLocaleString()}</td>
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-2 rounded-full overflow-hidden bg-white/10`}>
                                                                <div
                                                                    className={`h-full ${order.riskScore < 30 ? 'bg-emerald-500' :
                                                                        order.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                        }`}
                                                                    style={{ width: `${order.riskScore}%` }}
                                                                />
                                                            </div>
                                                            <span className={`text-xs ${order.riskScore < 30 ? 'text-emerald-400' :
                                                                order.riskScore < 60 ? 'text-yellow-400' : 'text-red-400'
                                                                }`}>
                                                                {order.riskScore}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${order.holdType === 'MANUAL_ADMIN_REVIEW'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                            {order.holdType === 'MANUAL_ADMIN_REVIEW' ? 'Admin Review' : 'Confirmation Hold'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-gray-400">{order.releaseDate}</td>
                                                    <td className="py-3">
                                                        <div className="flex gap-2">
                                                            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-xs py-1 px-2">
                                                                Release
                                                            </Button>
                                                            <Button variant="secondary" size="sm" className="text-xs py-1 px-2">
                                                                Review
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            {/* Detection Log */}
                            <Card className="p-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-neon-purple" />
                                    Recent Detection Log
                                </h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {[
                                        { time: '15:05:23', type: 'PHONE', action: 'BLOCKED', user: 'User #4521', sample: '987****210' },
                                        { time: '15:03:45', type: 'UPI', action: 'BLOCKED', user: 'User #4520', sample: 'user@paytm' },
                                        { time: '15:01:12', type: 'SOCIAL', action: 'WARNED', user: 'User #4518', sample: 'whatsapp mention' },
                                        { time: '14:58:32', type: 'EMAIL', action: 'BLOCKED', user: 'User #4515', sample: 'user@gm***' },
                                        { time: '14:55:10', type: 'INTENT', action: 'WARNED', user: 'User #4512', sample: 'pay directly mentioned' }
                                    ].map((log, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 font-mono text-xs">{log.time}</span>
                                                <Badge variant={log.type === 'PHONE' || log.type === 'UPI' || log.type === 'EMAIL' ? 'danger' : 'warning'}>
                                                    {log.type}
                                                </Badge>
                                                <span className="text-gray-400">{log.user}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 font-mono text-xs">{log.sample}</span>
                                                <span className={`text-xs ${log.action === 'BLOCKED' ? 'text-red-400' : 'text-yellow-400'}`}>
                                                    {log.action}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Users Section */}
                    {activeSection === 'users' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search users by name or email..."
                                        icon={<Search className="w-4 h-4" />}
                                    />
                                </div>
                                <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
                                    Filter
                                </Button>
                            </div>

                            <Card className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/5 border-b border-white/10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Tickets</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Sales</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Joined</th>
                                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map((user) => (
                                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center font-bold">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{user.name}</div>
                                                                <div className="text-sm text-gray-400">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={user.role === 'seller' ? 'concert' : 'train'}>
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={user.status === 'active' ? 'verified' : 'urgent'}>
                                                            {user.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-300">{user.tickets}</td>
                                                    <td className="px-6 py-4 text-emerald-400">₹{user.sales.toLocaleString()}</td>
                                                    <td className="px-6 py-4 text-gray-400">{new Date(user.joinedAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            {user.status === 'active' ? (
                                                                <button
                                                                    onClick={() => handleUserAction(user.id, 'suspend')}
                                                                    className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                                                >
                                                                    <Ban className="w-4 h-4" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleUserAction(user.id, 'activate')}
                                                                    className="p-2 rounded-lg hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 transition-colors"
                                                                >
                                                                    <UserCheck className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Orders Section */}
                    {activeSection === 'orders' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/5 border-b border-white/10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Order ID</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Ticket</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Buyer</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Seller</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {mockOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-neon-cyan">{order.id}</td>
                                                    <td className="px-6 py-4 font-medium">{order.ticket}</td>
                                                    <td className="px-6 py-4 text-gray-300">{order.buyer}</td>
                                                    <td className="px-6 py-4 text-gray-300">{order.seller}</td>
                                                    <td className="px-6 py-4 text-emerald-400 font-bold">₹{order.amount.toLocaleString()}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant={order.status === 'completed' ? 'verified' : 'pending'}>
                                                            {order.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">{new Date(order.date).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Disputes Section */}
                    {activeSection === 'disputes' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {mockDisputes.length > 0 ? (
                                <div className="space-y-4">
                                    {mockDisputes.map((dispute) => (
                                        <Card key={dispute.id} className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="urgent">Open Dispute</Badge>
                                                        <span className="text-sm text-gray-400">#{dispute.id}</span>
                                                    </div>
                                                    <h3 className="font-bold mb-2">{dispute.reason}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        Order: {dispute.orderId} • Reported by: {dispute.reporter}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(dispute.reportedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="secondary" size="sm">View Details</Button>
                                                    <Button size="sm">Resolve</Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="p-12 text-center">
                                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">No Disputes</h3>
                                    <p className="text-gray-400">All transactions are running smoothly! 🎉</p>
                                </Card>
                            )}
                        </motion.div>
                    )}

                    {/* Analytics Section */}
                    {activeSection === 'analytics' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">₹2.4L</div>
                                            <div className="text-sm text-gray-400">Total Revenue</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-emerald-400">+23% from last month</div>
                                </Card>
                                <Card className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">847</div>
                                            <div className="text-sm text-gray-400">Tickets Sold</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-emerald-400">+15% from last month</div>
                                </Card>
                                <Card className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                                            <UserCheck className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold">98.5%</div>
                                            <div className="text-sm text-gray-400">Success Rate</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-emerald-400">+2% from last month</div>
                                </Card>
                            </div>

                            <Card className="p-6">
                                <h3 className="font-bold mb-4">Category Distribution</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { name: 'Concerts', pct: 35, color: 'from-purple-500 to-pink-500' },
                                        { name: 'Movies', pct: 25, color: 'from-red-500 to-orange-500' },
                                        { name: 'Trains', pct: 20, color: 'from-cyan-500 to-blue-500' },
                                        { name: 'Buses', pct: 12, color: 'from-green-500 to-emerald-500' },
                                        { name: 'Sports', pct: 8, color: 'from-yellow-500 to-orange-500' },
                                    ].map((cat) => (
                                        <div key={cat.name} className="text-center">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl font-bold mx-auto mb-2`}>
                                                {cat.pct}%
                                            </div>
                                            <div className="text-sm text-gray-400">{cat.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Settings Section */}
                    {activeSection === 'settings' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-6 mb-6">
                                <h3 className="font-bold mb-4">Admin Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400">Admin Email</label>
                                        <div className="font-medium text-neon-purple">{ADMIN_EMAIL}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Current User</label>
                                        <div className="font-medium">{user?.email}</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 mb-6">
                                <h3 className="font-bold mb-4">Platform Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                        <div>
                                            <div className="font-medium">Platform Commission</div>
                                            <div className="text-sm text-gray-400">Fee charged on each transaction</div>
                                        </div>
                                        <div className="text-2xl font-bold text-neon-cyan">5%</div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                        <div>
                                            <div className="font-medium">Auto-Verification</div>
                                            <div className="text-sm text-gray-400">Automatically verify trusted sellers</div>
                                        </div>
                                        <div className="w-12 h-6 rounded-full bg-white/20 p-1">
                                            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                        <div>
                                            <div className="font-medium">Email Notifications</div>
                                            <div className="text-sm text-gray-400">Get notified for new tickets</div>
                                        </div>
                                        <div className="w-12 h-6 rounded-full bg-neon-purple p-1 flex justify-end">
                                            <div className="w-4 h-4 rounded-full bg-white"></div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Ticket Detail Modal */}
            <Modal
                isOpen={showTicketModal}
                onClose={() => setShowTicketModal(false)}
                title="Ticket Verification"
                size="lg"
            >
                {selectedTicket && (
                    <div className="space-y-6">
                        {/* Ticket Image */}
                        <div className="relative rounded-xl overflow-hidden">
                            <img
                                src={selectedTicket.imageUrl}
                                alt={selectedTicket.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-3 left-3">
                                <Badge variant={selectedTicket.category}>{selectedTicket.category}</Badge>
                            </div>
                        </div>

                        {/* Ticket Info */}
                        <div>
                            <h3 className="text-xl font-bold mb-2">{selectedTicket.title}</h3>
                            <p className="text-gray-400 text-sm">{selectedTicket.description}</p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Original Price</div>
                                <div className="font-medium line-through text-gray-400">₹{selectedTicket.originalPrice?.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Selling Price</div>
                                <div className="font-bold text-emerald-400">₹{selectedTicket.price.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Event Date</div>
                                <div className="font-medium">{new Date(selectedTicket.eventDate).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Quantity</div>
                                <div className="font-medium">{selectedTicket.quantity}</div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-xs text-gray-500 mb-1">Venue</div>
                                <div className="font-medium">{selectedTicket.venue}</div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-xs text-gray-500 mb-1">Seat Info</div>
                                <div className="font-medium">{selectedTicket.seatNumber}</div>
                            </div>
                            {selectedTicket.pnr && (
                                <div className="col-span-2">
                                    <div className="text-xs text-gray-500 mb-1">PNR Number</div>
                                    <div className="font-mono font-bold text-neon-cyan">{selectedTicket.pnr}</div>
                                </div>
                            )}
                        </div>

                        {/* Seller Info */}
                        <div className="p-4 rounded-xl bg-white/5">
                            <div className="text-xs text-gray-500 mb-3">Seller Information</div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center font-bold">
                                    {selectedTicket.seller.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium">{selectedTicket.seller.name}</div>
                                    <div className="text-sm text-gray-400 flex items-center gap-2">
                                        <Mail className="w-3 h-3" /> {selectedTicket.seller.email}
                                    </div>
                                    <div className="text-sm text-gray-400 flex items-center gap-2">
                                        <Phone className="w-3 h-3" /> {selectedTicket.seller.phone}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                icon={<Check className="w-5 h-5" />}
                                onClick={() => handleApprove(selectedTicket.id)}
                            >
                                Approve Ticket
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                                icon={<X className="w-5 h-5" />}
                                onClick={() => handleReject(selectedTicket.id)}
                            >
                                Reject Ticket
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </main>
    );
};

export default AdminDashboard;
