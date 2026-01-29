const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema({
  targetType: { type: String, enum: ["post","comment","user","business"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  model: { type: String, default: "gpt-4.1-mini" },
  modelVersion: { type: String, default: "2025-01" },
  sentiment: Number,
  keywords: [String],
  authenticity: { type: Number, default: 1 },
  hypeScore: { type: Number, default: 0 },
  aiProbability: { type: Number, default: 0 },
  confidence: { type: Number, default: 0.8 },

  processedAt: { type: Date, default: Date.now },
});


module.exports = mongoose.models.AIAnalysis || mongoose.model("AIAnalysis", aiAnalysisSchema);
