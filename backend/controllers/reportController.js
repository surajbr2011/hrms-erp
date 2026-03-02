const Attendance = require('../models/Attendance');
const Payslip = require('../models/Payslip');
const { generateAttendanceReport, generatePayrollReport } = require('../utils/pdfGenerator');

// @desc    Generate Attendance PDF Report
// @route   GET /api/reports/attendance/pdf
// @access  Private/Admin
const getAttendanceReportPDF = async (req, res) => {
    try {
        const data = await Attendance.find()
            .populate('user', 'name')
            .sort({ date: -1 });

        generateAttendanceReport(data, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Payroll PDF Report
// @route   GET /api/reports/payroll/pdf
// @access  Private/Admin
const getPayrollReportPDF = async (req, res) => {
    try {
        const data = await Payslip.find()
            .populate('user', 'name')
            .sort({ year: -1, month: -1 });

        generatePayrollReport(data, res);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAttendanceReportPDF,
    getPayrollReportPDF
};
