const User = require("../models/User");
const Movie = require("../models/Movie");
const List = require("../models/List");

/**
 * Find user by ID.
 */
async function findUserById(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User does not exist");
  return user;
}

/**
 * Find movie by ID.
 */
async function findMovieById(movieId) {
  const movie = await Movie.findById(movieId);
  if (!movie) throw new Error("Movie does not exist");
  return movie;
}

/**
 * Find list by ID.
 */
async function findListById(listId) {
  const list = await List.findById(listId);
  if (!list) throw new Error("List does not exist");
  return list;
}

/**
 * Handle errors and send response.
 */
function handleError(res, error) {
  return res.status(500).json({ message: error.message });
}

module.exports = {
  findUserById,
  findMovieById,
  findListById,
  handleError,
};
