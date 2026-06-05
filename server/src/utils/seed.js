/**
 * Seed the database with 25 starter buttons from local templates.
 * Run: npm run seed
 */
require('dotenv').config();
const crypto = require('crypto');
const connectDB = require('../config/db');
const Button = require('../models/Button');
const templates = require('./templates');
const { validateButton } = require('../services/sanitizer');

function todayYMD() {
  return new Date().toISOString().slice(0, 10);
}

(async () => {
  await connectDB();
  const batchDate = todayYMD();
  const docs = [];
  for (let i = 0; i < 25; i++) {
    const tpl = templates.random();
    const uid = crypto.randomBytes(4).toString('hex');
    const r = validateButton(tpl, uid);
    if (r.ok) {
      docs.push({ ...r.value, source: 'seed', batchDate });
    }
  }
  const out = await Button.insertMany(docs);
  console.log(`✅ Seeded ${out.length} buttons for ${batchDate}`);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
