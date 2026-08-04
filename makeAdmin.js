const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config({ path: './server/.env' });

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the most recently created user
        const user = await User.findOne().sort({ createdAt: -1 });

        if (!user) {
            console.log('No users found in the database. Please register an account on the website first!');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`=========================================`);
        console.log(`SUCCESS! The account [${user.email}] is now an ADMIN!`);
        console.log(`=========================================`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
