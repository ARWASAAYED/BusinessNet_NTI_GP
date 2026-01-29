const mongoose = require("mongoose");

const userBadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Badge", required: true },
  earnedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.UserBadge || mongoose.model("UserBadge", userBadgeSchema);
