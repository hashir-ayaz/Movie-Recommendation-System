const Article = require("../models/Article");
const Movie = require("../models/Movie");
const Actor = require("../models/Actor");

// Fetch all articles
exports.getAllArticles = async (req, res) => {
  try {
    const { category, tags, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(",") };

    const articles = await Article.find(filter)
      .sort({ publishedAt: -1 }) // Newest articles first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalArticles = await Article.countDocuments(filter);

    res.status(200).json({
      articles,
      pagination: {
        total: totalArticles,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalArticles / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch a single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("relatedMovies", "title genre releaseDate")
      .populate("relatedActors", "name biography");

    if (!article) return res.status(404).json({ message: "Article not found" });

    res.status(200).json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      relatedMovies,
      relatedActors,
      coverImage,
    } = req.body;

    const newArticle = new Article({
      title,
      content,
      category,
      tags,
      relatedMovies,
      relatedActors,
      coverImage,
      author: req.user._id,
    });

    const savedArticle = await newArticle.save();

    res.status(201).json({
      message: "Article created successfully",
      article: savedArticle,
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an article
exports.updateArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      relatedMovies,
      relatedActors,
      coverImage,
    } = req.body;

    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Ensure only the author or admin can update
    if (String(article.author) !== String(req.user._id) && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this article" });
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.category = category || article.category;
    article.tags = tags || article.tags;
    article.relatedMovies = relatedMovies || article.relatedMovies;
    article.relatedActors = relatedActors || article.relatedActors;
    article.coverImage = coverImage || article.coverImage;

    const updatedArticle = await article.save();

    res.status(200).json({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Ensure only the author or admin can delete
    if (String(article.author) !== String(req.user._id) && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this article" });
    }

    await article.remove();

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search articles by title or content
exports.searchArticles = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query)
      return res.status(400).json({ message: "Query parameter is required" });

    const articles = await Article.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error searching articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Increment the view count for an article
exports.incrementViewCount = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    article.views += 1;
    await article.save();

    res
      .status(200)
      .json({ message: "View count updated", views: article.views });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
