import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['concert', 'movie', 'sports', 'train', 'bus', 'travel']
    },
    eventType: {
        type: String
    },
    originalPrice: {
        type: Number,
        required: [true, 'Please add original price']
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Please add selling price']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    imageUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
    sellerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    sellerName: {
        type: String
    },
    city: {
        type: String
    },
    venue: {
        type: String
    },
    eventDate: {
        type: Date,
        required: [true, 'Please add event date']
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'expired', 'pending_verification', 'approved', 'rejected'],
        default: 'pending_verification'
    },
    verified: {
        type: Boolean,
        default: false
    },
    rejectionReason: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Ticket', ticketSchema);
