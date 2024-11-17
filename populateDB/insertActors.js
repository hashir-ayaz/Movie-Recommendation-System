const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const ActorDirectorCrew = require("../models/ActorDirectorCrew"); // Adjust the path if needed
dotenv.config();

// MongoDB connection URI from the .env file
const MONGO_URI = `mongodb+srv://hashirayaz:jY1p6KbvePHFfWLc@cluster0.nw4lxia.mongodb.net/movierecommendation`;
console.log(MONGO_URI);
// Read the JSON file containing the actor/director data
const actorsFilePath = "./actors-directors.json"; // Replace with your file's path
let actorsData;

try {
  const fileContent = fs.readFileSync(actorsFilePath, "utf-8");
  actorsData = JSON.parse(fileContent);
} catch (error) {
  console.error("Error reading or parsing the actors JSON file:", error);
  process.exit(1);
}

// Function to connect to MongoDB and insert actors
const insertActors = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Insert actors into the ActorDirectorCrew collection
    const insertedActors = await ActorDirectorCrew.insertMany(actorsData);
    console.log(
      `${insertedActors.length} actors/directors inserted successfully`
    );

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error inserting actors into MongoDB:", error);
  }
};

// Execute the insertion function
insertActors();
