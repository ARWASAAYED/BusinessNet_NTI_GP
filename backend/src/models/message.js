const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    fileUrl: String,
    fileName: String,
    fileType: String,
    read: { type: Boolean, default: false },
    aiAnalysis: {
      sentimentScore: Number,
      professionalismScore: Number,
      authenticityScore: Number,
      relevanceScore: Number,
      aiKeywords: [String],
      detectedIndustry: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Message || mongoose.model("Message", messageSchema);
