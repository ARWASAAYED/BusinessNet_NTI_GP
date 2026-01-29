const CommunityMessage = require("../models/CommunityMessage");
const CommunityMember = require("../models/communityMember");
const aiService = require("../services/aiService");

exports.getCommunityMessages = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify membership
    const isMember = await CommunityMember.findOne({
      communityId,
      userId: req.user._id,
    });
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Only members can view messages" });
    }

    const messages = await CommunityMessage.find({ communityId })
      .populate("senderId", "username fullName avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        hasMore: messages.length === limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.sendCommunityMessage = async (req, res, next) => {
  try {
    const { communityId, content, isAnnouncement } = req.body;

    // Verify membership
    const membership = await CommunityMember.findOne({
      communityId,
      userId: req.user._id,
    });
    if (!membership) {
      return res
        .status(403)
        .json({ message: "Only members can send messages" });
    }

    // If announcement, verify admin role
    if (isAnnouncement && membership.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can make announcements" });
    }

    const media = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        media.push({
          type: file.mimetype.startsWith("video/") ? "video" : "image",
          url: `/uploads/${file.filename}`,
        });
      });
    }

    const message = await CommunityMessage.create({
      communityId,
      senderId: req.user._id,
      content,
      media,
      isAnnouncement: isAnnouncement || false,
    });

    // Run AI analysis on community message
    try {
      const analysis = await aiService.analyzeContent(content || "");
      await CommunityMessage.findByIdAndUpdate(message._id, {
        aiAnalysis: analysis,
      });
    } catch (aiErr) {
      console.error("AI analysis failed for community message:", aiErr.message);
    }

    const populatedMessage = await CommunityMessage.findById(
      message._id
    ).populate("senderId", "username fullName avatarUrl");

    // Socket emission
    const io = req.app.get("io");
    if (io) {
      io.to(`community_${communityId}`).emit(
        "community_message",
        populatedMessage
      );
    }

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// Summarize recent community messages using AI
exports.summarizeCommunity = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    // Verify membership
    const isMember = await CommunityMember.findOne({
      communityId,
      userId: req.user._id,
    });
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Only members can request summaries" });
    }

    const messages = await CommunityMessage.find({ communityId })
      .sort({ createdAt: -1 })
      .limit(limit);

    const result = await aiService.summarizeMessages(
      messages.map((m) => ({ content: m.content }))
    );

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.deleteCommunityMessage = async (req, res, next) => {
  try {
    const { communityId, messageId } = req.params;
    const userId = req.user._id;

    const message = await CommunityMessage.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Verify permission: sender OR community moderator/admin
    const membership = await CommunityMember.findOne({ communityId, userId });
    
    const isSender = message.senderId.toString() === userId.toString();
    const isModerator = membership && (membership.role === 'admin' || membership.role === 'moderator');

    if (!isSender && !isModerator) {
      return res.status(403).json({ message: "Unauthorized to delete this message" });
    }

    await CommunityMessage.findByIdAndDelete(messageId);

    // Socket emission for deletion
    const io = req.app.get("io");
    if (io) {
      io.to(`community_${communityId}`).emit("community_message_deleted", messageId);
    }

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};
