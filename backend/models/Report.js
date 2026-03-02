const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Attendance', 'Payroll', 'Leaves', 'Performance'], required: true },
    generateDate: { type: Date, default: Date.now },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parameters: { type: Object }, // To store filters used like date range, department
    fileUrl: { type: String, required: true }, // Link to PDF or Excel
    status: { type: String, enum: ['Completed', 'Failed', 'Processing'], default: 'Completed' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
