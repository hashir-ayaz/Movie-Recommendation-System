const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    // unique: false,
    trim: true,
  },
  genre: [
    {
      type: String,
      required: [true, "Genre is required"],
    },
  ],
  director: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "ActorDirectorCrew",
  },
  cast: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "ActorDirectorCrew",
    },
  ],
  imdbRating: {
    type: Number,
    required: [true, "IMDB rating is required"],
    unique: false,
  },
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
    required: [false],
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
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  // Box Office Information
  boxOffice: {
    openingWeekend: {
      type: Number, // Earnings in dollars
      default: 0,
    },
    totalDomestic: {
      type: Number, // Total domestic revenue
      default: 0,
    },
    totalInternational: {
      type: Number, // Total international revenue
      default: 0,
    },
    totalWorldwide: {
      type: Number, // Total worldwide revenue (calculated from domestic + international)
      default: 0,
    },
  },
  // Awards and Nominations
  awards: [
    {
      name: { type: String, required: true }, // Award name (e.g., Oscars, Golden Globes)
      category: { type: String, required: true }, // Category (e.g., Best Actor, Best Picture)
      year: { type: Number, required: true }, // Year the award was received or nominated
      won: { type: Boolean, required: true }, // Whether the award was won
    },
  ],
  // Additional Fields for Advanced Filtering
  countryOfOrigin: {
    type: String, // E.g., "United States", "India", "France"
    required: true,
  },
  language: {
    type: String, // E.g., "English", "French", "Spanish"
    required: true,
  },
  keywords: [
    {
      type: String, // Keywords for advanced filtering (e.g., "based on a true story", "superhero")
    },
  ],
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
