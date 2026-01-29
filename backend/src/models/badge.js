const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  ruleKey: String,
  rarity: { type: String, enum: ["common","rare","epic","legendary"], default: "common" },
}, { timestamps: { createdAt: "createdAt" } });

module.exports = mongoose.models.Badge || mongoose.model("Badge", badgeSchema);
