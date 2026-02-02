const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sellerSchema = new mongoose.Schema({
    storename: {
        type: String,
        required: true,
        minlength: [3, 'Store name must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

sellerSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

sellerSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

sellerSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const sellerModel = mongoose.model('seller', sellerSchema);

module.exports = sellerModel;
