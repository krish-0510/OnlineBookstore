const { validationResult } = require('express-validator');
const orderModel = require('../models/order.model');
const bookModel = require('../models/book.model');

module.exports.placeOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { bookId, quantity = 1, shippingAddress, contactPhone, notes } = req.body;

        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const qty = Number(quantity) || 1;
        const unitPrice = book.price;
        const totalPrice = unitPrice * qty;

        const order = await orderModel.create({
            userId: req.user._id,
            sellerId: book.sellerId,
            bookId: book._id,
            bookName: book.name,
            bookAuthor: book.author,
            unitPrice,
            quantity: qty,
            totalPrice,
            shippingAddress,
            contactPhone,
            notes
        });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports.getMyOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports.getMyOrderById = async (req, res) => {
    try {
        const order = await orderModel.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports.getSellerOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ sellerId: req.seller._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'fullname email')
            .populate('bookId', 'name author price');
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports.getSellerOrderById = async (req, res) => {
    try {
        const order = await orderModel
            .findOne({ _id: req.params.id, sellerId: req.seller._id })
            .populate('userId', 'fullname email')
            .populate('bookId', 'name author price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
