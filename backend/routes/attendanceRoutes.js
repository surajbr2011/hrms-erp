const express = require('express');
const router = express.Router();
const {
    getAttendance,
    checkIn,
    checkOut,
    startBreak,
    endBreak
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAttendance);
router.route('/check-in').post(protect, checkIn);
router.route('/check-out').put(protect, checkOut);
router.route('/break-start').post(protect, startBreak);
router.route('/break-end').put(protect, endBreak);

module.exports = router;
