const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['Public', 'Optional', 'Regional'], default: 'Public' },
    description: { type: String },
    departmentObj: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' } // Null means all
}, { timestamps: true });

module.exports = mongoose.model('Holiday', holidaySchema);
