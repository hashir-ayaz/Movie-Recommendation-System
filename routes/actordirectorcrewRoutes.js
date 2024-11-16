const express = require("express");
const router = express.Router();
const actorDirectorCrewController = require("../controllers/actordirectorcrewController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  adminProtect,
  actorDirectorCrewController.createActorDirectorCrew
); // Create a new actor/director/crew

// Public Routes
router.get("/", actorDirectorCrewController.getAllActorDirectorCrew); // Get all actors/directors/crew
router.get("/:id", actorDirectorCrewController.getActorDirectorCrewById); // Get a specific actor/director/crew by ID

// Protected Routes (Admin Only)
router.patch(
  "/:id",
  protect,
  adminProtect,
  actorDirectorCrewController.updateActorDirectorCrew
); // Update an actor/director/crew
router.delete(
  "/:id",
  protect,
  adminProtect,
  actorDirectorCrewController.deleteActorDirectorCrew
); // Delete an actor/director/crew
router.post(
  "/:id/filmography",
  protect,
  adminProtect,
  actorDirectorCrewController.addMovieToFilmography
); // Add a movie to the filmography

module.exports = router;
