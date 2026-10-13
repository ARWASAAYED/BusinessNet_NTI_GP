const mongoose = require("mongoose");
const dns = require("node:dns");

// Fix SRV DNS resolution on local Windows ISPs (do NOT run on Vercel/cloud)
if (process.platform === "win32" && !process.env.VERCEL && !process.env.VERCEL_ENV) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {
    // ignore
  }
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/social_network";

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    console.log(
      `Connecting to MongoDB at: ${MONGODB_URI.replace(/:[^:@]*@/, ":****@")} ...`,
    );
  } catch (e) {}

  cachedPromise = mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 0,
    })
    .then((m) => {
      console.log("✅ MongoDB connected successfully");
      return m;
    })
    .catch((err) => {
      cachedPromise = null;
      console.error(`❌ MongoDB connection failed: ${err.message}`);
      console.error(
        "💡 Ensure your IP is whitelisted in MongoDB Atlas -> Network Access (0.0.0.0/0 for Vercel).",
      );
      throw err;
    });

  return cachedPromise;
};

module.exports = connectDB;
