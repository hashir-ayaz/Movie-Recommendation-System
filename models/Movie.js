const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: false,
    trim: true,
  },
  genre: [
    {
      type: String,
      required: [true, "Genre is required"],
    },
  ],
  director: {
    type: String,
    required: [true, "Director is required"],
  },
  cast: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Cast member ID is required"],
      ref: "Actor",
    },
  ],
  releaseDate: {
    type: Date,
    required: [true, "Release date is required"],
  },
  runtime: {
    type: Number,
    required: [true, "Runtime is required"],
  },
  synopsis: {
    type: String,
    required: [true, "Synopsis is required"],
  },
  averageRating: {
    type: Number,
    required: [true, "Average rating is required"],
  },
  coverPhoto: {
    type: String,
    required: [true, "Cover photo URL is required"],
  },
  trivia: [
    {
      type: String,
    },
  ],
  goofs: [
    {
      type: String,
    },
  ],
  soundtrack: {
    type: String,
  },
  ageRating: {
    type: Number,
    required: [true, "Age rating is required"],
  },
  parentalGuidance: {
    type: String,
    required: [true, "Parental guidance information is required"],
  },
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
