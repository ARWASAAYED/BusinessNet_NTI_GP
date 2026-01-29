const Comment = require("../models/comment");
const Post = require("../models/post");
const Notification = require("../models/notification");
const badgeService = require("../services/badgeService");

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId || req.body.postId;

    if (!postId) {
      return res
        .status(400)
        .json({ success: false, message: "Post ID is required" });
    }

    const parentId = req.body.parentId || null;

    // If parentId provided, ensure parent exists and belongs to same post
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment)
        return res
          .status(404)
          .json({ success: false, message: "Parent comment not found" });
      if (parentComment.post.toString() !== postId.toString())
        return res
          .status(400)
          .json({
            success: false,
            message: "Parent comment does not belong to this post",
          });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id || req.user.id,
      parent: parentId,
    });

    // Increment comment count on post
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    // Create notification for post author
    const post = await Post.findById(postId);

    if (
      post &&
      post.authorId &&
      post.authorId.toString() !== (req.user._id || req.user.id).toString()
    ) {
      const notification = await Notification.create({
        userId: post.authorId,
        sender: req.user._id || req.user.id,
        type: "comment",
        title: "New Comment",
        message: `${req.user.fullName || "Someone"} commented on your post`,
        link: `/feed?post=${postId}`,
        referenceId: postId,
      });

      const io = req.app.get("io");
      if (io) {
        io.to(post.authorId.toString()).emit("notification", notification);
      }
    }

    // Populate for frontend
    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "username fullName avatarUrl"
    );

    // Check and award badges
    const io = req.app.get("io");
    await badgeService.checkAndAwardBadges(req.user._id || req.user.id, io);

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.author.toString() !== (req.user._id || req.user.id).toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.author.toString() !== (req.user._id || req.user.id).toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
    await comment.deleteOne();

    res.json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.listCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    })
      .populate("author", "username fullName avatarUrl")
      .sort({ createdAt: -1 });

    // Map for frontend compatibility
    const formattedComments = comments.map((c) => {
      const obj = c.toObject();
      const author = obj.author;
      delete obj.author;
      return {
        ...obj,
        userId: author,
        postId: obj.post,
      };
    });

    res.json({
      success: true,
      count: comments.length,
      data: formattedComments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user._id || req.user.id;
    if (!comment.likes) comment.likes = [];
    if (comment.likes.map(String).includes(String(userId))) {
      return res.status(400).json({ message: "Already liked" });
    }

    comment.likes.push(userId);
    await comment.save();

    const populated = await Comment.findById(comment._id).populate(
      "author",
      "username fullName avatarUrl"
    );
    const obj = populated.toObject();
    const author = obj.author;
    delete obj.author;
    res.json({ success: true, data: { ...obj, userId: author } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a comment
exports.unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user._id || req.user.id;
    comment.likes = (comment.likes || []).filter(
      (id) => String(id) !== String(userId)
    );
    await comment.save();

    const populated = await Comment.findById(comment._id).populate(
      "author",
      "username fullName avatarUrl"
    );
    const obj = populated.toObject();
    const author = obj.author;
    delete obj.author;
    res.json({ success: true, data: { ...obj, userId: author } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get replies for a comment
exports.getReplies = async (req, res) => {
  try {
    const parentId = req.params.id;
    const replies = await Comment.find({ parent: parentId })
      .populate("author", "username fullName avatarUrl")
      .sort({ createdAt: 1 });

    const formatted = replies.map((r) => {
      const obj = r.toObject();
      const author = obj.author;
      delete obj.author;
      return { ...obj, userId: author };
    });

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
