const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controller/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes (anyone can access these)
router.post('/register', register);
router.post('/login', login);

// Private route (requires a valid JWT wristband)
router.get('/me', protect, getMe);

module.exports = router;
