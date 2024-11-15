const Movie = require("../models/Movie");

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({ movies: movies });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const {
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      averageRating,
      coverPhoto,
      trivia,
      goofs,
      soundtrack,
      ageRating,
      parentalGuidance,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !genre ||
      !director ||
      !releaseDate ||
      !runtime ||
      !synopsis ||
      !averageRating ||
      !coverPhoto ||
      !ageRating ||
      !parentalGuidance
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new movie instance
    const movie = new Movie({
      title,
      genre,
      director,
      cast,
      releaseDate,
      runtime,
      synopsis,
      averageRating,
      coverPhoto,
      trivia,
      goofs,
      soundtrack,
      ageRating,
      parentalGuidance,
    });

    // Save the movie to the database
    const savedMovie = await movie.save();

    // Return success response
    return res
      .status(201)
      .json({ message: "Movie added successfully", movie: savedMovie });
  } catch (error) {
    console.error("Error adding movie:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  const { id } = req.params;

  try {
    await Movie.findByIdAndDelete(id);
    return res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params; // Extract movie ID from route parameter

  try {
    // Find the movie by ID
    const movie = await Movie.findById(id);

    // If movie does not exist, return an error
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Update only the fields provided in the request body
    Object.keys(req.body).forEach((key) => {
      if (movie[key] !== undefined) {
        movie[key] = req.body[key];
      }
    });

    // Save the updated movie
    const updatedMovie = await movie.save();

    // Return the updated movie
    return res
      .status(200)
      .json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    console.error("Error updating movie:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    return res.status(200).json({ movie });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  console.log("addReview");
};
