const router = require("express").Router();
const { signup, login, logout } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");

const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const businessController = require("../controllers/businessController");
const notificationController = require("../controllers/notificationController");
const promotionController = require("../controllers/promotionController");
const trendController = require("../controllers/trendController");
const badgeController = require("../controllers/badgeController");
const aiController = require("../controllers/aiController");
const categoryController = require("../controllers/categoryController");
const keywordController = require("../controllers/keywordController");
const {
  uploadArray,
  uploadSingle,
  uploadFields,
} = require("../middleware/fileUploadMiddleware");

// Auth Routes
router.post("/auth/register", uploadArray("avatar", 1), signup);
router.post("/auth/login", login);
router.post("/auth/logout", auth, logout);
router.get("/users/me", auth, userController.getCurrentUser);
// Allow the authenticated user to update their own profile (including avatar upload)
router.put(
  "/users/me",
  auth,
  uploadSingle("avatar"),
  userController.updateMyProfile
);

router.post("/comments", auth, commentController.createComment);
router.put("/comments/:id", auth, commentController.updateComment);
router.delete("/comments/:id", auth, commentController.deleteComment);

router.get("/posts/:postId/comments", commentController.listCommentsByPost);

// Comment reactions and replies
router.post("/comments/:id/like", auth, commentController.likeComment);
router.delete("/comments/:id/like", auth, commentController.unlikeComment);
router.get("/comments/:id/replies", commentController.getReplies);

// Post Routes
router.post("/posts", auth, uploadArray("media", 5), postController.createPost);
router.get("/posts/search", auth, postController.searchPosts);
router.get("/posts/feed", auth, postController.getPosts);
router.get("/posts/user/:userId", auth, userController.getUserPosts);
router.get(
  "/posts/business/:businessId",
  auth,
  postController.getPostsByBusiness
);
router.get(
  "/posts/community/:communityId",
  auth,
  postController.getPostsByCommunity
);
router.post("/posts/:id/upvote", auth, postController.upvotePost);
router.post("/posts/:id/downvote", auth, postController.downvotePost);
router.post("/posts/:id/vote", auth, postController.votePost);
router.post("/posts/:id/like", auth, postController.upvotePost);
router.delete("/posts/:id/like", auth, postController.downvotePost);
router.post("/posts/:id/share", auth, postController.sharePost);
router.post("/posts/:id/view", auth, postController.incrementView);
router.get("/posts/:id", auth, postController.getPostById);
router.put("/posts/:id", auth, postController.updatePost);
router.delete("/posts/:id", auth, postController.deletePost);
router.post("/posts/:postId/comments", auth, commentController.createComment);

// User Routes
router.get("/users/search", auth, userController.searchUsers);
router.get("/users/feed", auth, userController.getUserFeed);
router.get("/users/:id", auth, userController.getUserById);
router.put("/users/:id", auth, userController.updateUserProfile);
router.put("/users/:id/password", auth, userController.updatePassword);
router.post("/users/:id/badges", auth, userController.assignBadgeToUser);
router.post("/users/:id/follow", auth, userController.followUser);
router.post("/users/:id/unfollow", auth, userController.unfollowUser);

// Trend Routes
router.get("/trends/topics", auth, trendController.getTrendingTopics);
router.get("/trends/posts", auth, trendController.getTrendingPosts);

// Business Routes
router.get("/businesses/search", auth, businessController.searchBusinesses);
router.get(
  "/businesses/category/:category",
  auth,
  businessController.getBusinessesByCategory
);
router.get(
  "/businesses/user/:userId",
  auth,
  businessController.getUserBusinesses
);
router.get("/businesses", auth, businessController.getAllBusinesses);
router.get("/businesses/:id", auth, businessController.getBusinessProfile);
// Update business profile with proper middleware for fields
router.put(
  "/businesses/:id",
  auth,
  uploadFields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  businessController.updateBusinessProfile
);
router.post("/businesses/:id/follow", auth, businessController.followBusiness);
router.post("/businesses/:id/offerings", auth, businessController.addOffering);
router.delete(
  "/businesses/:id/offerings/:offeringId",
  auth,
  businessController.removeOffering
);
router.get("/businesses/:id/analytics", auth, businessController.getAnalytics);
router.get("/businesses/:id/performance", auth, businessController.getPostPerformance);

// Notification Routes
router.get("/notifications", auth, notificationController.getNotifications);
router.put("/notifications/:id/read", auth, notificationController.markAsRead);
router.put(
  "/notifications/read-all",
  auth,
  notificationController.markAllAsRead
);
router.get(
  "/notifications/unread/count",
  auth,
  notificationController.getUnreadCount
);

// Community Routes
const communityController = require("../controllers/communityController");
router.get("/communities/search", auth, communityController.searchCommunities);
router.get(
  "/communities/category/:category",
  auth,
  communityController.getCommunitiesByCategory
);
router.get(
  "/communities/user/:userId",
  auth,
  communityController.getUserCommunities
);
router.get("/communities", auth, communityController.getCommunities);
router.get("/communities/:id", auth, communityController.getCommunity);
router.post(
  "/communities",
  auth,
  uploadArray("coverImage", 1),
  communityController.createCommunity
);
router.put(
  "/communities/:id",
  auth,
  uploadArray("coverImage", 1),
  communityController.updateCommunity
);
router.post("/communities/:id/join", auth, communityController.joinCommunity);
router.delete(
  "/communities/:id/leave",
  auth,
  communityController.leaveCommunity
);
router.get("/communities/:id/members", auth, communityController.getMembers);
router.put("/communities/:id/members/:userId/role", auth, communityController.updateMemberRole);
router.delete("/communities/:id/members/:userId", auth, communityController.banMember);
router.post("/communities/:id/members/:userId/unban", auth, communityController.unbanMember);

// Community Chat Routes
const communityChatController = require("../controllers/communityChatController");
router.get(
  "/communities/:communityId/messages",
  auth,
  communityChatController.getCommunityMessages
);
router.post(
  "/communities/:communityId/messages",
  auth,
  uploadArray("media", 5),
  communityChatController.sendCommunityMessage
);
router.delete("/communities/:communityId/messages/:messageId", auth, communityChatController.deleteCommunityMessage);

// AI helpers for communities
router.post(
  "/communities/:communityId/ai-summarize",
  auth,
  communityChatController.summarizeCommunity
);

const analyticsController = require("../controllers/analyticsController");
router.get(
  "/analytics/business/:businessId",
  auth,
  analyticsController.getBusinessHealth
);

// Chat Routes
const chatController = require("../controllers/chatController");
router.get("/messages/conversations", auth, chatController.getConversations);
router.post("/messages/conversations", auth, chatController.startConversation);
router.get("/messages/unread/count", auth, chatController.getUnreadCount);
router.get("/messages/:friendId", auth, chatController.getChatHistory);
router.post("/messages", auth, chatController.sendMessage);
router.post(
  "/messages/:friendId/ai-reply",
  auth,
  chatController.generateAiReply
);
router.put("/messages/:friendId/read", auth, chatController.markAsRead);
router.delete("/messages/:messageId", auth, chatController.deleteMessage);

// Promotion Routes
router.post("/promotions", auth, promotionController.createPromotion);
router.get("/promotions", auth, promotionController.getPromotions);
router.get("/promotions/:id", auth, promotionController.getPromotionById);
router.get(
  "/promotions/:id/analytics",
  auth,
  promotionController.getPromotionAnalytics
);
router.patch("/promotions/:id/pause", auth, promotionController.pausePromotion);
router.patch(
  "/promotions/:id/resume",
  auth,
  promotionController.resumePromotion
);

// Trend Promotion Routes
router.post("/promotions/trends", auth, promotionController.createTrendPromotion);
router.get("/promotions/trends/active", auth, promotionController.getActiveTrendPromotions);
router.patch("/promotions/trends/:id/stop", auth, promotionController.stopTrendPromotion);

// Badge Routes
router.get("/badges", auth, badgeController.getAllBadges);
router.get("/badges/:id", auth, badgeController.getBadgeById);
router.post("/badges", auth, badgeController.createBadge); // Admin only ideal

// AI Routes
router.post("/ai/chat", auth, aiController.chatWithAI);

// Category Routes
router.post("/categories", auth, categoryController.createCategory);
router.get("/categories", auth, categoryController.getCategories);
router.get("/categories/:id", auth, categoryController.getCategoryById);
router.put("/categories/:id", auth, categoryController.updateCategory);
router.delete("/categories/:id", auth, categoryController.deleteCategory);

// Keyword Routes
router.get("/keywords", auth, keywordController.getAllKeywords);
router.get("/keywords/:id", auth, keywordController.getKeywordStats);
router.put("/keywords/:id", auth, keywordController.updateKeywordStats);

module.exports = router;
