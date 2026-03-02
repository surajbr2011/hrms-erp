const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half Day', 'Pending'], default: 'Pending' },
    totalHours: { type: Number, default: 0 },
    breaks: [
        {
            type: { type: String, enum: ['Meal', 'Tea1', 'Tea2', 'Other'] },
            startTime: Date,
            endTime: Date,
            duration: Number, // in minutes
        }
    ],
    reportText: { type: String },
    reportFile: { type: String } // URL to file
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
