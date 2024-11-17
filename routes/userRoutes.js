const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

// Authentication Routes
router.post("/login", userController.login);
router.post("/register", userController.register);

// User Management Routes
router.get("/", protect, adminProtect, userController.getAllUsers); // Admin protected
router.get("/:userId", protect, userController.getUser);
router.patch("/:userId", protect, userController.updateUser);
router.delete("/:userId", protect, userController.deleteUser);

// User List Routes
router.get("/:userId/lists", protect, userController.getUserLists);
router.post("/:userId/lists", protect, userController.addList);
router.post(
  "/:userId/lists/:listId/follow",
  protect,
  userController.followList
);

// Wishlist Routes
router.post(
  "/:userId/wishlist/:movieId",
  protect,
  userController.addToWishlist
);

router.get(
  "/:userId/personalised-recommendations",
  protect,
  userController.getPersonalisedRecommendations
);

module.exports = router;
