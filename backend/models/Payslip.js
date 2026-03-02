const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    baseSalary: { type: Number, required: true },
    allowances: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true }
        }
    ],
    deductions: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true }
        }
    ],
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
    pdfUrl: { type: String }, // Optional stored URL for S3/Blob
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Ensure one payslip per month per user
payslipSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payslip', payslipSchema);
