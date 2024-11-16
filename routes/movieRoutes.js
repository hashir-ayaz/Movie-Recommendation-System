const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Admin Routes (Protected)
router.get("/", protect, adminProtect, movieController.getMovies); // Get all movies
router.post("/", protect, adminProtect, movieController.addMovie); // Add a new movie
router.patch("/:id", protect, adminProtect, movieController.updateMovie); // Update a movie
router.delete("/:id", protect, adminProtect, movieController.deleteMovie); // Delete a movie

// Public Routes
router.get("/search-filter", movieController.searchAndFilterMovies); // Search and filter movies
router.get("/top-of-month", movieController.getTopMoviesOfTheMonth); // Top movies of the month
router.get("/top-by-genre", movieController.getTopMoviesByGenre); // Top 10 movies by genre

// Dynamic Routes (Place after specific routes)
router.get("/:id", movieController.getMovie); // Get details of a single movie
router.get("/:id/reviews", movieController.getReviews); // Get reviews for a movie

// Review Routes
router.post("/review", protect, movieController.addReview); // Add a movie review

module.exports = router;
