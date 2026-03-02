const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    description: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Designation', designationSchema);
