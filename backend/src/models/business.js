const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  avatarUrl: String,
  coverUrl: String,
  type: {
    type: String,
    enum: ["individual", "company"],
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },

  companySize: {
    type: String,
    enum: ["startup", "shop", "small", "medium", "enterprise"],
    default: "startup",
  },

  website: String,

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  hashtags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hashtag",
    },
  ],

  category: {
    type: String,
    default: "Services",
  },

  verified: {
    type: Boolean,
    default: false,
  },

  reputationScore: {
    type: Number,
    default: 50, // Start at 50, scale 0-100
  },

  metrics: {
    trustScore: { type: Number, default: 50 },
    innovationScore: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    aiAuditScore: { type: Number, default: 0 },
  },

  reputationHistory: [
    {
      score: Number,
      reason: String,
      date: { type: Date, default: Date.now },
    },
  ],

  offerings: [
    {
      name: { type: String, required: true },
      description: String,
      price: Number,
      category: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Business || mongoose.model("Business", businessSchema);
