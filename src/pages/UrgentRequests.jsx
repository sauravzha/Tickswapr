import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus, Clock, MapPin, Tag, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUrgentRequests, createUrgentRequest, deleteUrgentRequest } from '../services/urgentRequestService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

const UrgentRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'concert',
        city: '',
        maxPrice: '',
        note: ''
    });

    const fetchRequests = async () => {
        try {
            const data = await getUrgentRequests();
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUrgentRequest(formData);
            setShowModal(false);
            setFormData({ title: '', category: 'concert', city: '', maxPrice: '', note: '' });
            fetchRequests(); // Refresh list
        } catch (error) {
            alert('Failed to create request: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await deleteUrgentRequest(id);
                setRequests(prev => prev.filter(req => req._id !== id));
            } catch (error) {
                alert('Failed to delete: ' + error.message);
            }
        }
    };

    const isAdmin = user?.email === 'jhasaurav562@gmail.com';

    return (
        <main className="min-h-screen pt-24 pb-16 container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <AlertTriangle className="text-yellow-400" />
                        Urgent Ticket Requests
                    </h1>
                    <p className="text-gray-400">Buyers looking for tickets urgently. Help them out!</p>
                </div>
                {user && (
                    <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
                        Post Request
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : requests.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-white/10">
                    <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No urgent requests yet</h3>
                    <p className="text-gray-400 mb-6">Be the first to post a request!</p>
                    {user && <Button onClick={() => setShowModal(true)}>Post Request</Button>}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((req) => (
                        <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="p-6 relative group h-full flex flex-col">
                                {(isAdmin || user?._id === req.userId?._id) && (
                                    <button
                                        onClick={() => handleDelete(req._id)}
                                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}

                                <div className="flex items-start justify-between mb-4">
                                    <Badge variant={req.category}>{req.category}</Badge>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2">{req.title}</h3>

                                <div className="space-y-2 mb-4 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <MapPin className="w-4 h-4 text-neon-purple" />
                                        {req.city}
                                    </div>
                                    {req.maxPrice && (
                                        <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                                            <Tag className="w-4 h-4" />
                                            Max Price: ₹{req.maxPrice.toLocaleString()}
                                        </div>
                                    )}
                                    {req.note && (
                                        <p className="text-sm text-gray-400 italic mt-2">"{req.note}"</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                    <div className="text-xs text-gray-500">
                                        Posted by <span className="text-neon-cyan">{req.userId?.name || 'User'}</span>
                                    </div>
                                    <Button size="sm" variant="secondary">Contact</Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Request Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post Urgent Request">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="What do you need?"
                        name="title"
                        placeholder="e.g. 2 Tickets for Coldplay"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
                            >
                                <option value="concert">Concert</option>
                                <option value="movie">Movie</option>
                                <option value="sports">Sports</option>
                                <option value="travel">Travel</option>
                            </select>
                        </div>
                        <Input
                            label="City"
                            name="city"
                            placeholder="e.g. Mumbai"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input
                        label="Max Price (Optional)"
                        name="maxPrice"
                        type="number"
                        placeholder="₹"
                        value={formData.maxPrice}
                        onChange={handleChange}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Note (Optional)</label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors h-24 resize-none"
                            placeholder="Any specific details..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button type="submit">Post Request</Button>
                    </div>
                </form>
            </Modal>
        </main>
    );
};

export default UrgentRequests;
