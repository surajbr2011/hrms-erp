const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    companyName: { type: String, default: 'Trinix IT Solution Pvt.Ltd' },
    workingHours: {
        start: { type: String, default: '09:00' }, // HH:mm
        end: { type: String, default: '17:00' },   // HH:mm
        totalHours: { type: Number, default: 8 }
    },
    breakRules: {
        mealBreak: { type: Number, default: 30 }, // Minutes
        teaBreak1: { type: Number, default: 15 }, // Minutes
        teaBreak2: { type: Number, default: 15 }  // Minutes
    },
    leavePolicies: {
        annualLeave: { type: Number, default: 20 },
        sickLeave: { type: Number, default: 10 },
        casualLeave: { type: Number, default: 5 }
    },
    timezone: { type: String, default: 'UTC -08:00' },
    dateFormat: { type: String, default: 'MM/DD/YYYY' }
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
