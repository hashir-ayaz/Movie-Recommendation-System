const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    category: {
      type: String,
      enum: ["Movies", "Actors", "Upcoming Projects", "Industry Updates"],
      required: [true, "Category is required"],
    },
    tags: [
      {
        type: String, // Tags for filtering and searching (e.g., "Drama", "Leonardo DiCaprio")
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link to the user/admin who created the article
      required: [true, "Author is required"],
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    coverImage: {
      type: String, // URL to a cover image for the article
      default: "",
    },
    views: {
      type: Number, // Track the number of views the article receives
      default: 0,
    },
    isPublished: {
      type: Boolean, // Flag to indicate whether the article is published
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
