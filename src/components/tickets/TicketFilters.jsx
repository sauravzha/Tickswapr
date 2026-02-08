import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const TicketFilters = ({ onFilterChange, activeFilters }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 50000]);
    const [sortBy, setSortBy] = useState('newest');

    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'concert', name: 'Concerts' },
        { id: 'movie', name: 'Movies' },
        { id: 'train', name: 'Trains' },
        { id: 'bus', name: 'Buses' },
        { id: 'sports', name: 'Sports' },
    ];

    const sortOptions = [
        { id: 'newest', name: 'Newest First' },
        { id: 'oldest', name: 'Oldest First' },
        { id: 'price_low', name: 'Price: Low to High' },
        { id: 'price_high', name: 'Price: High to Low' },
        { id: 'discount', name: 'Best Discount' },
    ];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        onFilterChange?.({ searchTerm: e.target.value, category: selectedCategory, priceRange, sortBy });
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        onFilterChange?.({ searchTerm, category: categoryId, priceRange, sortBy });
    };

    const handleSortChange = (sortId) => {
        setSortBy(sortId);
        onFilterChange?.({ searchTerm, category: selectedCategory, priceRange, sortBy: sortId });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setPriceRange([0, 50000]);
        setSortBy('newest');
        onFilterChange?.({ searchTerm: '', category: 'all', priceRange: [0, 50000], sortBy: 'newest' });
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search events, venues, artists..."
                        value={searchTerm}
                        onChange={handleSearch}
                        icon={<Search className="w-5 h-5" />}
                    />
                </div>
                <Button
                    variant="secondary"
                    onClick={() => setShowFilters(!showFilters)}
                    icon={<Filter className="w-5 h-5" />}
                >
                    <span className="hidden sm:inline">Filters</span>
                </Button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category.id
                                ? 'bg-neon-purple text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Expanded Filters */}
            <motion.div
                initial={false}
                animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
                className="overflow-hidden"
            >
                <div className="glass-card p-6 mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold">Filters</h3>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-neon-purple hover:text-neon-pink transition-colors"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Price Range
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                    className="input-glass w-24 text-center"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                                    className="input-glass w-24 text-center"
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Sort By
                            </label>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="input-glass appearance-none cursor-pointer pr-10"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.id} value={option.id} className="bg-dark-800">
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Verification Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Status
                            </label>
                            <div className="flex gap-2">
                                <button className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                                    Verified Only
                                </button>
                                <button className="px-3 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10">
                                    All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TicketFilters;
