const express = require('express');
const router = express.Router();
const {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getDepartments)
    .post(protect, authorize('Admin'), createDepartment);

router.route('/:id')
    .put(protect, authorize('Admin'), updateDepartment)
    .delete(protect, authorize('Admin'), deleteDepartment);

module.exports = router;
