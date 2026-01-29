const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  role: { type: String, enum: ["member","moderator","admin"], default: "member" },
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.CommunityMember || mongoose.model('CommunityMember', communityMemberSchema);
