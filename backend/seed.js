/**
 * Admin Seeder Script
 * Usage: node seed.js
 * Purpose: Creates the first Admin user if none exists.
 * Run once after first deployment.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'Employee' },
    userId: { type: String, unique: true },
    status: { type: String, default: 'Active' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const ADMIN = {
    name: process.env.ADMIN_NAME || 'Super Admin',
    email: process.env.ADMIN_EMAIL || 'admin@hrms.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123!',
    role: 'Admin',
    userId: 'ADM001',
    status: 'Active',
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const exists = await User.findOne({ email: ADMIN.email });
        if (exists) {
            console.log(`Admin already exists: ${ADMIN.email}`);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN.password, salt);

        await User.create({ ...ADMIN, password: hashedPassword });

        console.log('✅ Admin user created successfully');
        console.log(`   Email:    ${ADMIN.email}`);
        console.log(`   Password: ${ADMIN.password}`);
        console.log('   ⚠️  Please change the password after first login!');
        process.exit(0);
    } catch (error) {
        console.error('Seeder error:', error.message);
        process.exit(1);
    }
};

seed();
