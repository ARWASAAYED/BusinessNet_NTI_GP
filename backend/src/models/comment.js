const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
//   authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   content: { type: String, required: true },
//   sentimentScore: { type: Number, default: 0 },
//   authenticityScore: { type: Number, default: 1 },
// }, { timestamps: { createdAt: "createdAt" } });

// module.exports = mongoose.model("Comment", commentSchema);

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
