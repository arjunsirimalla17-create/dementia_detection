const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    forgotPassword,
    verifyOtp,
    resetPassword
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;