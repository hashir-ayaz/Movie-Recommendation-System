const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Reminder = require("../models/Reminder");
const Movie = require("../models/Movie");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const reminderService = () => {
  console.log("Starting reminder service...");

  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running daily reminder check...");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const reminders = await Reminder.find({
        reminderDate: today,
        sent: false,
      })
        .populate("user", "email username")
        .populate("movie", "title");

      for (const reminder of reminders) {
        const { user, movie } = reminder;

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Reminder: ${movie.title} is releasing tomorrow!`,
          text: `Hello ${user.username},\n\nThis is a friendly reminder that the movie "${movie.title}" is releasing tomorrow. Don't miss it!\n\nBest regards,\nMovie App Team`,
        };

        await transporter.sendMail(mailOptions);
        reminder.sent = true;
        await reminder.save();
        console.log(`Reminder sent to ${user.email} for movie: ${movie.title}`);
      }

      console.log("Daily reminder check completed.");
    } catch (error) {
      console.error("Error running daily reminder check:", error);
    }
  });
};

module.exports = reminderService;
