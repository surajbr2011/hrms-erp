const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    leaveType: { type: String, required: true, enum: ['Sick', 'Casual', 'Annual', 'Unpaid', 'Earned Leave', 'Period Leave', 'Sick Leave', 'Casual Leave'] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    managerDetails: {
        managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        date: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Leave', leaveSchema);
