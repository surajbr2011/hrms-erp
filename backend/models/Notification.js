const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['Leave', 'Task', 'Attendance', 'System', 'Announcement'], default: 'System' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null means global
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // Null means all
    isRead: { type: Boolean, default: false },
    link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
