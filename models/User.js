const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  moviePreferences: {
    genre: [String],
    director: [String],
    actor: [String],
  },
  personalWishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profilePhoto: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  lists: [
    {
      type: Schema.Types.ObjectId,
      ref: "List",
    },
  ],
  followedLists: [
    {
      type: Schema.Types.ObjectId,
      ref: "List",
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
