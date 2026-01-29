const mongoose = require("mongoose");

const communityMessageSchema = new mongoose.Schema(
  {
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    media: [
      {
        type: { type: String, enum: ["image", "video"], default: "image" },
        url: String,
      },
    ],
    isAnnouncement: { type: Boolean, default: false },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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

communityMessageSchema.index({ communityId: 1, createdAt: -1 });

module.exports = mongoose.models.CommunityMessage || mongoose.model("CommunityMessage", communityMessageSchema);
