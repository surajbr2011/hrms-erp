const express = require('express');
const router = express.Router();
const { getHolidays, createHoliday, deleteHoliday } = require('../controllers/holidayController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getHolidays);
router.post('/', protect, authorize('Admin'), createHoliday);
router.delete('/:id', protect, authorize('Admin'), deleteHoliday);

module.exports = router;
