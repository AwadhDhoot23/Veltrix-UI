const express = require('express');
const router = express.Router();
const { incrementCopy, getDashboardStats } = require('../controller/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/copy/:slug', incrementCopy);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
