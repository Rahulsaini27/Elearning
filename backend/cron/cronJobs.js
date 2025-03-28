const cron = require("node-cron");
const User = require("../Models/UserModel");

// Cron job runs every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("Running streak maintenance job...");

  try {
    const today = new Date();

    // Get all users
    const users = await User.find();

    for (let user of users) {
      if (user.lastLogin) {
        const lastLoginDate = new Date(user.lastLogin);
        const diffInDays = Math.floor((today - lastLoginDate) / (1000 * 60 * 60 * 24));

        if (diffInDays > 1) {
          user.streak = 0; // Reset streak if they missed a day
          await user.save();
          console.log(`Streak reset for user: ${user.email}`);
        }
      }
    }

    console.log("Streak maintenance job completed.");
  } catch (error) {
    console.error("Error in streak maintenance job:", error);
  }
});
