const Forum = require("../models/Forum");
const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");

// Forum Controllers
exports.getAllForums = async (req, res) => {
  try {
    const forums = await Forum.find();
    res.status(200).json({ forums });
  } catch (error) {
    console.error("Error fetching forums:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createForum = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newForum = new Forum({
      name,
      description,
      createdBy: req.user._id,
    });

    await newForum.save();
    res
      .status(201)
      .json({ message: "Forum created successfully", forum: newForum });
  } catch (error) {
    console.error("Error creating forum:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getForumById = async (req, res) => {
  const { forumId } = req.params;

  try {
    if (!mongoose.isValidObjectId(forumId)) {
      return res.status(400).json({
        message: "Invalid Forum ID. Please provide a valid ObjectId.",
      });
    }

    const forum = await Forum.findById(forumId).populate("posts");
    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    res.status(200).json({ forum });
  } catch (error) {
    console.error(`Error fetching forum with ID ${forumId}:`, error.message);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

exports.updateForum = async (req, res) => {
  const { forumId } = req.params;
  const { name, description } = req.body;

  try {
    const forum = await Forum.findByIdAndUpdate(
      forumId,
      { name, description },
      { new: true }
    );

    if (!forum) return res.status(404).json({ message: "Forum not found" });

    res.status(200).json({ message: "Forum updated successfully", forum });
  } catch (error) {
    console.error("Error updating forum:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteForum = async (req, res) => {
  const { forumId } = req.params;

  try {
    const forum = await Forum.findByIdAndDelete(forumId);
    if (!forum) return res.status(404).json({ message: "Forum not found" });

    res.status(200).json({ message: "Forum deleted successfully" });
  } catch (error) {
    console.error("Error deleting forum:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Post Controllers
exports.getAllPostsInForum = async (req, res) => {
  const { forumId } = req.params;

  try {
    const posts = await Post.find({ forum: forumId }).populate("createdBy");
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addPostToForum = async (req, res) => {
  const { forumId } = req.params;
  const { title, content } = req.body;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) return res.status(404).json({ message: "Forum not found" });

    const newPost = new Post({
      title,
      content,
      forum: forumId,
      createdBy: req.user._id,
    });

    const savedPost = await newPost.save();

    forum.posts.push(savedPost._id);
    await forum.save();

    res
      .status(201)
      .json({ message: "Post added successfully", post: savedPost });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    // check if post id is a valid object id
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        message: "Invalid Post ID. Please provide a valid ObjectId.",
      });
    }
    const post = await Post.findById(postId).populate("createdBy");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    // check if post id is a valid object id
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        message: "Invalid Post ID. Please provide a valid ObjectId.",
      });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.createdBy) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You can only update your own posts" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    // check if post id is a valid object id
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({
        message: "Invalid Post ID. Please provide a valid ObjectId.",
      });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.createdBy) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User Engagement
exports.upvotePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.upvotes.includes(req.user._id)) {
      post.upvotes.push(req.user._id);
      post.downvotes = post.downvotes.filter(
        (id) => String(id) !== String(req.user._id)
      ); // Remove from downvotes if exists
    }

    await post.save();
    res.status(200).json({ message: "Post upvoted successfully", post });
  } catch (error) {
    console.error("Error upvoting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.downvotePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.downvotes.includes(req.user._id)) {
      post.downvotes.push(req.user._id);
      post.upvotes = post.upvotes.filter(
        (id) => String(id) !== String(req.user._id)
      ); // Remove from upvotes if exists
    }

    await post.save();
    res.status(200).json({ message: "Post downvoted successfully", post });
  } catch (error) {
    console.error("Error downvoting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.joinForum = async (req, res) => {
  const { forumId } = req.params;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) return res.status(404).json({ message: "Forum not found" });

    if (!forum.members.includes(req.user._id)) {
      forum.members.push(req.user._id);
      await forum.save();
    }

    res.status(200).json({ message: "Joined forum successfully", forum });
  } catch (error) {
    console.error("Error joining forum:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.leaveForum = async (req, res) => {
  const { forumId } = req.params;

  try {
    const forum = await Forum.findById(forumId);
    if (!forum) return res.status(404).json({ message: "Forum not found" });

    forum.members = forum.members.filter(
      (memberId) => String(memberId) !== String(req.user._id)
    );
    await forum.save();

    res.status(200).json({ message: "Left forum successfully", forum });
  } catch (error) {
    console.error("Error leaving forum:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
