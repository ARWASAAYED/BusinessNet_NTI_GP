const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  referenceId: mongoose.Schema.Types.ObjectId,
  isRead: { type: Boolean, default: false },
}, { timestamps: { createdAt: "createdAt" } });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
