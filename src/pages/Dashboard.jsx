import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Wallet, ShoppingBag, Clock, TrendingUp, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

// Mock user data
const mockListings = [
    {
        id: '1',
        title: 'Coldplay Mumbai Concert',
        price: 9500,
        status: 'verified',
        views: 234,
        created: '2026-02-05'
    },
    {
        id: '2',
        title: 'Rajdhani Express - Feb 14',
        price: 2800,
        status: 'pending',
        views: 45,
        created: '2026-02-07'
    }
];

const mockPurchases = [
    {
        id: '1',
        title: 'Arijit Singh Concert',
        price: 4200,
        date: '2026-04-10',
        status: 'confirmed'
    }
];

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('listings');

    if (!user) {
        navigate('/login');
        return null;
    }

    const stats = [
        { label: 'Total Listings', value: mockListings.length, icon: Ticket, color: 'text-neon-purple' },
        { label: 'Wallet Balance', value: '₹2,450', icon: Wallet, color: 'text-emerald-400' },
        { label: 'Purchases', value: mockPurchases.length, icon: ShoppingBag, color: 'text-neon-cyan' },
        { label: 'Total Views', value: mockListings.reduce((acc, l) => acc + l.views, 0), icon: Eye, color: 'text-neon-pink' }
    ];

    const tabs = [
        { id: 'listings', label: 'My Listings', count: mockListings.length },
        { id: 'purchases', label: 'Purchases', count: mockPurchases.length },
        { id: 'wallet', label: 'Wallet' }
    ];

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-2xl font-bold">
                            {user.displayName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user.displayName || 'User'}</h1>
                            <p className="text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/sell">
                            <Button icon={<Plus className="w-5 h-5" />}>
                                List New Ticket
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat, index) => (
                        <Card key={index} hover={false} className="p-5">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.color.replace('text-', 'bg-')}/20 flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                                    <div className="text-xs text-gray-500">{stat.label}</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2 mb-6 overflow-x-auto pb-2"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-neon-purple text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {activeTab === 'listings' && (
                        <div className="space-y-4">
                            {mockListings.length > 0 ? (
                                mockListings.map((listing) => (
                                    <Card key={listing.id} hover={false} className="p-5">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <Ticket className="w-8 h-8 text-neon-purple" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{listing.title}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <Badge variant={listing.status}>{listing.status}</Badge>
                                                        <span className="text-sm text-gray-400">
                                                            <Eye className="w-3 h-3 inline mr-1" />
                                                            {listing.views} views
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-xl font-bold gradient-text">
                                                    ₹{listing.price.toLocaleString()}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                                                        <Edit className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                    <button className="p-2 rounded-lg hover:bg-red-500/20 transition-colors">
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                                    <p className="text-gray-400 mb-6">Start selling your unused tickets</p>
                                    <Link to="/sell">
                                        <Button>List Your First Ticket</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'purchases' && (
                        <div className="space-y-4">
                            {mockPurchases.length > 0 ? (
                                mockPurchases.map((purchase) => (
                                    <Card key={purchase.id} hover={false} className="p-5">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                    <ShoppingBag className="w-8 h-8 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{purchase.title}</h3>
                                                    <div className="text-sm text-gray-400 mt-1">
                                                        Event Date: {new Date(purchase.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge variant="verified">Confirmed</Badge>
                                                <div className="text-xl font-bold text-emerald-400">
                                                    ₹{purchase.price.toLocaleString()}
                                                </div>
                                                <Button variant="secondary" size="sm">
                                                    View Ticket
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                                    <p className="text-gray-400 mb-6">Browse tickets and make your first purchase</p>
                                    <Link to="/browse">
                                        <Button>Browse Tickets</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'wallet' && (
                        <Card hover={false} className="p-8">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Wallet className="w-10 h-10 text-emerald-400" />
                                </div>
                                <div className="text-4xl font-bold gradient-text mb-2">₹2,450</div>
                                <p className="text-gray-400 mb-6">Available Balance</p>
                                <div className="flex justify-center gap-4">
                                    <Button>Withdraw</Button>
                                    <Button variant="secondary">Transaction History</Button>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <h4 className="font-semibold mb-4">Recent Transactions</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Ticket Sold</div>
                                                <div className="text-xs text-gray-500">Feb 5, 2026</div>
                                            </div>
                                        </div>
                                        <div className="text-emerald-400 font-semibold">+₹4,500</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </motion.div>
            </div>
        </main>
    );
};

export default Dashboard;
