const express = require('express');
const router = express.Router();
const {
    getLeaves,
    applyLeave,
    updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getLeaves)
    .post(protect, applyLeave);

router.route('/:id')
    .put(protect, authorize('Admin', 'Manager'), updateLeaveStatus);

module.exports = router;
