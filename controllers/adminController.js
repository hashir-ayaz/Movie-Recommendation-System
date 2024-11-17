const Post = require("../models/Post");
const Movie = require("../models/Movie");
const Review = require("../models/Review");
const Forum = require("../models/Forum");

exports.getMostLikedPosts = async (req, res) => {
  try {
    // Aggregate posts and sort by the number of upvotes in descending order
    const mostLikedPosts = await Post.find()
      .sort({ upvotes: -1 }) // Sort by the number of upvotes in descending order
      .limit(10) // Limit to the top 10 most liked posts
      .populate("createdBy", "username") // Populate the user who created the post
      .populate("forum", "name"); // Populate the forum the post belongs to

    // Return the most liked posts
    res.status(200).json({
      message: "Successfully fetched the most liked posts",
      posts: mostLikedPosts,
    });
  } catch (error) {
    console.error("Error fetching most liked posts:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getMostLikedReviews = async (req, res) => {
  try {
    // Fetch the reviews sorted by likeCount in descending order
    const mostLikedReviews = await Review.find()
      .sort({ likeCount: -1 }) // Sort by likeCount in descending order
      .limit(10) // Limit to the top 10 most liked reviews
      .populate("user", "username") // Populate the username of the user who created the review
      .populate("movie", "title"); // Populate the title of the movie the review belongs to

    // Return the most liked reviews
    res.status(200).json({
      message: "Successfully fetched the most liked reviews",
      reviews: mostLikedReviews,
    });
  } catch (error) {
    console.error("Error fetching most liked reviews:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getForumsWithMostMembers = async (req, res) => {
  try {
    // Fetch forums sorted by the number of members in descending order
    const forumsWithMostMembers = await Forum.find()
      .sort({ members: -1 }) // Sort by members count (descending)
      .limit(10) // Limit to the top 10 forums with the most members
      .populate("createdBy", "username") // Populate the username of the user who created the forum
      .populate("moderators", "username"); // Populate the usernames of the moderators

    // Return the forums with the most members
    res.status(200).json({
      message: "Successfully fetched forums with the most members",
      forums: forumsWithMostMembers,
    });
  } catch (error) {
    console.error("Error fetching forums with most members:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getForumsWithMostPosts = async (req, res) => {
  try {
    // Fetch forums sorted by the number of posts in descending order
    const forumsWithMostPosts = await Forum.find()
      .sort({ posts: -1 }) // Sort by posts count (descending)
      .limit(10) // Limit to the top 10 forums with the most posts
      .populate("createdBy", "username") // Populate the username of the user who created the forum
      .populate("moderators", "username"); // Populate the usernames of the moderators

    // Return the forums with the most posts
    res.status(200).json({
      message: "Successfully fetched forums with the most posts",
      forums: forumsWithMostPosts,
    });
  } catch (error) {
    console.error("Error fetching forums with most posts:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getMostPopularMovies = async (req, res) => {
  try {
    // Fetch movies sorted by IMDb rating in descending order
    const mostPopularMovies = await Movie.find()
      .sort({ imdbRating: -1 }) // Sort by IMDb rating (descending)
      .limit(10) // Limit to the top 10 most popular movies
      .populate("director", "name") // Populate the name of the director
      .populate("cast", "name"); // Populate the names of the cast members

    // Return the most popular movies
    res.status(200).json({
      message: "Successfully fetched the most popular movies",
      movies: mostPopularMovies,
    });
  } catch (error) {
    console.error("Error fetching most popular movies:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
