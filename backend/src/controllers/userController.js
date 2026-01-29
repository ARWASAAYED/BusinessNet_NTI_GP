const User = require("../models/user");
const Post = require("../models/post");
const Badge = require("../models/badge");
const mongoose = require("mongoose");

/**
 * Formats a post for the frontend by mapping IDs to descriptive keys.
 */
const formatPost = (post) => {
  const p = post.toObject ? post.toObject() : post;
  const author = p.authorId;
  const business = p.businessId;

  delete p.authorId;
  delete p.businessId;

  return {
    ...p,
    author: author
      ? {
          _id: author._id,
          username: author.username,
          fullName: author.fullName,
          avatar: author.avatarUrl,
          accountType: author.accountType,
        }
      : null,
    business: business
      ? {
          _id: business._id,
          name: business.name,
          logo: business.avatarUrl,
        }
      : null,
  };
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("badges");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Self-healing: if it's a business user but businessId is missing, find and link it
    if (user.role === 'business' && !user.businessId) {
      const Business = require("../models/business");
      const business = await Business.findOne({ userId: user._id });
      if (business) {
        user.businessId = business._id;
        await user.save();
      }
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const query = q
      ? {
          $or: [
            { fullName: { $regex: q, $options: "i" } },
            { username: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query).select("-password").limit(20);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID format" });
    }

    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("badges");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this profile" });
    }

    const updates = req.body;

    delete updates.role;
    delete updates.password;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("badges");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update the authenticated user's own profile (supports single avatar upload).
exports.updateMyProfile = async (req, res, next) => {
  try {
    // If an avatar file was uploaded via middleware, map it into the request body
    if (req.file) {
      req.body.avatar = `/uploads/${req.file.filename}`;
    }

    // Set params.id so we can reuse updateUserProfile logic and authorization checks
    req.params.id = req.user._id.toString();
    return exports.updateUserProfile(req, res, next);
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);
    if (!user || !user.password) {
      return res
        .status(400)
        .json({ message: "Cannot change password for guest" });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getUserFeed = async (req, res, next) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Simple Discovery Algorithm: Trending + Interests + Following
    const following = user.following || [];

    const feed = await Post.find({
      $or: [
        { authorId: { $in: following } },
        { businessId: { $in: following } },
        { aiKeywords: { $in: user.interests || [] } },
        { sentimentScore: { $gt: 0.5 } }, // Recommended positive content
      ],
    })
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      $or: [
        { authorId: { $in: following } },
        { businessId: { $in: following } },
        { aiKeywords: { $in: user.interests || [] } },
      ],
    });

    res.json({
      success: true,
      data: {
        posts: feed.map(formatPost),
        hasMore: skip + feed.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID format" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ authorId: userId })
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ authorId: userId });

    res.json({
      success: true,
      data: {
        posts: posts.map(formatPost),
        hasMore: skip + posts.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Assign a badge to a user
exports.assignBadgeToUser = async (req, res, next) => {
  try {
    const { badgeId } = req.body;
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID format" });
    }
    if (!badgeId || !mongoose.Types.ObjectId.isValid(badgeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing badgeId" });
    }

    const user = await User.findById(userId);
    const badge = await Badge.findById(badgeId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }

    if (!user.badges) user.badges = [];
    if (user.badges.includes(badgeId)) {
      return res.status(400).json({ message: "User already has this badge" });
    }

    user.badges.push(badgeId);
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    // Create notification
    const Notification = require("../models/notification");
    const notification = await Notification.create({
      userId: userToFollow._id,
      sender: currentUser.id || currentUser._id,
      type: "follow",
      title: "New Follower",
      message: `${
        currentUser.fullName || currentUser.username
      } started following you`,
      link: `/profile/${currentUser.id || currentUser._id}`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(userToFollow._id.toString()).emit("notification", notification);
    }

    // Check and award follower badges for the user being followed
    const badgeService = require("../services/badgeService");
    await badgeService.checkAndAwardBadges(userToFollow._id, io);

    res.json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get user's earned badges
exports.getUserBadges = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid User ID format" 
      });
    }

    const user = await User.findById(userId).populate('badges');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format badges with earned timestamp
    const userBadges = (user.badges || []).map(badge => ({
      ...badge.toObject(),
      earnedAt: badge.createdAt || new Date(), // Use badge creation as fallback
    }));

    res.json({
      success: true,
      data: userBadges,
    });
  } catch (error) {
    next(error);
  }
};
