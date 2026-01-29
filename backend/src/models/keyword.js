const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  category: String,
  frequency: { type: Number, default: 0 },
  growthRate: { type: Number, default: 0 },
  velocity: { type: Number, default: 0 },
  avgSentiment: { type: Number, default: 0 },
  hypeProbability: { type: Number, default: 0 },
  spamScore: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});


module.exports = mongoose.models.Keyword || mongoose.model("Keyword", keywordSchema);
