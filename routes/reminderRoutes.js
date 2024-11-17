const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

// Routes for Reminders

// Create a new reminder
router.post("/", protect, reminderController.createReminder);

// Update an existing reminder
router.patch("/:id", protect, reminderController.updateReminder);

// Delete a reminder
router.delete("/:id", protect, reminderController.deleteReminder);

module.exports = router;
