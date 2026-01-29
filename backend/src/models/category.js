const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }, // for subcategories
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Category || mongoose.model("Category", categorySchema);
