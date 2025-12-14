import cron from "node-cron";
import User from "../models/User.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running inactive user cleanup job");

  const DAYS_180 = 180 * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - DAYS_180);

  const result = await User.deleteMany({
    lastLogin: { $lt: cutoffDate }
  });

  console.log(`Deleted ${result.deletedCount} inactive users`);
});
