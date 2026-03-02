const Payslip = require('../models/Payslip');
const PayrollStructure = require('../models/PayrollStructure');

// @desc    Get all payslips for current user
// @route   GET /api/payroll/my-payslips
// @access  Private
const getMyPayslips = async (req, res) => {
    try {
        const payslips = await Payslip.find({ user: req.user._id }).sort({ year: -1, month: -1 });
        res.json(payslips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all payslips (Admin)
// @route   GET /api/payroll/all
// @access  Private/Admin
const getAllPayslips = async (req, res) => {
    try {
        const payslips = await Payslip.find().populate('user', 'name email department').sort({ year: -1, month: -1 });
        res.json(payslips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Payroll for a month (Admin)
// @route   POST /api/payroll/generate
// @access  Private/Admin
const generateBatchPayroll = async (req, res) => {
    const { month, year } = req.body; // e.g., 'October', 2024

    try {
        // Basic logic: Get all active structures
        const structures = await PayrollStructure.find().populate('user');

        let generated = 0;

        for (const structure of structures) {
            if (!structure.user || structure.user.status === 'Inactive') continue;

            const payslipExists = await Payslip.findOne({ user: structure.user._id, month, year });
            if (!payslipExists) {
                await Payslip.create({
                    user: structure.user._id,
                    month,
                    year,
                    baseSalary: structure.baseSalary,
                    allowances: structure.allowances,
                    deductions: structure.deductions,
                    netSalary: structure.netSalary,
                    status: 'Paid',
                    generatedBy: req.user._id
                });
                generated++;
            }
        }
        res.status(201).json({ message: `Successfully generated ${generated} payslips for ${month} ${year}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyPayslips,
    getAllPayslips,
    generateBatchPayroll
};
