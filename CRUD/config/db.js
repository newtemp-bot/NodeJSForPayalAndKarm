const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.error(`Could not connect to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
