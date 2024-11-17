const Movie = require("../models/Movie");
const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .populate("director", "name") // Populate director with only the name field
      .populate("cast", "name"); // Populate cast with only the name field

    return res.status(200).json({ movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.addMovie = async (req, res) => {
  try {
    // Directly use req.body to create a new movie instance
    const movie = new Movie(req.body);

    // Save the movie to the database
    const savedMovie = await movie.save();

    // Return success response
    return res.status(201).json({
      message: "Movie added successfully",
      movie: savedMovie,
    });
  } catch (error) {
    console.error("Error adding movie:", error);

    // Return validation errors from the schema
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    // Handle other errors
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
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
    // Check if movie ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

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
    // check if movie Id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const movie = await Movie.findById(id);
    return res.status(200).json({ movie });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  console.log("addReview");
  const userId = req.user._id; // Extract user ID from req.user populated by middleware
  const { movieId } = req.params; // Extract movie ID from request parameters
  const { ratingValue, reviewText } = req.body; // Extract review data from request body

  try {
    // check if movieId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    // Check if movie exists
    const movieFound = await Movie.findById(movieId);
    if (!movieFound) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Create a new review instance
    const review = new Review({
      user: userId,
      movie: movieFound._id,
      ratingValue,
      reviewText,
    });

    // Save the review to the database
    const savedReview = await review.save();

    // Push the review to the movie's reviews array
    movieFound.reviews.push(savedReview._id);

    // Recalculate the average rating
    const totalRatings = movieFound.reviews.length + 1; // Include the current review
    const newAverageRating =
      (movieFound.averageRating * (totalRatings - 1) + ratingValue) /
      totalRatings;

    movieFound.averageRating = newAverageRating;

    // Save the updated movie with new average rating
    await movieFound.save();

    // Return success response
    return res.status(201).json({
      message: "Review added successfully",
      review: savedReview,
      averageRating: newAverageRating,
    });
  } catch (error) {
    console.error("Error adding review:", error);

    // Return appropriate error response
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", error: error.message });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id).populate("reviews");
    return res.status(200).json({ reviews: movie.reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.searchAndFilterMovies = async (req, res) => {
  try {
    const {
      query,
      minRating,
      maxRating,
      minYear,
      maxYear,
      genre,
      sortBy = "imdbRating",
    } = req.query;

    const filter = {};

    // Search logic
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
        { keywords: { $regex: query, $options: "i" } },
      ];
    }

    // Filter logic
    if (minRating) filter.imdbRating = { $gte: parseFloat(minRating) };
    if (maxRating)
      filter.imdbRating = { ...filter.imdbRating, $lte: parseFloat(maxRating) };

    if (minYear || maxYear) {
      filter.releaseDate = {};
      if (minYear) filter.releaseDate.$gte = new Date(`${minYear}-01-01`);
      if (maxYear) filter.releaseDate.$lte = new Date(`${maxYear}-12-31`);
    }

    if (genre) filter.genre = { $regex: genre, $options: "i" };

    // Execute query
    const movies = await Movie.find(filter)
      .populate("director cast", "name")
      .sort({ [sortBy]: -1 }); // Sort by IMDb rating (default)

    res.status(200).json({ movies });
  } catch (error) {
    console.error("Error searching and filtering movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTopMoviesOfTheMonth = async (req, res) => {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    const movies = await Movie.find({
      releaseDate: { $gte: startOfMonth, $lte: endOfMonth },
    })
      .sort({ imdbRating: -1 }) // Sort by IMDb rating in descending order
      .limit(10);

    res.status(200).json({ movies });
  } catch (error) {
    console.error("Error fetching top movies of the month:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTopMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.query;

    if (!genre) {
      return res.status(400).json({ message: "Genre parameter is required" });
    }

    const movies = await Movie.find({ genre: { $regex: genre, $options: "i" } })
      .sort({ imdbRating: -1 }) // Sort by IMDb rating in descending order
      .limit(10);

    res.status(200).json({ movies });
  } catch (error) {
    console.error("Error fetching top movies by genre:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReviews = async (req, res) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId).populate("reviews");
    return res.status(200).json({ reviews: movie.reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
