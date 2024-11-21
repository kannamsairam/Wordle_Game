const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

//Register new user
router.post('/register', userController.register);

//Login user
router.post('/login', userController.login);

//OTP
router.post('/forgot-password', userController.forgotPassword);

// Validate OTP
router.post('validate-otp', userController.validateOtp);

// Reset password
router.post('reset-password', userController.resetPassword);

module.exports = router;