import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Megaphone, Calendar, MapPin, IndianRupee, Users,
    Clock, AlertTriangle, Send, Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const categories = [
    { value: 'concert', label: '🎵 Concert' },
    { value: 'movie', label: '🎬 Movie' },
    { value: 'train', label: '🚆 Train' },
    { value: 'bus', label: '🚌 Bus' },
    { value: 'sports', label: '⚽ Sports' }
];

const urgencyLevels = [
    { value: 'high', label: 'Very Urgent (< 48 hours)', color: 'text-red-400' },
    { value: 'medium', label: 'Moderate (< 1 week)', color: 'text-yellow-400' },
    { value: 'low', label: 'Flexible (> 1 week)', color: 'text-emerald-400' }
];

const UrgentRequestForm = ({ onSuccess, onCancel }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'concert',
        eventDate: '',
        location: '',
        quantity: 1,
        budgetMin: '',
        budgetMax: '',
        urgency: 'medium',
        additionalNotes: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        setSubmitted(true);

        setTimeout(() => {
            onSuccess?.();
        }, 2000);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
            >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Request Posted!</h3>
                <p className="text-gray-400">
                    Sellers will be notified about your request. You'll receive messages when they respond.
                </p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-neon-purple" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Post Urgent Request</h3>
                    <p className="text-sm text-gray-400">Let sellers know what you need</p>
                </div>
            </div>

            {/* Title */}
            <Input
                label="What ticket are you looking for?"
                placeholder="e.g., Coldplay Mumbai Concert - 2 tickets"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
            />

            {/* Category & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-neon-purple focus:outline-none transition-colors"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value} className="bg-dark-800">
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    label="Event Date"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleChange('eventDate', e.target.value)}
                    icon={<Calendar className="w-5 h-5" />}
                    required
                />
            </div>

            {/* Location & Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Location/Venue"
                    placeholder="e.g., Mumbai, DY Patil Stadium"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    icon={<MapPin className="w-5 h-5" />}
                    required
                />
                <Input
                    label="Quantity Needed"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                    icon={<Users className="w-5 h-5" />}
                    required
                />
            </div>

            {/* Budget Range */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    <IndianRupee className="w-4 h-4 inline mr-1" />
                    Budget Range (per ticket)
                </label>
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Min"
                        type="number"
                        value={formData.budgetMin}
                        onChange={(e) => handleChange('budgetMin', e.target.value)}
                        required
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                        placeholder="Max"
                        type="number"
                        value={formData.budgetMax}
                        onChange={(e) => handleChange('budgetMax', e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Urgency Level */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Clock className="w-4 h-4 inline mr-1" />
                    How urgent is this?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {urgencyLevels.map(level => (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => handleChange('urgency', level.value)}
                            className={`p-3 rounded-xl border text-left transition-all ${formData.urgency === level.value
                                    ? 'border-neon-purple bg-neon-purple/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className={`font-medium text-sm ${level.color}`}>
                                {level.value === 'high' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                                {level.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Additional Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (optional)
                </label>
                <textarea
                    rows={3}
                    placeholder="Any specific preferences like seat location, section, etc."
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-neon-purple focus:outline-none transition-colors resize-none"
                />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    icon={<Send className="w-5 h-5" />}
                    className="flex-1"
                >
                    Post Request
                </Button>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 text-center">
                Your contact info will only be shared with sellers who respond to your request.
            </p>
        </form>
    );
};

export default UrgentRequestForm;
