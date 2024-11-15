// user controller
const User = require("../models/User");
const auth = require("../utils/authentication");

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
    const token = auth.generateToken();
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
  const { email, username, profilePhoto, moviePreferences, personalWishlist } =
    req.body;

  try {
    // check if user exists
    const user = await User.findById(userId);
    // if user does not exist, return error
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // if user exists, update user
    user.email = email;
    user.username = username;
    user.profilePhoto = profilePhoto;
    user.moviePreferences = moviePreferences;
    user.personalWishlist = personalWishlist;
    // save user
    await user.save();
    // return updated user
    return res.status(200).json({ user });
  } catch (error) {
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
