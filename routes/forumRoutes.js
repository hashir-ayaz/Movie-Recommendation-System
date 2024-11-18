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

/**
 * @swagger
 * tags:
 *   name: Forums
 *   description: Forum management and operations
 */

/**
 * @swagger
 * /api/v1/forums:
 *   get:
 *     summary: Retrieve a list of all forums
 *     tags: [Forums]
 *     responses:
 *       200:
 *         description: A list of forums
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forums:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Forum'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new forum (Admin only)
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Forum details to create
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "General Discussion"
 *               description:
 *                 type: string
 *                 example: "A place for general discussions."
 *     responses:
 *       201:
 *         description: Forum created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forum created successfully
 *                 forum:
 *                   $ref: '#/components/schemas/Forum'
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/forums/{forumId}:
 *   get:
 *     summary: Retrieve a specific forum by ID
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum to retrieve
 *     responses:
 *       200:
 *         description: Forum details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forum:
 *                   $ref: '#/components/schemas/Forum'
 *       400:
 *         description: Invalid forum ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Update a forum by ID (Admin only)
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum to update
 *     requestBody:
 *       required: true
 *       description: Forum fields to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Forum Name"
 *               description:
 *                 type: string
 *                 example: "Updated description of the forum."
 *     responses:
 *       200:
 *         description: Forum updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forum updated successfully
 *                 forum:
 *                   $ref: '#/components/schemas/Forum'
 *       400:
 *         description: Invalid forum ID or input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a forum by ID (Admin only)
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum to delete
 *     responses:
 *       200:
 *         description: Forum deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forum deleted successfully
 *       400:
 *         description: Invalid forum ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/forums/{forumId}/posts:
 *   get:
 *     summary: Retrieve all posts within a specific forum
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum to retrieve posts from
 *     responses:
 *       200:
 *         description: List of posts in the forum
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid forum ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Add a new post to a specific forum
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum to add a post to
 *     requestBody:
 *       required: true
 *       description: Post details to add
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "How to improve movie recommendations?"
 *               content:
 *                 type: string
 *                 example: "I'm looking for ways to enhance the movie recommendation system. Any suggestions?"
 *     responses:
 *       201:
 *         description: Post added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post added successfully
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/forums/{forumId}/posts/{postId}:
 *   get:
 *     summary: Retrieve a specific post within a forum
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid forum ID or post ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum or Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     summary: Update a specific post within a forum
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       description: Post fields to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Post Title"
 *               content:
 *                 type: string
 *                 example: "Updated content of the post."
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post updated successfully
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid forum ID, post ID, or input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - You can only update your own posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum or Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a specific post within a forum
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully
 *       400:
 *         description: Invalid forum ID or post ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - You can only delete your own posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum or Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/forums/{forumId}/posts/{postId}/upvote:
 *   post:
 *     summary: Upvote a specific post within a forum
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to upvote
 *     responses:
 *       200:
 *         description: Post upvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post upvoted successfully
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid forum ID or post ID, or post already liked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum or Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/forums/{forumId}/posts/{postId}/downvote:
 *   post:
 *     summary: Downvote a specific post within a forum
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to downvote
 *     responses:
 *       200:
 *         description: Post downvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post downvoted successfully
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid forum ID or post ID, or post already disliked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum or Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/forums/{forumId}/join:
 *   post:
 *     summary: Join a specific forum
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum to join
 *     responses:
 *       200:
 *         description: Joined forum successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Joined forum successfully
 *                 forum:
 *                   $ref: '#/components/schemas/Forum'
 *       400:
 *         description: Invalid forum ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/forums/{forumId}/leave:
 *   post:
 *     summary: Leave a specific forum
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the forum to leave
 *     responses:
 *       200:
 *         description: Left forum successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Left forum successfully
 *                 forum:
 *                   $ref: '#/components/schemas/Forum'
 *       400:
 *         description: Invalid forum ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Forum not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
