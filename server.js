const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");
const reminderService = require("./services/reminderService");

// Environment Variables
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Start the reminder service
  reminderService();
});
