const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  budget: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  duration: { type: Number, required: true }, // in days
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  targetRegion: { type: String, default: "global" },
  targetCategory: { type: String }, // Changed from ObjectId to String for category names
  status: { 
    type: String, 
    enum: ['active', 'paused', 'completed'], 
    default: 'active' 
  },
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);
