const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Forum Routes
router
  .route("/")
  .get(forumController.getAllForums) // Get all forums
  .post(protect, adminProtect, forumController.createForum); // Admin creates a new forum

router
  .route("/:forumId")
  .get(forumController.getForumById) // Get a specific forum
  .patch(protect, adminProtect, forumController.updateForum) // Admin updates a forum
  .delete(protect, adminProtect, forumController.deleteForum); // Admin deletes a forum

// Post Routes within a Forum
router
  .route("/:forumId/posts")
  .get(forumController.getAllPostsInForum) // Get all posts in a specific forum
  .post(protect, forumController.addPostToForum); // User adds a post to a forum

router
  .route("/:forumId/posts/:postId")
  .get(forumController.getPostById) // Get a specific post
  .patch(protect, forumController.updatePost) // User updates their post
  .delete(protect, forumController.deletePost); // User deletes their post

// User Engagement
router
  .post("/:forumId/posts/:postId/upvote", protect, forumController.upvotePost) // User upvotes a post
  .post(
    "/:forumId/posts/:postId/downvote",
    protect,
    forumController.downvotePost
  ) // User downvotes a post
  .post("/:forumId/join", protect, forumController.joinForum) // User joins a forum
  .post("/:forumId/leave", protect, forumController.leaveForum); // User leaves a forum

module.exports = router;
