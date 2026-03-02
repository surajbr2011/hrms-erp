const express = require('express');
const router = express.Router();
const { submitReport, getReports, updateReportStatus } = require('../controllers/dailyReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, submitReport);
router.get('/', protect, authorize('Admin', 'Manager'), getReports);
router.put('/:id', protect, authorize('Admin', 'Manager'), updateReportStatus);

module.exports = router;
