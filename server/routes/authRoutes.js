const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, refresh, logout, getMe, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getUsers);

module.exports = router;
