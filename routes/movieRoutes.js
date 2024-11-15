const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// this route needs to be admin protected
router
  .get("/", movieController.getMovies)
  .post("/", movieController.addMovie)
  .delete("/:id", movieController.deleteMovie)
  .patch("/:id", movieController.updateMovie)
  .get("/:id", movieController.getMovie)
  .post("/:id/reviews", movieController.addReview);

module.exports = router;
