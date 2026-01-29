const mongoose = require("mongoose");

const duelSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String },
  challenger: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  challenged: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  challengerSubmission: {
    content: String,
    media: [{ type: String }],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  challengedSubmission: {
    content: String,
    media: [{ type: String }],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  category: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "active", "completed"], 
    default: "pending" 
  },
  expiresAt: { type: Date, required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.models.Duel || mongoose.model("Duel", duelSchema);
