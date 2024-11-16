// user controller
const User = require("../models/User");
const auth = require("../utils/authentication");
const Review = require("../models/Review");
const Movie = require("../models/Movie");
const List = require("../models/List");

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");
    res.status(200).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // try to find user with this email
    const user = await User.findOne({ email });
    // if user not found, return error
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // if user found, check if password is correct
    const isPasswordCorrect = await auth.comparePassword(
      password,
      user.password
    );
    // if password is incorrect, return error
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // if password is correct, generate token
    const token = auth.generateToken({
      userId: user._id,
    });
    // return user and token
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  const {
    email,
    password,
    username,
    profilePhoto,
    moviePreferences,
    personalWishlist,
  } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ email, username });
    // if user exists, return error
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // if user does not exist, create user
    const newUser = new User({
      email,
      password,
      username,
      profilePhoto,
      moviePreferences,
      personalWishlist,
    });
    // hash password
    newUser.password = await auth.hashPassword(password);
    // save user
    await newUser.save();
    // generate token
    const token = auth.generateToken({ userId: newUser._id });
    // return user and token
    return res.status(200).json({ user: newUser, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if user exists
    const user = await User.findById(userId);

    // If user does not exist, return error
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Iterate over request body keys and update only the provided fields
    Object.keys(req.body).forEach((key) => {
      if (user[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    // Save updated user
    await user.save();

    // Return updated user
    return res.status(200).json({ user });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { userId, movieId, reviewText, ratingValue } = req.body;

  try {
    const user = await User.findById(userId);

    // check if user exists
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(400).json({ message: "Movie does not exist" });
    }

    // create review
    const review = new Review({
      user: userId,
      movie: movieId,
      reviewText,
      ratingValue,
    });

    // save review
    await review.save();
    return res
      .status(200)
      .json({ review: review, message: "Review added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addList = async (req, res) => {
  const { userId } = req.params;
  const { name, movies } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const list = new List({
      name,
      owner: userId,
      movies,
    });

    await list.save();

    user.lists.push(list._id);
    await user.save();

    return res.status(200).json({ list, message: "List added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUserLists = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({
      path: "lists",
      populate: {
        path: "movies", // Populate the movies field in the lists
        model: "Movie", // Reference to the Movie model
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    return res.status(200).json({ userLists: user.lists });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.followList = async (req, res) => {
  const { userId, listId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(400).json({ message: "List does not exist" });
    }

    list.followers.push(userId);
    await list.save();

    user.followedLists.push(listId);
    await user.save();

    return res
      .status(200)
      .json({ list, message: "List followed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
