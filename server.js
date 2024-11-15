const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(cors());

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/movies", movieRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
