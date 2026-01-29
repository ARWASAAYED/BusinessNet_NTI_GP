const authController = require("../src/controllers/authController");
const commentController = require("../src/controllers/commentController");
const postController = require("../src/controllers/postController");
const userController = require("../src/controllers/userController");
const businessController = require("../src/controllers/businessController");
const notificationController = require("../src/controllers/notificationController");
const promotionController = require("../src/controllers/promotionController");
const trendController = require("../src/controllers/trendController");
const badgeController = require("../src/controllers/badgeController");
const communityController = require("../src/controllers/communityController");
const communityChatController = require("../src/controllers/communityChatController");
const analyticsController = require("../src/controllers/analyticsController");
const chatController = require("../src/controllers/chatController");

console.log("authController:", Object.keys(authController));
console.log("signup typeof:", typeof authController.signup);
console.log("login typeof:", typeof authController.login);
console.log("logout typeof:", typeof authController.logout);

console.log("commentController keys:", Object.keys(commentController));
console.log("createComment typeof:", typeof commentController.createComment);

console.log("postController keys:", Object.keys(postController));
console.log("createPost typeof:", typeof postController.createPost);

console.log("userController keys:", Object.keys(userController));
console.log("businessController keys:", Object.keys(businessController));
console.log("promotionController keys:", Object.keys(promotionController));
console.log(
  "notificationController keys:",
  Object.keys(notificationController)
);
console.log("trendController keys:", Object.keys(trendController));
console.log("badgeController keys:", Object.keys(badgeController));
console.log("communityController keys:", Object.keys(communityController));
console.log(
  "communityChatController keys:",
  Object.keys(communityChatController)
);
console.log("analyticsController keys:", Object.keys(analyticsController));
console.log("chatController keys:", Object.keys(chatController));

console.log("Checked handlers");
