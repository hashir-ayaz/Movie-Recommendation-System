const Movie = require("../models/Movie");
const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getMovies = async (req, res) => {
  try {
    // Extract query parameters for pagination
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 movies per page

    // Convert query parameters to integers
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    // Fetch the movies with pagination
    const movies = await Movie.find()
      .populate("director", "name") // Populate director with only the name field
      .populate("cast", "name") // Populate cast with only the name field
      .skip((pageInt - 1) * limitInt) // Skip movies for previous pages
      .limit(limitInt); // Limit the number of movies returned

    // Get the total count of movies for calculating total pages
    const totalMovies = await Movie.countDocuments();

    return res.status(200).json({
      movies,
      pagination: {
        currentPage: pageInt,
        totalPages: Math.ceil(totalMovies / limitInt),
        totalMovies,
        moviesPerPage: limitInt,
      },
    });
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
  console.log("getReviews");
  const { id } = req.params;

  try {
    // check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    // Attempt to find the movie by its ID
    const movie = await Movie.findById(id).populate("reviews");

    // If the movie does not exist, return a 404 response
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    console.log("the movie found is ", movie);

    // Return the reviews if the movie is found
    res.status(200).json({ reviews: movie.reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
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

// exports.getReviews = async (req, res) => {
//   const { movieId } = req.params;

//   try {
//     const movie = await Movie.findById(movieId).populate("reviews");
//     return res.status(200).json({ reviews: movie.reviews });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

exports.likeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  try {
    // Check if reviewId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // Check if review exists
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // check if user already liked this review
    if (review.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Review already liked" });
    }
    // Add the user to the likedBy array
    review.likedBy.push(userId);

    // Increment the likes count
    review.likeCount += 1;

    // Save the updated review
    await review.save();

    return res.status(200).json({ message: "Review liked successfully" });
  } catch (error) {
    console.error("Error liking review:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getSimilarTitles = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Validate movieId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    // Find the current movie
    const currentMovie = await Movie.findById(movieId);
    if (!currentMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const imdbThreshold = 0.4; // Threshold for IMDb rating similarity

    // Find similar movies based on genre, director, or IMDb rating
    const similarMovies = await Movie.find({
      _id: { $ne: currentMovie._id }, // Exclude the current movie
      $or: [
        { genre: { $in: currentMovie.genre } }, // Match any genre
        { director: currentMovie.director }, // Match the same director
        {
          imdbRating: {
            $gte: currentMovie.imdbRating - imdbThreshold,
            $lte: currentMovie.imdbRating + imdbThreshold,
          }, // IMDb rating within ±0.4
        },
      ],
    }).select("_id"); // Only fetch the `_id` field for efficiency

    // Update the similarTitles field of the current movie
    currentMovie.similarTitles = similarMovies.map((movie) => movie._id);
    await currentMovie.save();

    // Populate and return the updated similarTitles field
    const populatedMovie = await currentMovie.populate(
      "similarTitles",
      "title"
    );
    res.status(200).json({
      message: "Similar titles fetched successfully",
      similarTitles: populatedMovie.similarTitles,
    });
  } catch (error) {
    console.error("Error fetching similar titles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
