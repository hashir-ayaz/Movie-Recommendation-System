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
