const Reminder = require("../models/Reminder");
const Movie = require("../models/Movie");

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const { movieId } = req.body; // Expecting movieId in the request body

    // Find the movie by ID
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if the movie has already been released
    const currentDate = new Date();
    if (movie.releaseDate < currentDate) {
      return res
        .status(400)
        .json({ message: "Movie has already been released." });
    }

    // Calculate reminder date as one day before the release date
    const reminderDate = new Date(movie.releaseDate);
    reminderDate.setDate(reminderDate.getDate() - 1);

    // Create a new reminder
    const newReminder = new Reminder({
      user: req.user._id, // Set user from the authenticated request
      movie: movieId,
      reminderDate,
    });

    // Save the reminder
    const savedReminder = await newReminder.save();

    // Populate user name and movie title
    const populatedReminder = await Reminder.findById(savedReminder._id)
      .populate("user", "username") // Adjust field name if `username` is not correct
      .populate("movie", "title");

    res.status(201).json({
      message: "Reminder created successfully",
      reminder: populatedReminder,
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an existing reminder
exports.updateReminder = async (req, res) => {
  try {
    const { id } = req.params; // Reminder ID
    const { movieId } = req.body;

    // Find the reminder by ID
    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    // Check if the movie exists and calculate reminderDate
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if the movie has already been released
    const currentDate = new Date();
    if (movie.releaseDate < currentDate) {
      return res
        .status(400)
        .json({ message: "Movie has already been released." });
    }

    // Calculate reminder date as one day before the release date
    const reminderDate = new Date(movie.releaseDate);
    reminderDate.setDate(reminderDate.getDate() - 1);

    // Update the reminder
    reminder.movie = movieId || reminder.movie;
    reminder.reminderDate = reminderDate;

    const updatedReminder = await reminder.save();

    res.status(200).json({
      message: "Reminder updated successfully",
      reminder: updatedReminder,
    });
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params; // Reminder ID

    // Find and delete the reminder
    const reminder = await Reminder.findByIdAndDelete(id);
    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
