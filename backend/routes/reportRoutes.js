const express = require('express');
const router = express.Router();
const {
    getAttendanceReportPDF,
    getPayrollReportPDF
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/attendance/pdf')
    .get(protect, authorize('Admin', 'Manager'), getAttendanceReportPDF);

router.route('/payroll/pdf')
    .get(protect, authorize('Admin'), getPayrollReportPDF);

module.exports = router;
