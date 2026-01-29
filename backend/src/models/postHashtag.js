const mongoose = require('mongoose');

const postHashtagSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  keywordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Keyword', required: true }
});

module.exports = mongoose.models.PostHashtag || mongoose.model('PostHashtag', postHashtagSchema);
