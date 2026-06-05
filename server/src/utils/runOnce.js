/**
 * Manually trigger one daily generation (useful for testing).
 * Run: npm run generate:once
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { runDailyGeneration } = require('../jobs/dailyGenerator');

(async () => {
  await connectDB();
  await runDailyGeneration();
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
