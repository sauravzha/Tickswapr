import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Calendar, MapPin, IndianRupee, Ticket, AlertCircle, X, Train, Bus, Film, Music, Trophy } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const TicketForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'concert',
        eventDate: '',
        eventTime: '',
        // Common fields
        quantity: '1',
        originalPrice: '',
        sellingPrice: '',
        description: '',
        urgency: 'normal',
        // Concert/Sports/Movie fields
        venue: '',
        seatSection: '',
        row: '',
        seatNumber: '',
        // Train fields
        trainNumber: '',
        trainName: '',
        pnr: '',
        coach: '',
        berth: '',
        fromStation: '',
        toStation: '',
        class: 'sleeper',
        // Bus fields
        busOperator: '',
        busNumber: '',
        boardingPoint: '',
        droppingPoint: '',
        // Movie fields
        theater: '',
        screen: '',
        // Sports fields
        stadium: '',
        gate: '',
    });
    const [ticketImage, setTicketImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const categories = [
        { id: 'concert', name: 'Concert', icon: '🎵', lucide: Music },
        { id: 'movie', name: 'Movie', icon: '🎬', lucide: Film },
        { id: 'train', name: 'Train', icon: '🚆', lucide: Train },
        { id: 'bus', name: 'Bus', icon: '🚌', lucide: Bus },
        { id: 'sports', name: 'Sports', icon: '🏆', lucide: Trophy },
    ];

    const trainClasses = [
        { id: 'sleeper', name: 'Sleeper (SL)' },
        { id: '3ac', name: '3rd AC (3A)' },
        { id: '2ac', name: '2nd AC (2A)' },
        { id: '1ac', name: '1st AC (1A)' },
        { id: 'cc', name: 'Chair Car (CC)' },
        { id: 'ec', name: 'Executive Chair (EC)' },
    ];

    // Reset category-specific fields when category changes
    useEffect(() => {
        // Keep common fields, reset category-specific ones
        setFormData(prev => ({
            ...prev,
            venue: '',
            seatSection: '',
            row: '',
            seatNumber: '',
            trainNumber: '',
            trainName: '',
            pnr: '',
            coach: '',
            berth: '',
            fromStation: '',
            toStation: '',
            class: 'sleeper',
            busOperator: '',
            busNumber: '',
            boardingPoint: '',
            droppingPoint: '',
            theater: '',
            screen: '',
            stadium: '',
            gate: '',
        }));
    }, [formData.category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleCategoryChange = (categoryId) => {
        setFormData(prev => ({ ...prev, category: categoryId }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
                return;
            }
            setTicketImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setTicketImage(null);
        setImagePreview(null);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.eventDate) newErrors.eventDate = 'Date is required';
        if (!formData.originalPrice) newErrors.originalPrice = 'Original price is required';
        if (!formData.sellingPrice) newErrors.sellingPrice = 'Selling price is required';
        if (parseInt(formData.sellingPrice) > parseInt(formData.originalPrice)) {
            newErrors.sellingPrice = 'Selling price cannot exceed original price';
        }
        // Image is optional now - no validation required

        // Category-specific validation
        if (formData.category === 'train') {
            if (!formData.fromStation) newErrors.fromStation = 'From station is required';
            if (!formData.toStation) newErrors.toStation = 'To station is required';
            if (!formData.pnr) newErrors.pnr = 'PNR is required';
        } else if (formData.category === 'bus') {
            if (!formData.boardingPoint) newErrors.boardingPoint = 'Boarding point is required';
            if (!formData.droppingPoint) newErrors.droppingPoint = 'Dropping point is required';
        } else if (formData.category === 'movie') {
            if (!formData.theater) newErrors.theater = 'Theater is required';
        } else {
            if (!formData.venue) newErrors.venue = 'Venue is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit?.({ ...formData, image: ticketImage });
        }
    };

    // Dynamic fields based on category
    const renderCategoryFields = () => {
        const containerVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
        };

        switch (formData.category) {
            case 'train':
                return (
                    <motion.div
                        key="train"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
                            <div className="flex items-center gap-2 text-cyan-400 text-sm">
                                <Train className="w-4 h-4" />
                                <span>Train Ticket Details</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="From Station *"
                                name="fromStation"
                                value={formData.fromStation}
                                onChange={handleChange}
                                placeholder="e.g., New Delhi"
                                error={errors.fromStation}
                            />
                            <Input
                                label="To Station *"
                                name="toStation"
                                value={formData.toStation}
                                onChange={handleChange}
                                placeholder="e.g., Mumbai Central"
                                error={errors.toStation}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Train Number"
                                name="trainNumber"
                                value={formData.trainNumber}
                                onChange={handleChange}
                                placeholder="e.g., 12952"
                            />
                            <Input
                                label="Train Name"
                                name="trainName"
                                value={formData.trainName}
                                onChange={handleChange}
                                placeholder="e.g., Mumbai Rajdhani"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="PNR Number *"
                                name="pnr"
                                value={formData.pnr}
                                onChange={handleChange}
                                placeholder="10 digit PNR"
                                error={errors.pnr}
                            />
                            <Input
                                label="Coach"
                                name="coach"
                                value={formData.coach}
                                onChange={handleChange}
                                placeholder="e.g., B1, S5"
                            />
                            <Input
                                label="Berth/Seat"
                                name="berth"
                                value={formData.berth}
                                onChange={handleChange}
                                placeholder="e.g., 45 (Lower)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Class
                            </label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {trainClasses.map((cls) => (
                                    <button
                                        key={cls.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, class: cls.id }))}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${formData.class === cls.id
                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 border'
                                            : 'bg-white/5 border-white/10 border hover:border-white/20'
                                            }`}
                                    >
                                        {cls.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 'bus':
                return (
                    <motion.div
                        key="bus"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-4">
                            <div className="flex items-center gap-2 text-green-400 text-sm">
                                <Bus className="w-4 h-4" />
                                <span>Bus Ticket Details</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Boarding Point *"
                                name="boardingPoint"
                                value={formData.boardingPoint}
                                onChange={handleChange}
                                placeholder="e.g., Kashmere Gate, Delhi"
                                error={errors.boardingPoint}
                            />
                            <Input
                                label="Dropping Point *"
                                name="droppingPoint"
                                value={formData.droppingPoint}
                                onChange={handleChange}
                                placeholder="e.g., Huda City Centre, Gurugram"
                                error={errors.droppingPoint}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Bus Operator"
                                name="busOperator"
                                value={formData.busOperator}
                                onChange={handleChange}
                                placeholder="e.g., RedBus, VRL Travels"
                            />
                            <Input
                                label="Bus Number / Name"
                                name="busNumber"
                                value={formData.busNumber}
                                onChange={handleChange}
                                placeholder="e.g., Volvo Multi-Axle"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Seat Number"
                                name="seatNumber"
                                value={formData.seatNumber}
                                onChange={handleChange}
                                placeholder="e.g., 23, 24"
                            />
                            <Input
                                label="Quantity"
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="1"
                                min="1"
                            />
                        </div>
                    </motion.div>
                );

            case 'movie':
                return (
                    <motion.div
                        key="movie"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-4">
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <Film className="w-4 h-4" />
                                <span>Movie Ticket Details</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Theater/Multiplex *"
                                name="theater"
                                value={formData.theater}
                                onChange={handleChange}
                                placeholder="e.g., PVR Phoenix Mall"
                                error={errors.theater}
                            />
                            <Input
                                label="Screen Number"
                                name="screen"
                                value={formData.screen}
                                onChange={handleChange}
                                placeholder="e.g., Screen 5"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Seat Row"
                                name="row"
                                value={formData.row}
                                onChange={handleChange}
                                placeholder="e.g., J"
                            />
                            <Input
                                label="Seat Number(s)"
                                name="seatNumber"
                                value={formData.seatNumber}
                                onChange={handleChange}
                                placeholder="e.g., 12, 13, 14"
                            />
                            <Input
                                label="Quantity"
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="1"
                                min="1"
                            />
                        </div>
                    </motion.div>
                );

            case 'sports':
                return (
                    <motion.div
                        key="sports"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 mb-4">
                            <div className="flex items-center gap-2 text-orange-400 text-sm">
                                <Trophy className="w-4 h-4" />
                                <span>Sports Ticket Details</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Stadium/Venue *"
                                name="stadium"
                                value={formData.stadium}
                                onChange={handleChange}
                                placeholder="e.g., Wankhede Stadium"
                                error={errors.venue}
                            />
                            <Input
                                label="Gate/Entry"
                                name="gate"
                                value={formData.gate}
                                onChange={handleChange}
                                placeholder="e.g., Gate 4"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Stand/Section"
                                name="seatSection"
                                value={formData.seatSection}
                                onChange={handleChange}
                                placeholder="e.g., North Stand"
                            />
                            <Input
                                label="Row"
                                name="row"
                                value={formData.row}
                                onChange={handleChange}
                                placeholder="e.g., Row 15"
                            />
                            <Input
                                label="Seat Number(s)"
                                name="seatNumber"
                                value={formData.seatNumber}
                                onChange={handleChange}
                                placeholder="e.g., 23, 24"
                            />
                        </div>

                        <Input
                            label="Quantity"
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="1"
                            min="1"
                        />
                    </motion.div>
                );

            case 'concert':
            default:
                return (
                    <motion.div
                        key="concert"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-6"
                    >
                        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 mb-4">
                            <div className="flex items-center gap-2 text-purple-400 text-sm">
                                <Music className="w-4 h-4" />
                                <span>Concert Ticket Details</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Venue *"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                placeholder="e.g., DY Patil Stadium, Mumbai"
                                error={errors.venue}
                                icon={<MapPin className="w-5 h-5" />}
                            />
                            <Input
                                label="Section/Zone"
                                name="seatSection"
                                value={formData.seatSection}
                                onChange={handleChange}
                                placeholder="e.g., Gold, Platinum, Floor"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Row"
                                name="row"
                                value={formData.row}
                                onChange={handleChange}
                                placeholder="e.g., Row A"
                            />
                            <Input
                                label="Seat Number(s)"
                                name="seatNumber"
                                value={formData.seatNumber}
                                onChange={handleChange}
                                placeholder="e.g., 15, 16"
                            />
                            <Input
                                label="Quantity"
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="1"
                                min="1"
                            />
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                    Ticket Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryChange(cat.id)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-4 rounded-xl border transition-all text-center overflow-hidden ${formData.category === cat.id
                                ? 'border-neon-purple bg-neon-purple/10'
                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                        >
                            {formData.category === cat.id && (
                                <motion.div
                                    layoutId="categoryIndicator"
                                    className="absolute inset-0 bg-neon-purple/10 border-2 border-neon-purple rounded-xl"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className="relative">
                                <div className="text-3xl mb-2">{cat.icon}</div>
                                <div className="text-sm font-medium">{cat.name}</div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label={`${formData.category === 'train' ? 'Journey' : formData.category === 'movie' ? 'Movie' : 'Event'} Title *`}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={
                        formData.category === 'train' ? 'e.g., Delhi to Mumbai Rajdhani' :
                            formData.category === 'movie' ? 'e.g., Avengers: Secret Wars - IMAX' :
                                formData.category === 'bus' ? 'e.g., Delhi to Jaipur Volvo' :
                                    'e.g., Coldplay World Tour 2026'
                    }
                    error={errors.title}
                    icon={<Ticket className="w-5 h-5" />}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={`${formData.category === 'train' || formData.category === 'bus' ? 'Travel' : 'Event'} Date *`}
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        error={errors.eventDate}
                    />
                    <Input
                        label={formData.category === 'train' ? 'Departure Time' : 'Time'}
                        type="time"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Dynamic Category-Specific Fields */}
            <AnimatePresence mode="wait">
                {renderCategoryFields()}
            </AnimatePresence>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Original Price (₹) *"
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="5000"
                    error={errors.originalPrice}
                    icon={<IndianRupee className="w-5 h-5" />}
                />
                <Input
                    label="Your Selling Price (₹) *"
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    placeholder="4500"
                    error={errors.sellingPrice}
                    icon={<IndianRupee className="w-5 h-5" />}
                />
            </div>


            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Details
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Any additional information about the ticket..."
                    className="input-glass resize-none"
                />
            </div>

            {/* Urgency */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                    Urgency Level
                </label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, urgency: 'normal' }))}
                        className={`px-6 py-3 rounded-xl border transition-all ${formData.urgency === 'normal'
                            ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                            : 'border-white/10 bg-white/5 text-gray-400'
                            }`}
                    >
                        Normal
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, urgency: 'urgent' }))}
                        className={`px-6 py-3 rounded-xl border transition-all flex items-center gap-2 ${formData.urgency === 'urgent'
                            ? 'border-red-500 bg-red-500/10 text-red-400'
                            : 'border-white/10 bg-white/5 text-gray-400'
                            }`}
                    >
                        <AlertCircle className="w-4 h-4" />
                        Urgent (Expiring Soon)
                    </button>
                </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                    Ticket Image/Screenshot (Optional)
                </label>

                {imagePreview ? (
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Ticket preview"
                            className="max-w-xs rounded-xl border border-white/10"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <Upload className="w-10 h-10 text-gray-400 mb-4" />
                        <span className="text-gray-400 mb-1">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</span>
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                )}
                {errors.image && <p className="mt-2 text-sm text-red-400">{errors.image}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary">
                    Save as Draft
                </Button>
                <Button type="submit" loading={loading}>
                    Submit for Verification
                </Button>
            </div>
        </form>
    );
};

export default TicketForm;
