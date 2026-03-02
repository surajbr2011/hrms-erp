const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName: { type: String, required: true },
    date: { type: Date, required: true },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date, required: true },
    totalHours: { type: Number, required: true },
    title: { type: String },
    description: { type: String, required: true },
    workSummary: { type: String },
    attachmentFiles: [{ type: String }],
    status: { type: String, enum: ['Submitted', 'Reviewed'], default: 'Submitted' },
    adminComment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('DailyReport', dailyReportSchema);
