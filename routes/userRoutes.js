const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);

router.post("/login", userController.login);

router.post("/register", userController.register);

router.put("/:userId", userController.updateUser);

router.delete("/:userId", userController.deleteUser);

router.get("/:userId", userController.getUser);

router.post("/review", userController.addReview);

module.exports = router;
