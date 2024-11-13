const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);

router.post("/login", userController.login);

router.post("/register", userController.register);

router.put("/update/:userId", userController.updateUser);

module.exports = router;
