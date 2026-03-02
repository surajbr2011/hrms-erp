const DailyReport = require('../models/DailyReport');

// @desc    Submit Daily Report
// @route   POST /api/daily-reports
// @access  Private
const submitReport = async (req, res) => {
    try {
        const { date, checkInTime, checkOutTime, totalHours, title, description, workSummary, attachmentFiles } = req.body;

        if (!description) {
            return res.status(400).json({ message: 'Description is mandatory' });
        }
        if (!attachmentFiles || attachmentFiles.length === 0) {
            return res.status(400).json({ message: 'At least one attachment required' });
        }

        const report = await DailyReport.create({
            employeeId: req.user._id,
            employeeName: req.user.name,
            date,
            checkInTime,
            checkOutTime,
            totalHours,
            title,
            description,
            workSummary,
            attachmentFiles
        });
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get all daily reports
// @route   GET /api/daily-reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        const filters = {};
        if (req.query.employeeId) filters.employeeId = req.query.employeeId;
        if (req.query.date) filters.date = req.query.date;
        if (req.query.department) {
            // Need to join user department if filtering by department
        }

        const reports = await DailyReport.find(filters).populate('employeeId', 'department').sort('-createdAt');
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update Daily Report (Review)
// @route   PUT /api/daily-reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
    try {
        const { status, adminComment } = req.body;
        const report = await DailyReport.findById(req.params.id);
        if (report) {
            report.status = status || report.status;
            if (adminComment !== undefined) report.adminComment = adminComment;
            await report.save();
            res.json(report);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { submitReport, getReports, updateReportStatus };
