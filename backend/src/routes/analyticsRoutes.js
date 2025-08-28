const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  analyticsSummary,
  analyticsSSE
} = require('../controllers/analyticsController');

router.get('/summary', protect, analyticsSummary);

router.get('/stream', protect, analyticsSSE);

module.exports = router;
