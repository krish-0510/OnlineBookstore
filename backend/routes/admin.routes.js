const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const adminController = require('../controllers/admin.controller');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    adminController.registerAdmin
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    adminController.loginAdmin
)

module.exports = router;
