const Attendance = require('../models/Attendance');
const BreakLog = require('../models/BreakLog');

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
    try {
        let attendance;

        // Admin/Manager views all logs, Employee views own
        if (req.user.role === 'Admin' || req.user.role === 'Manager') {
            attendance = await Attendance.find().populate('user', 'name email department').sort('-date');
        } else {
            attendance = await Attendance.find({ user: req.user._id }).sort('-date');
        }

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check In
// @route   POST /api/attendance/check-in
// @access  Private
const checkIn = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingRecord = await Attendance.findOne({
            user: req.user._id,
            date: { $gte: today }
        });

        if (existingRecord) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const attendance = await Attendance.create({
            user: req.user._id,
            date: new Date(),
            checkIn: new Date(),
            status: 'Present' // Status handled via logic later (e.g., late condition)
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check Out
// @route   PUT /api/attendance/check-out
// @access  Private
const checkOut = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await Attendance.findOne({
            user: req.user._id,
            date: { $gte: today }
        });

        if (!record || record.checkOut) {
            return res.status(400).json({ message: 'No active check-in found for today' });
        }

        record.checkOut = new Date();
        const durationMs = record.checkOut - record.checkIn;
        record.totalHours = durationMs / (1000 * 60 * 60);
        record.reportText = req.body.reportText || '';

        const updatedRecord = await record.save();
        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Start Break
// @route   POST /api/attendance/break-start
// @access  Private
const startBreak = async (req, res) => {
    const { type } = req.body; // 'Meal', 'Tea1', 'Tea2', 'Other'

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await Attendance.findOne({
            user: req.user._id,
            date: { $gte: today }
        });

        if (!record) return res.status(400).json({ message: 'Cannot start break without checking in' });

        // Ensure no overlapping active breaks
        const activeBreak = await BreakLog.findOne({ attendance: record._id, endTime: null });
        if (activeBreak) return res.status(400).json({ message: 'Finish current break first' });

        const newBreak = await BreakLog.create({
            attendance: record._id,
            user: req.user._id,
            date: new Date(),
            type: type || 'Other',
            startTime: new Date()
        });

        res.status(201).json(newBreak);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    End Break
// @route   PUT /api/attendance/break-end
// @access  Private
const endBreak = async (req, res) => {
    try {
        const activeBreak = await BreakLog.findOne({ user: req.user._id, endTime: null });

        if (!activeBreak) return res.status(400).json({ message: 'No active break found' });

        activeBreak.endTime = new Date();
        const durationMs = activeBreak.endTime - activeBreak.startTime;
        activeBreak.duration = Math.floor(durationMs / 60000); // minutes

        await activeBreak.save();

        // Push break summary to Attendance Record
        const record = await Attendance.findById(activeBreak.attendance);
        record.breaks.push({
            type: activeBreak.type,
            startTime: activeBreak.startTime,
            endTime: activeBreak.endTime,
            duration: activeBreak.duration
        });
        await record.save();

        res.json(activeBreak);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAttendance, checkIn, checkOut, startBreak, endBreak };
