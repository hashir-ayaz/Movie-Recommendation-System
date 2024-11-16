const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Admin Routes (Protected)
router
  .get("/", protect, adminProtect, movieController.getMovies) // Get all movies
  .post("/", protect, adminProtect, movieController.addMovie) // Add a new movie
  .patch("/:id", protect, adminProtect, movieController.updateMovie) // Update a movie
  .delete("/:id", protect, adminProtect, movieController.deleteMovie); // Delete a movie

// Public Routes
router.get("/:id", movieController.getMovie); // Get details of a single movie

// Review Routes
router.post("/review", protect, movieController.addReview); // Add a movie review
router.get("/:id/reviews", movieController.getReviews); // Get reviews for a movie

module.exports = router;
