const sellerModel = require('../models/seller.model');
const { validationResult } = require('express-validator');

module.exports.registerSeller = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { storename, email, password } = req.body;

    try {
        const isSellerAlready = await sellerModel.findOne({ email });

        if (isSellerAlready) {
            return res.status(400).json({ message: 'Seller already exist' });
        }

        const hashedPassword = await sellerModel.hashPassword(password);

        const seller = await sellerModel.create({
            storename,
            email,
            password: hashedPassword
        });

        const token = seller.generateAuthToken();

        res.status(201).json({ token, seller });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

module.exports.loginSeller = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const seller = await sellerModel.findOne({ email }).select('+password');

        if (!seller) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await seller.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = seller.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, seller });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}
