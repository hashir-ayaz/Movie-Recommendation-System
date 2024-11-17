const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const articleRoutes = require("./routes/articleRoutes");
const forumRoutes = require("./routes/forumRoutes");
const actorDirectorCrewRoutes = require("./routes/actordirectorcrewRoutes");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(cors());

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/forums", forumRoutes);
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/actor-director-crew", actorDirectorCrewRoutes);

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
