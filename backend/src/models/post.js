const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },

    content: { type: String, default: "" },
    media: [
      {
        type: { type: String, enum: ["image", "video"], required: true },
        url: { type: String, required: true },
      },
    ],
    // Keep mediaUrl for backward compatibility if needed, but we'll use media array
    mediaUrl: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    hashtags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hashtag" }],
    tag: { type: String },

    // Engagement
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    upvotesCount: { type: Number, default: 0 }, // Added for sorting
    commentsCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 }, // Share count for social sharing

    // Impressions & shares
    impressions: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    externalClicks: { type: Number, default: 0 }, // link shares

    // AI and Content Scores
    sentimentScore: { type: Number, default: 0 }, // -1 to 1
    professionalismScore: { type: Number, default: 0 }, // 0 to 100
    authenticityScore: { type: Number, default: 1 }, // 0 to 1
    relevanceScore: { type: Number, default: 0 }, // 0 to 100
    trendScore: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },
    promotedUntil: { type: Date },
    aiKeywords: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
