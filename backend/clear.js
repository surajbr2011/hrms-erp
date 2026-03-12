const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const clearData = async () => {
    await connectDB();

    // Import all models dynamically to delete data
    const modelsPath = path.join(__dirname, 'models');
    const modelFiles = fs.readdirSync(modelsPath);

    for (const file of modelFiles) {
        if (file.endsWith('.js')) {
            const Model = require(path.join(modelsPath, file));

            // If it's the User model, keep Admin, perhaps?
            if (Model.modelName === 'User') {
                const deleted = await Model.deleteMany({ role: { $ne: 'Admin' } });
                console.log(`Cleared ${deleted.deletedCount} non-Admin users from User collection.`);
            } else if (['SystemSettings'].includes(Model.modelName)) {
                console.log(`Skipping ${Model.modelName}`);
            } else {
                try {
                    const deleted = await Model.deleteMany();
                    console.log(`Cleared ${deleted.deletedCount} documents from ${Model.modelName}`);
                } catch (e) {
                    console.log(`Could not clear ${Model.modelName}: ${e.message}`);
                }
            }
        }
    }

    console.log('Data cleared successfully.');
    process.exit();
};

clearData();
