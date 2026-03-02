const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Employee', 'Manager', 'Admin'], default: 'Employee' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    designation: { type: mongoose.Schema.Types.ObjectId, ref: 'Designation' },
    reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    joinDate: { type: Date, default: Date.now },
    profilePicture: { type: String, default: '' },
    phone: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    userId: { type: String, unique: true },
    salaryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'PayrollStructure' },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
