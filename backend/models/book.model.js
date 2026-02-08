const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    dateOfPublishing: {
        type: Date,
        default: Date.now
    },
    isbn: {
        type: String,
        trim: true
        // Optional as per requirements
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller', // Referencing the seller model
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    }
}, { timestamps: true });

const bookModel = mongoose.model('book', bookSchema);

module.exports = bookModel;
