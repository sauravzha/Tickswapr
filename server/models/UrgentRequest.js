const mongoose = require('mongoose');

const urgentRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title for your request'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['concert', 'movie', 'sports', 'train', 'bus', 'travel']
    },
    city: {
        type: String,
        required: [true, 'Please add a city']
    },
    maxPrice: {
        type: Number
    },
    note: {
        type: String,
        maxlength: [200, 'Note cannot be more than 200 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UrgentRequest', urgentRequestSchema);
