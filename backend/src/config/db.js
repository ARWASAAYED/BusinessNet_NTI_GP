const mongoose = require("mongoose");
const db = process.env.MONGODB_URI;
// const db = process.env.MONGO_URI_online_atlas;
const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log("MongoDB connected");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
module.exports = connectDB;
