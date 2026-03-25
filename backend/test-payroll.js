require('dotenv').config();
const mongoose = require('mongoose');
const PayrollStructure = require('./models/PayrollStructure');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    try {
        await PayrollStructure.create({
            employeeId: new mongoose.Types.ObjectId(),
            basicSalary: 60000,
            hraPercentage: 40,
            allowances: [
                { name: 'Special Allowance', amount: 5000 },
                { name: 'Bonus', amount: 10000 }
            ],
            deductions: [
                { name: 'PF', amount: 2400 },
                { name: 'Professional Tax', amount: 200 }
            ]
        });
        console.log("Success");
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
test();
