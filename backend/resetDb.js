/**
 * Factory Data Reset Script
 * Usage: node resetDb.js
 * Purpose: Wipes the entire database to prepare it for a fresh client installation 
 * and seeds the initial Super Admin account.
 * WARNING: THIS ERASES ALL DATA PERMANENTLY!
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

const resetDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is missing from .env');
            process.exit(1);
        }

        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected.');

        console.log('⚠️ ERASING ALL DATABASE COLLECTIONS...');
        await mongoose.connection.db.dropDatabase();
        console.log('✅ Entire database wiped clean.');

        console.log('Seeding initial admin account...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN.password, salt);

        await User.create({ ...ADMIN, password: hashedPassword });

        console.log('✅ Admin user created successfully.');
        console.log(`   Email:    ${ADMIN.email}`);
        console.log(`   Password: ${ADMIN.password}`);
        console.log('   ⚠️  Please share these credentials with the client.');
        
        console.log('Database is now fresh and ready for the client.');
        process.exit(0);
    } catch (error) {
        console.error('Database reset error:', error.message);
        process.exit(1);
    }
};

resetDatabase();
