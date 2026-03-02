const mongoose = require('mongoose');

const leavePolicySchema = new mongoose.Schema({
    type: { type: String, required: true },
    isGenderRestricted: { type: Boolean, default: false },
    allowedGender: { type: String, enum: ['Male', 'Female', 'Other', 'All'], default: 'All' },
    yearlyLimit: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('LeavePolicy', leavePolicySchema);
