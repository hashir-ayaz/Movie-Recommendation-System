const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReminderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the user who set the reminder
    required: true,
  },
  movie: {
    type: Schema.Types.ObjectId,
    ref: "Movie", // Reference to the movie the reminder is set for
    required: true,
  },
  reminderDate: {
    type: Date, // The date when the reminder should be triggered
    required: true,
  },
  notificationSent: {
    type: Boolean, // Whether the notification has already been sent
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reminder = mongoose.model("Reminder", ReminderSchema);

module.exports = Reminder;
