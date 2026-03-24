const mongoose = require('mongoose');

const payrollStructureSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    basicSalary: { type: Number, required: true },
    hraPercentage: { type: Number, required: true, default: 0 },
    allowances: [
        {
            name: { type: String, required: true }, // e.g., 'Special Allowance', 'Bonus'
            amount: { type: Number, required: true }
        }
    ],
    deductions: [
        {
            name: { type: String, required: true }, // e.g., 'PF deduction', 'Professional Tax'
            amount: { type: Number, required: true }
        }
    ],
    netSalary: { type: Number },
}, { timestamps: true });

payrollStructureSchema.pre('save', function () {
    let hraAmount = (this.basicSalary * this.hraPercentage) / 100;
    let totalAllowances = this.allowances.reduce((acc, curr) => acc + curr.amount, 0) + hraAmount;
    let totalDeductions = this.deductions.reduce((acc, curr) => acc + curr.amount, 0);
    this.netSalary = this.basicSalary + totalAllowances - totalDeductions;
});

module.exports = mongoose.model('PayrollStructure', payrollStructureSchema);
