const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  avatarUrl: String,
  coverImage: String,
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPrivate: { type: Boolean, default: false },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bannedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.models.Community || mongoose.model('Community', communitySchema);
