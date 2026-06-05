require('dotenv').config();
const connectDB = require('../config/db');
const Button = require('../models/Button');

(async () => {
  await connectDB();
  const count = await Button.countDocuments();
  console.log(`📊 Found ${count} buttons in the database`);

  if (count === 0) {
    console.log('✨ Already empty, nothing to do');
    process.exit(0);
  }

  const result = await Button.deleteMany({});
  console.log(`🗑️  Deleted ${result.deletedCount} buttons`);
  console.log('✅ Database cleared — run `npm run seed` or `npm run generate:once` next');
  process.exit(0);
})().catch((e) => {
  console.error('❌ Reset failed:', e.message);
  process.exit(1);
});
