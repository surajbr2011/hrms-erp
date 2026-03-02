const express = require('express');
const router = express.Router();
const PayrollStructure = require('../models/PayrollStructure');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/structure', protect, authorize('Admin', 'Manager'), async (req, res) => {
    try {
        const { employeeId, basicSalary, hraPercentage, allowances, deductions } = req.body;

        let structure = await PayrollStructure.findOne({ employeeId });
        if (structure) {
            structure.basicSalary = basicSalary;
            structure.hraPercentage = hraPercentage;
            structure.allowances = allowances;
            structure.deductions = deductions;
            await structure.save();
        } else {
            structure = await PayrollStructure.create({ employeeId, basicSalary, hraPercentage, allowances, deductions });
        }

        res.status(200).json(structure);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/structure/:employeeId', protect, async (req, res) => {
    try {
        const structure = await PayrollStructure.findOne({ employeeId: req.params.employeeId });
        res.json(structure);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// Keep old dummy routes
router.get('/', (req, res) => res.json({ message: 'Payroll structure API' }));

module.exports = router;
