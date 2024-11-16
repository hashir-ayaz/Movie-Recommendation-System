const cron = require("node-cron");
const Reminder = require("./models/Reminder");
const User = require("./models/User");
const { sendEmail } = require("./utils/email"); // Utility to send email notifications

cron.schedule("0 9 * * *", async () => {
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      reminderDate: { $lte: now },
    }).populate("movie user");

    for (const reminder of reminders) {
      const { user, movie, notificationType } = reminder;

      if (notificationType === "email") {
        await sendEmail(
          user.email,
          `Reminder: ${movie.title} is releasing tomorrow!`,
          `Don't forget to watch ${movie.title}, which releases on ${movie.releaseDate}.`
        );
      }

      // Handle dashboard notifications
      if (notificationType === "dashboard") {
        // Add logic to send dashboard notifications
        console.log(
          `Dashboard notification for ${user.email}: ${movie.title} is releasing tomorrow!`
        );
      }

      // Remove the reminder after notification
      await Reminder.findByIdAndDelete(reminder._id);
    }

    console.log("Reminders processed successfully");
  } catch (error) {
    console.error("Error processing reminders:", error);
  }
});
