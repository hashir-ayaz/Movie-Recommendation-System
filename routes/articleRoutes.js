const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Routes for articles

// Public Routes
router.get("/", articleController.getAllArticles); // Get all articles
router.get("/search", articleController.searchArticles); // Search articles by query (e.g., tags, category)
router.get("/:id", articleController.getArticleById); // Get a specific article by ID

// Admin/Author Routes
router.post("/", protect, adminProtect, articleController.createArticle); // Create a new article
router.patch("/:id", protect, adminProtect, articleController.updateArticle); // Update an article
router.delete("/:id", protect, adminProtect, articleController.deleteArticle); // Delete an article

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Article management and operations
 */

/**
 * @swagger
 * /api/v1/articles:
 *   get:
 *     summary: Retrieve a list of all articles with optional filters and pagination
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter articles by category
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags to filter articles
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of articles per page
 *     responses:
 *       200:
 *         description: A list of articles with pagination details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/articles/search:
 *   get:
 *     summary: Search articles by title or content
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query to look for in article titles or content
 *     responses:
 *       200:
 *         description: List of articles matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       400:
 *         description: Query parameter is missing
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
 * /api/v1/articles/{id}:
 *   get:
 *     summary: Retrieve a specific article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to retrieve
 *     responses:
 *       200:
 *         description: Article details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid Article ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article not found
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
 *     summary: Update an existing article by ID (Admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to update
 *     requestBody:
 *       required: true
 *       description: Article fields to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Article Title"
 *               content:
 *                 type: string
 *                 example: "Updated content of the article."
 *               category:
 *                 type: string
 *                 enum: ["Movies", "Actors", "Upcoming Projects", "Industry Updates"]
 *                 example: "Movies"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Drama", "Thriller"]
 *               coverImage:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/updated-cover.jpg"
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article updated successfully"
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid Article ID or input data
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
 *         description: Forbidden - Only the author or admin can update the article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article not found
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
 *     summary: Delete an article by ID (Admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the article to delete
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article deleted successfully"
 *       400:
 *         description: Invalid Article ID
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
 *         description: Forbidden - Only the author or admin can delete the article
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Article not found
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
 * /api/v1/articles:
 *   post:
 *     summary: Create a new article (Admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Article details to create
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Insights into Movie Recommendations"
 *               content:
 *                 type: string
 *                 example: "This article explores advanced techniques for improving movie recommendation systems..."
 *               category:
 *                 type: string
 *                 enum: ["Movies", "Actors", "Upcoming Projects", "Industry Updates"]
 *                 example: "Movies"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Recommendation", "AI", "Machine Learning"]
 *               coverImage:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/cover-image.jpg"
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article created successfully"
 *                 article:
 *                   $ref: '#/components/schemas/Article'
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
 *         description: Forbidden - Only admins can create articles
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
 * /api/v1/articles/search:
 *   get:
 *     summary: Search articles by title or content
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query to look for in article titles or content
 *     responses:
 *       200:
 *         description: List of articles matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       400:
 *         description: Query parameter is missing
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
