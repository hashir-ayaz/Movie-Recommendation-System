const User = require("../models/User");
const auth = require("../utils/authUtils");
const Review = require("../models/Review");
const List = require("../models/List");
const mongoose = require("mongoose");
const {
  findUserById,
  findMovieById,
  findListById,
  handleError,
} = require("../utils/userUtils");

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");
    res.status(200).json({ users: allUsers });
  } catch (error) {
    handleError(res, error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await auth.comparePassword(
      password,
      user.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = auth.generateToken({ userId: user._id });
    return res.status(200).json({ user, token });
  } catch (error) {
    handleError(res, error);
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
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      email,
      password: await auth.hashPassword(password),
      username,
      profilePhoto,
      moviePreferences,
      personalWishlist,
    });

    await newUser.save();
    const token = auth.generateToken({ userId: newUser._id });
    return res.status(200).json({ user: newUser, token });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await findUserById(userId);
    Object.keys(req.body).forEach((key) => {
      if (user[key] !== undefined) user[key] = req.body[key];
    });

    await user.save();
    return res.status(200).json({ user });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await findUserById(userId);
    return res.status(200).json({ user });
  } catch (error) {
    handleError(res, error);
  }
};

// exports.addReview = async (req, res) => {
//   const { userId, movieId, reviewText, ratingValue } = req.body;

//   try {
//     await findUserById(userId);
//     await findMovieById(movieId);

//     const review = new Review({
//       user: userId,
//       movie: movieId,
//       reviewText,
//       ratingValue,
//     });
//     await review.save();

//     return res
//       .status(200)
//       .json({ review, message: "Review added successfully" });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

exports.addList = async (req, res) => {
  const { userId } = req.params;
  const { name, movies } = req.body;

  try {
    // Check if userId is a valid objectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await findUserById(userId);

    const list = new List({ name, owner: userId, movies });
    await list.save();

    user.lists.push(list._id);
    await user.save();

    return res.status(200).json({ list, message: "List added successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getUserLists = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if userId is a valid objectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).populate({
      path: "lists",
      populate: { path: "movies", model: "Movie" },
    });
    if (!user) throw new Error("User does not exist");

    return res.status(200).json({ userLists: user.lists });
  } catch (error) {
    handleError(res, error);
  }
};

exports.followList = async (req, res) => {
  const { userId, listId } = req.params;

  try {
    // Check if userId and listId are valid objectIds
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return res.status(400).json({ message: "Invalid list ID" });
    }
    const user = await findUserById(userId);
    const list = await findListById(listId);

    list.followers.push(userId);
    await list.save();

    user.followedLists.push(listId);
    await user.save();

    return res
      .status(200)
      .json({ list, message: "List followed successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

exports.addToWishlist = async (req, res) => {
  const { userId, movieId } = req.params;

  try {
    // Check if userId and movieId are valid objectIds
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const user = await findUserById(userId);
    await findMovieById(movieId);

    user.personalWishlist.push(movieId);
    await user.save();

    return res.status(200).json({ user, message: "Movie added to wishlist" });
  } catch (error) {
    handleError(res, error);
  }
};
