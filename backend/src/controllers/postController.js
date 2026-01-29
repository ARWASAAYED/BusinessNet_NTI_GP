const Post = require("../models/post");
const Business = require("../models/business");
const mongoose = require("mongoose");
const aiService = require("../services/aiService");
const reputationService = require("../services/reputationService");
const badgeService = require("../services/badgeService");
const Category = require("../models/category");
const Hashtag = require("../models/hashtag");
const Keyword = require("../models/keyword");
const Trend = require("../models/trend");
// const PostHashtag = require("../models/postHashtag");
const Badge = require("../models/badge");

/**
 * Helper to ensure a string is a valid MongoDB ObjectId or return null.
 */
const cleanObjectId = (id) => {
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    return id;
  }
  return null;
};

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
    commentCount: p.commentsCount || 0, // Map commentsCount to commentCount for frontend
    shareCount: p.shareCount || 0,
    impressions: p.impressions || 0,
  };
};

/**
 * Extracts hashtags from content string and upserts them to DB as Hashtags AND Keywords
 * Returns array of Hashtag ObjectIds
 */
const extractAndUpsertHashtags = async (content, postId = null, aiAnalysis = {}) => {
  if (!content) return [];
  
  const regex = /#(\w+)/g;
  const matches = content.match(regex);
  
  if (!matches) return [];
  
  const tags = [...new Set(matches.map(tag => tag.substring(1).toLowerCase()))];
  const hashtagIds = [];

  for (const tagName of tags) {
    // 1. Handle Hashtag Model
    let hashtag = await Hashtag.findOne({ name: tagName });
    
    if (hashtag) {
      hashtag.count += 1;
      hashtag.lastUsedAt = Date.now();
      if (postId && !hashtag.posts.includes(postId)) {
        hashtag.posts.push(postId);
      }
      await hashtag.save();
    } else {
      hashtag = await Hashtag.create({
        name: tagName,
        count: 1,
        posts: postId ? [postId] : []
      });
    }
    hashtagIds.push(hashtag._id);

    // 2. Handle Keyword Model (Sync)
    let keywordId = null;
    try {
        let keyword = await Keyword.findOne({ word: tagName });
        if (keyword) {
            keyword.frequency += 1;
            keyword.lastUpdated = Date.now();
            // Update sentiment avg
            if (aiAnalysis.sentimentScore) {
                const oldTotal = keyword.avgSentiment * (keyword.frequency - 1);
                keyword.avgSentiment = (oldTotal + aiAnalysis.sentimentScore) / keyword.frequency;
            }
            await keyword.save();
            keywordId = keyword._id;
        } else {
            const newKey = await Keyword.create({
                word: tagName,
                frequency: 1,
                avgSentiment: aiAnalysis.sentimentScore || 0,
                lastUpdated: Date.now()
            });
            keywordId = newKey._id;
        }
    } catch (err) {
        console.error("Error syncing keyword:", err);
    }

    // 3. Handle Trend Model (Sync)
    if (keywordId) {
        try {
            let trend = await Trend.findOne({ keywordId });
            const sentiment = aiAnalysis.sentimentScore || 0;
            const professionalism = aiAnalysis.professionalismScore || 0;
            
            // Score Calculation: Frequency + Professionalism factor + Sentiment factor
            const scoreIncrement = 1 + (professionalism / 100) + Math.abs(sentiment);

            if (trend) {
                trend.score = (trend.score || 0) + scoreIncrement;
                trend.velocity = (trend.velocity || 0) + 1;
                trend.sentiment = sentiment; // Update to latest sentiment
                trend.status = trend.score > 50 ? 'hot' : 'rising';
                trend.postId = postId; // Update reference to latest post
                await trend.save();
            } else {
                await Trend.create({
                    keywordId,
                    score: scoreIncrement,
                    velocity: 1,
                    sentiment,
                    status: 'rising',
                    sourceType: 'organic',
                    postId: postId
                });
            }
        } catch (err) {
            console.error("Error syncing trend:", err);
        }
    }
  }
  
  return hashtagIds;
};

exports.createPost = async (req, res, next) => {
  try {
    const { categoryId, tag, businessId, communityId } = req.body;
    let { content } = req.body;
    
    // Ensure content is a string
    if (typeof content !== 'string') {
        content = content ? String(content) : "";
    }

    console.log('Create Post Request Body:', req.body);
    console.log('Create Post Files:', req.files);
    console.log('User:', req.user ? req.user._id : 'No User');

    if (!req.user) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const media = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        // Construct a path that works both locally and in production
        // Local path usually needs the host, but we can also store relative paths 
        // if the frontend handles the base URL. For now, let's keep the full URL logic 
        // but ensure it's clean.
        const host = req.get("host");
        const fullUrl = `${req.protocol}://${host}/uploads/${file.filename}`;
        
        media.push({
          type: file.mimetype.startsWith("video/") ? "video" : "image",
          url: fullUrl,
        });
      });
      console.log('Processed Media URLs:', media.map(m => m.url));
    }

    // Handle hashtags from body if passed explicitly (e.g. from frontend input)
    let explicitHashtags = [];
    if (req.body.hashtags) {
        try {
            explicitHashtags = typeof req.body.hashtags === 'string' ? JSON.parse(req.body.hashtags) : req.body.hashtags;
        } catch (e) {
            explicitHashtags = Array.isArray(req.body.hashtags) ? req.body.hashtags : [req.body.hashtags];
        }
    }

    // AI Analysis
    let aiAnalysis = {};
    try {
        console.log('Analyzing content for:', req.user._id);
        aiAnalysis = await aiService.analyzeContent(content);
        console.log('AI Analysis Result:', aiAnalysis);
    } catch (aiError) {
        console.error("AI Analysis failed:", aiError);
        aiAnalysis = {
            sentimentScore: 0,
            professionalismScore: 50,
            authenticityScore: 1,
            relevanceScore: 0,
            aiKeywords: [],
            detectedIndustry: "General"
        };
    }

    // Defensive ID checks to prevent CastError
    const targetBusinessId = cleanObjectId(businessId) || cleanObjectId(req.user.businessId);
    const targetCommunityId = cleanObjectId(communityId);
    let targetCategoryId = cleanObjectId(req.body.category) || cleanObjectId(categoryId);

    // Create post first to get ID for hashtag association
    // Only spread fields from aiAnalysis that exist in the Post schema
    const postData = {
      content,
      authorId: req.user._id,
      media,
      categoryId: targetCategoryId,
      tag: !targetCategoryId ? (req.body.category || tag || "General") : tag,
      businessId: targetBusinessId,
      communityId: targetCommunityId,
      sentimentScore: aiAnalysis.sentimentScore,
      professionalismScore: aiAnalysis.professionalismScore,
      authenticityScore: aiAnalysis.authenticityScore,
      relevanceScore: aiAnalysis.relevanceScore,
      aiKeywords: aiAnalysis.aiKeywords,
    };

    console.log('Final Post Data for Creation:', postData);

    const post = await Post.create(postData);

    // Extract and link hashtags (both from content and explicit)
    const extractedHashtags = await extractAndUpsertHashtags(content, post._id, aiAnalysis);
    
    // Process explicit hashtags if any
    let explicitHashtagIds = [];
    if (explicitHashtags.length > 0) {
        // reuse extractAndUpsertHashtags logic or similar, but for specific tags
        // For now, let's just append them to content for extraction or handle them similarly
        // Simpler: iterate and upsert
        for (const tag of explicitHashtags) {
             const cleanTag = tag.replace('#', '').toLowerCase();
             // Logic to find/create hashtag manually if not in content
             // ... We can probably just rely on extractAndUpsertHashtags if we append them to content? 
             // modifying content in DB might not be desired. 
             // Let's just run extraction on them as if they were content " #tag #tag"
             const ids = await extractAndUpsertHashtags(`#${cleanTag}`, post._id, {});
             explicitHashtagIds = [...explicitHashtagIds, ...ids];
        }
    }
    
    const allHashtagIds = [...new Set([...extractedHashtags, ...explicitHashtagIds])];

    if (allHashtagIds.length > 0) {
      post.hashtags = allHashtagIds;
      await post.save();
    }

    // Update Business Reputation if applicable
    if (targetBusinessId) {
      await reputationService.updateBusinessMetrics(targetBusinessId);
    }

    // Check for user badges
    const io = req.app.get("io");
    await badgeService.checkAndAwardBadges(req.user._id, io);

    const populatedPost = await Post.findById(post._id)
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl")
      .populate("hashtags", "name count");

    const formattedPost = formatPost(populatedPost);

    // Emit live post to feed
    if (io) {
      io.emit("post:new", formattedPost);
    }

    res.status(201).json({ success: true, data: formattedPost });
  } catch (error) {
    console.error("Create Post Error Details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      keyPattern: error.keyPattern, // For duplicate key errors
    });
    console.error("Stack:", error.stack);
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl")
      .populate("categoryId", "name")
      .sort({ isPromoted: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

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

exports.getPostById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Post ID format" });
    }

    const post = await Post.findById(req.params.id)
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl")
      .populate("hashtags", "name")
      .populate("categoryId", "name");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.uniqueViews += 1;
    post.impressions += 1;
    await post.save();

    res.json({
      success: true,
      data: formatPost(post),
    });
  } catch (error) {
    next(error);
  }
};

exports.upvotePost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { downvotes: userId },
        $addToSet: { upvotes: userId },
      },
      { new: true }
    )
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl");

    // Update reputation after voting
    if (updatedPost.businessId) {
      await reputationService.updateBusinessMetrics(updatedPost.businessId);
    }

    // Dynamic Trend Boosting: Votes increase trend score heavily
    if (updatedPost.hashtags && updatedPost.hashtags.length > 0) {
        (async () => {
            try {
                // Determine if we need to fetch hashtag names if not populated?
                // upvotePost populates authorId and businessId. Let's populate hashtags too or fetch them.
                // Re-fetching seems safer or we can add populate to the findByIdAndUpdate above. 
                // Actually the findByIdAndUpdate above only populates author/business.
                // We'll fetch the names.
                const fullPost = await Post.findById(updatedPost._id).populate('hashtags');
                for (const tag of fullPost.hashtags) {
                    const keyword = await Keyword.findOne({ word: tag.name });
                    if (keyword) {
                         // Vote = 2.0 points
                         await Trend.updateOne(
                             { keywordId: keyword._id }, 
                             { $inc: { score: 2.0, velocity: 5 } }
                         );
                    }
                }
            } catch (err) {
                console.error("Error boosting trend vote:", err);
            }
        })();
    }

    // Create notification for post author
    if (updatedPost.authorId && updatedPost.authorId._id.toString() !== userId.toString()) {
        try {
            const Notification = require("../models/Notification");
            const notification = await Notification.create({
                userId: updatedPost.authorId._id,
                sender: userId,
                type: "upvote",
                title: "New Upvote",
                message: `${req.user.fullName || "Someone"} upvoted your post`,
                link: `/feed?post=${updatedPost._id}`,
                referenceId: updatedPost._id,
            });

            const io = req.app.get("io");
            if (io) {
                io.to(updatedPost.authorId._id.toString()).emit("notification", notification);
            }
        } catch (notifier) {
            console.error("Failed to send upvote notification:", notifier);
        }
    }

    res.json({
      success: true,
      data: formatPost(updatedPost),
    });
  } catch (error) {
    next(error);
  }
};

exports.downvotePost = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { upvotes: userId },
        $addToSet: { downvotes: userId },
      },
      { new: true }
    )
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl");

    // Update reputation after voting
    if (updatedPost.businessId) {
      await reputationService.updateBusinessMetrics(updatedPost.businessId);
    }

    res.json({
      success: true,
      data: formatPost(updatedPost),
    });
  } catch (error) {
    next(error);
  }
};

exports.getPostsByBusiness = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find the owner of this business to also include posts created as a personal user if they are linked
    const business = await Business.findById(businessId);
    const ownerId = business?.userId;

    const query = {
      $or: [
        { businessId: businessId },
        { authorId: businessId }, // In case businessId is actually a userId in some legacy posts
        ...(ownerId ? [{ authorId: ownerId }] : [])
      ],
    };

    const posts = await Post.find(query)
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts: posts.map(formatPost),
        hasMore: skip + posts.length < total,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getPostsByCommunity = async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ communityId })
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ communityId });

    res.json({
      success: true,
      data: {
        posts: posts.map(formatPost),
        hasMore: skip + posts.length < total,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.votePost = async (req, res, next) => {
  try {
    const { type } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Helper to toggle vote
    const userIdStr = userId.toString();
    const upIndex = post.upvotes.map(id => id.toString()).indexOf(userIdStr);
    const downIndex = post.downvotes.map(id => id.toString()).indexOf(userIdStr);

    if (type === "up") {
      if (downIndex > -1) post.downvotes.splice(downIndex, 1);
      if (upIndex === -1) {
          post.upvotes.push(userId);
      } else {
          // If already upvoted, maybe toggle off? Or do nothing?
          // Usually clicking active vote toggles off.
          post.upvotes.splice(upIndex, 1);
      }
    } else {
      if (upIndex > -1) post.upvotes.splice(upIndex, 1);
      if (downIndex === -1) {
          post.downvotes.push(userId);
      } else {
          post.downvotes.splice(downIndex, 1);
      }
    }

    // Update Counts
    post.upvotesCount = post.upvotes.length;
    await post.save();
    
    // Re-populate for response
    await post.populate("authorId", "username fullName avatarUrl accountType");
    await post.populate("businessId", "name avatarUrl");

    if (post.businessId) {
      await reputationService.updateBusinessMetrics(post.businessId);
    }

    // Create notification for upvote
    if (type === "up" && post.authorId && post.authorId._id.toString() !== userId.toString()) {
        try {
            const Notification = require("../models/Notification");
            const notification = await Notification.create({
                userId: post.authorId._id,
                sender: userId,
                type: "upvote",
                title: "New Upvote",
                message: `${req.user.fullName || "Someone"} upvoted your post`,
                link: `/feed?post=${post._id}`,
                referenceId: post._id,
            });

            const io = req.app.get("io");
            if (io) {
                io.to(post.authorId._id.toString()).emit("notification", notification);
            }
        } catch (notifier) {
            console.error("Failed to send socket notification:", notifier);
        }
    }

    res.json({
      success: true,
      data: formatPost(post),
    });
  } catch (error) {
    next(error);
  }
};

exports.sharePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl");
      
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Increment share count
    post.shareCount = (post.shareCount || 0) + 1;
    await post.save();

    // Create notification for share
    const userId = req.user._id;
    if (post.authorId && post.authorId._id.toString() !== userId.toString()) {
        try {
            const Notification = require("../models/Notification");
            const notification = await Notification.create({
                userId: post.authorId._id,
                sender: userId,
                type: "share",
                title: "New Share",
                message: `${req.user.fullName || "Someone"} shared your post`,
                link: `/feed?post=${post._id}`,
                referenceId: post._id,
            });

            const io = req.app.get("io");
            if (io) {
                io.to(post.authorId._id.toString()).emit("notification", notification);
            }
        } catch (notifier) {
            console.error("Failed to send share notification:", notifier);
        }
    }

    res.json({
      success: true,
      data: formatPost(post),
    });
  } catch (error) {
    next(error);
  }
};

exports.incrementView = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { impressions: 1 } },
      { new: true }
    ).populate('hashtags');
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Dynamic Trend Boosting: Views increase trend score
    if (post.hashtags && post.hashtags.length > 0) {
        // Fire and forget (don't await to keep UI fast)
        (async () => {
            try {
                for (const tag of post.hashtags) {
                    // Match Hashtag -> Keyword -> Trend
                    const keyword = await Keyword.findOne({ word: tag.name });
                    if (keyword) {
                         // View = 0.5 points (High impact for "views to be in trending")
                         await Trend.updateOne(
                             { keywordId: keyword._id }, 
                             { $inc: { score: 0.5, velocity: 1 } }
                         );
                    }
                }
            } catch (err) {
                console.error("Error boosting trend view:", err);
            }
        })();
    }
    
    // We don't return the full post to save bandwidth, just success
    res.json({ success: true, views: post.impressions });
  } catch (error) {
    next(error);
  }
};

exports.searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const regex = new RegExp(q, 'i');
    
    // Find matching hashtags if query starts with #
    let hashtagIds = [];
    if (q.startsWith('#')) {
      const tagName = q.substring(1);
      const hashtags = await Hashtag.find({ name: new RegExp(`^${tagName}$`, 'i') });
      hashtagIds = hashtags.map(h => h._id);
    } else {
      // Also look for keywords in content even if no #
      const hashtags = await Hashtag.find({ name: regex });
      hashtagIds = hashtags.map(h => h._id);
    }

    const query = {
      $or: [
        { content: regex },
        { hashtags: { $in: hashtagIds } },
        { tag: regex }
      ]
    };

    const posts = await Post.find(query)
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl")
      .populate("hashtags", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: {
        posts: posts.map(formatPost),
        hasMore: skip + posts.length < total
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a post by ID.
 * Only the author or a business/community owner should be allowed to update.
 */
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, categoryId } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Authorization check
    if (post.authorId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this post" });
    }

    // Update fields
    if (content) post.content = content;
    if (categoryId) post.categoryId = categoryId;

    // If content changed, re-analyze with AI and update hashtags
    if (content) {
      const aiAnalysis = await aiService.analyzeContent(content);
      post.sentimentScore = aiAnalysis.sentimentScore;
      post.professionalismScore = aiAnalysis.professionalismScore;
      post.authenticityScore = aiAnalysis.authenticityScore;
      post.relevanceScore = aiAnalysis.relevanceScore;
      post.aiKeywords = aiAnalysis.aiKeywords;

      const hashtagIds = await extractAndUpsertHashtags(content, post._id, aiAnalysis);
      post.hashtags = hashtagIds;
    }

    await post.save();
    const updatedPost = await Post.findById(id)
      .populate("authorId", "username fullName avatarUrl accountType")
      .populate("businessId", "name avatarUrl");

    const formattedPost = formatPost(updatedPost);

    // Emit socket event
    const io = req.app.get("io");
    if (io) {
      io.emit("post:update", { postId: id, updates: formattedPost });
    }

    res.json({
      success: true,
      data: formattedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a post by ID.
 * Only the author or a business/community owner should be allowed to delete.
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Authorization check
    if (post.authorId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);

    // Emit socket event
    const io = req.app.get("io");
    if (io) {
      io.emit("post:delete", { postId: id });
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


