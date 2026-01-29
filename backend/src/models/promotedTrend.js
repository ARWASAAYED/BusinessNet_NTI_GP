const mongoose = require("mongoose");

const promotedTrendSchema = new mongoose.Schema({
  trendId: { type: mongoose.Schema.Types.ObjectId, ref: "Trend", required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  targetRegion: { type: String, default: "global" },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
  adBoost: { type: Number, default: 1 },
  adPackage: { type: String, enum: ["starter", "boost", "viral"], default: "starter" },
}, { timestamps: { createdAt: "createdAt" } });

module.exports = mongoose.models.PromotedTrend || mongoose.model("PromotedTrend", promotedTrendSchema);
