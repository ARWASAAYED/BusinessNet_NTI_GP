const mongoose = require("mongoose");
const dns = require("node:dns");

// Fix SRV DNS resolution on Windows / local ISPs
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    // ignore
}

const primaryDbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/mada";
const localFallbackUri = "mongodb://localhost:27017/mada";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        console.log(`Connecting to MongoDB at: ${primaryDbUri.replace(/:[^:@]*@/, ":****@")} ...`);
        await mongoose.connect(primaryDbUri, { serverSelectionTimeoutMS: 5000 });
        console.log("✅ MongoDB connected successfully to primary URI");
    } catch (err) {
        console.warn(`⚠️ Primary MongoDB connection failed (${err.message}).`);

        // If primary was Atlas or remote and failed, try local fallback in development
        if (primaryDbUri !== localFallbackUri) {
            console.log("Attempting fallback to local MongoDB (mongodb://localhost:27017/mada)...");
            try {
                await mongoose.connect(localFallbackUri, { serverSelectionTimeoutMS: 3000 });
                console.log("✅ Connected successfully to local fallback MongoDB!");
                console.log("💡 NOTE: If you want MongoDB Atlas to work, make sure your IP is whitelisted (0.0.0.0/0) in MongoDB Atlas -> Network Access.");
                return;
            } catch (fallbackErr) {
                console.error("❌ Local fallback MongoDB also failed:", fallbackErr.message);
            }
        }

        console.error("❌ MongoDB connection failed. Please ensure MongoDB is running or check your connection string/IP whitelist.");
    }
};

module.exports = connectDB;

