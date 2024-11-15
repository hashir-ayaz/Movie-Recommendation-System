const mongoose = require("mongoose");
const moviesData = require("./sampleMovies.json");
const Movie = require("./models/Movie");
require("dotenv").config();

// MongoDB connection URI
const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.nw4lxia.mongodb.net/${process.env.MONGO_DATABASE}`;

async function insertMovies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Insert movies into the database
    await Movie.insertMany(moviesData);
    console.log("Movies inserted successfully");
  } catch (err) {
    console.error("Error inserting movies:", err);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

insertMovies();
