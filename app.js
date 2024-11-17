const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const articleRoutes = require("./routes/articleRoutes");
const forumRoutes = require("./routes/forumRoutes");
const actorDirectorCrewRoutes = require("./routes/actordirectorcrewRoutes");
const errorHandler = require("./middleware/errorHandler");
const reminderRoutes = require("./routes/reminderRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/forums", forumRoutes);
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/actor-director-crew", actorDirectorCrewRoutes);
app.use("/api/v1/reminders", reminderRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
