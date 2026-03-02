const mongoose = require('mongoose');

const breakLogSchema = new mongoose.Schema({
    attendance: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendance', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['Meal', 'Tea1', 'Tea2', 'Other'], required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number, default: 0 }, // Duration in minutes
}, { timestamps: true });

module.exports = mongoose.model('BreakLog', breakLogSchema);
