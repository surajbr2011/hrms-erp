const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    isGroup: { type: Boolean, default: false },
    groupName: { type: String }, // General, Engineering, etc.
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // Null for direct or global
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
