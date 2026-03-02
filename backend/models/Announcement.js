const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // Null means all
    targetRole: { type: String, enum: ['Employee', 'Manager', 'Admin'] }, // Null means all roles
    attachments: [{ type: String }],
    type: { type: String, enum: ['Event', 'Alert', 'Info'], default: 'Info' },
    scheduledDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
