const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

router
  .get("/", userController.getAllUsers)
  .post("/login", userController.login)
  .post("/register", userController.register)
  .patch("/:userId", userController.updateUser)
  .delete("/:userId", userController.deleteUser)
  .get("/:userId", userController.getUser)
  .get("/:userId/lists", userController.getUserLists)
  .post("/:userId/lists", userController.addList)
  .post("/:userId/lists/:listId/follow", userController.followList)
  .post("/:userId/wishlist/:movieId", userController.addToWishlist);

module.exports = router;
