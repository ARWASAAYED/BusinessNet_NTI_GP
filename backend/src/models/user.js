const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["guest","user","creator","business","admin"], default: "guest" },
  accountType: { type: String, enum: ["personal", "business"], default: "personal" },
  avatarUrl: String,
  bio: String,
  location: String,
  website: String,
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  interests: [String],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  reputationScore: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  aiTrustScore: { type: Number, default: 1 },
  botProbability: { type: Number, default: 0 },
}, { timestamps: { createdAt: "createdAt" } });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await require('bcryptjs').compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
