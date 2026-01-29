const mongoose = require("mongoose");

const trendSchema = new mongoose.Schema({
  keywordId: { type: mongoose.Schema.Types.ObjectId, ref: "Keyword", required: true },
  score: Number,
  velocity: Number,
  sentiment: Number,
  hypeRisk: Number,
  sourceType: { type: String, enum: ["organic","promoted","bot"], default: "organic" },
  promotedTrendId: { type: mongoose.Schema.Types.ObjectId, ref: "PromotedTrend" },
  status: { type: String, enum: ["rising","hot","falling"], default: "rising" },
  detectedAt: { type: Date, default: Date.now },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" } // Top post or typical post associated with this trend
});

module.exports = mongoose.models.Trend || mongoose.model("Trend", trendSchema);
