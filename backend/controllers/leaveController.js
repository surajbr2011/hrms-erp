const Leave = require('../models/Leave');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all leaves (Employee sees own, Manager sees department/own, Admin sees all)
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
    try {
        let leaves;
        // Basic logic for now - admin sees all
        if (req.user.role === 'Admin' || req.user.role === 'Manager') {
            leaves = await Leave.find().populate('user', 'name department profilePicture').sort('-createdAt');
        } else {
            leaves = await Leave.find({ user: req.user._id }).sort('-createdAt');
        }

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
const applyLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    try {
        const leave = new Leave({
            user: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason
        });

        const createdLeave = await leave.save();

        // Notify all Admins & Managers about the new leave request
        const managers = await User.find({ role: { $in: ['Admin', 'Manager'] } }).select('_id');
        const notifPromises = managers.map(m =>
            Notification.create({
                title: 'New Leave Request',
                message: `${req.user.name} has applied for ${leaveType} leave from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}.`,
                type: 'Leave',
                recipient: m._id,
                link: '/leaves'
            })
        );
        await Promise.all(notifPromises);

        res.status(201).json(createdLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private (Admin/Manager)
const updateLeaveStatus = async (req, res) => {
    const { status, comment } = req.body;

    try {
        const leave = await Leave.findById(req.params.id);

        if (leave) {
            leave.status = status || leave.status;
            leave.managerDetails = {
                managerId: req.user._id,
                comment: comment || '',
                date: new Date()
            };

            const updatedLeave = await leave.save();

            // Notify the employee whose leave was actioned
            await Notification.create({
                title: `Leave Request ${status}`,
                message: `Your ${updatedLeave.leaveType} leave request has been ${status.toLowerCase()}.${
                    comment ? ` Comment: ${comment}` : ''
                }`,
                type: 'Leave',
                recipient: updatedLeave.user,
                link: '/leaves'
            });

            res.json(updatedLeave);
        } else {
            res.status(404).json({ message: 'Leave request not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getLeaves,
    applyLeave,
    updateLeaveStatus
};
