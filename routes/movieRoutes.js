const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// this route needs to be admin protected
router
  .get("/", movieController.getMovies)
  .post("/", movieController.addMovie)
  .delete("/", movieController.deleteMovie)
  .put("/", movieController.updateMovie);

module.exports = router;
