const CommunityMessage = require("../models/CommunityMessage");
const CommunityMember = require("../models/communityMember");
const Community = require("../models/community");

exports.getCommunityMessages = async (req, res, next) => {
  try {
    const communityId = req.params.communityId || req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Verify membership
    let isMember = await CommunityMember.findOne({
      communityId,
      userId: req.user._id,
    });

    if (!isMember) {
      // Check if user is banned
      if (community.bannedUsers && community.bannedUsers.some(b => b.toString() === req.user._id.toString())) {
        return res.status(403).json({ message: "You are banned from this community" });
      }

      // Auto-join creator, moderator or member
      const isCreator = community.creatorId && community.creatorId.toString() === req.user._id.toString();
      const isMod = community.moderators && community.moderators.some(m => m.toString() === req.user._id.toString());
      isMember = await CommunityMember.create({
        communityId,
        userId: req.user._id,
        role: isCreator ? "admin" : isMod ? "moderator" : "member",
      });
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
    // communityId comes from URL params (always reliable), fall back to body
    const communityId = req.params.communityId || req.body.communityId;
    const content = req.body.content || "";
    const wantsAnnouncement = req.body.isAnnouncement === 'true' || req.body.isAnnouncement === true;

    if (!communityId) {
      return res.status(400).json({ message: "Community ID is required" });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is banned
    if (community.bannedUsers && community.bannedUsers.some(b => b.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: "You are banned from this community" });
    }

    // Verify or establish membership
    let membership = await CommunityMember.findOne({
      communityId,
      userId: req.user._id,
    });

    const isCreator = community.creatorId && community.creatorId.toString() === req.user._id.toString();
    const isMod = community.moderators && community.moderators.some(m => m.toString() === req.user._id.toString());

    if (!membership) {
      membership = await CommunityMember.create({
        communityId,
        userId: req.user._id,
        role: isCreator ? "admin" : isMod ? "moderator" : "member",
      });
    }

    // Safe announcement check: only grant announcement if admin/moderator/creator
    const canAnnounce = membership.role === "admin" || membership.role === "moderator" || isCreator || isMod;
    const isAnnouncement = Boolean(wantsAnnouncement && canAnnounce);

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
