const express = require("express");
const router = express.Router();
const { protect, adminProtect } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

// route for getting the most liked posts
router.get(
  "/most-liked-posts",
  protect,
  adminProtect,
  adminController.getMostLikedPosts
);

// route for getting the most liked reviews
router.get(
  "/most-liked-reviews",
  protect,
  adminProtect,
  adminController.getMostLikedReviews
);

// route for getting forums with most members
router.get(
  "/forums-with-most-members",
  protect,
  adminProtect,
  adminController.getForumsWithMostMembers
);

// route for getting forums with most posts
router.get(
  "/forums-with-most-posts",
  protect,
  adminProtect,
  adminController.getForumsWithMostPosts
);

// route for getting most popular movies by imdb rating
router.get(
  "/most-popular-movies",
  protect,
  adminProtect,
  adminController.getMostPopularMovies
);

module.exports = router;
