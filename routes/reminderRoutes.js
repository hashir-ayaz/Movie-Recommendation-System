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

/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Reminder management and operations
 */

/**
 * @swagger
 * /api/v1/reminders:
 *   post:
 *     summary: Create a new reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Reminder details to create
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *             properties:
 *               movieId:
 *                 type: string
 *                 description: The ID of the movie to set a reminder for
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       201:
 *         description: Reminder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reminder created successfully"
 *                 reminder:
 *                   $ref: '#/components/schemas/Reminder'
 *       400:
 *         description: Bad request due to invalid input or movie already released
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
 *       404:
 *         description: Movie not found
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
 * /api/v1/reminders/{id}:
 *   patch:
 *     summary: Update an existing reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reminder to update
 *     requestBody:
 *       required: true
 *       description: Reminder details to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 description: The new movie ID to set for the reminder
 *                 example: "60d0fe4f5311236168a109cb"
 *     responses:
 *       200:
 *         description: Reminder updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reminder updated successfully"
 *                 reminder:
 *                   $ref: '#/components/schemas/Reminder'
 *       400:
 *         description: Bad request due to invalid input or movie already released
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
 *       404:
 *         description: Reminder or Movie not found
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
 * /api/v1/reminders/{id}:
 *   delete:
 *     summary: Delete a reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reminder to delete
 *     responses:
 *       200:
 *         description: Reminder deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reminder deleted successfully"
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reminder not found
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
