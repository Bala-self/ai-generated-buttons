const cron = require('node-cron');
const Button = require('../models/Button');
const { generateButtons } = require('../services/aiProvider');
const { buildFallbackBatch } = require('../services/fallbackService');

function todayYMD() {
  return new Date().toISOString().slice(0, 10);
}

async function runDailyGeneration() {
  const batchDate = todayYMD();
  const count = Number(process.env.DAILY_BATCH_SIZE || 25);
  console.log(`🤖 [${batchDate}] Generating ${count} buttons...`);

  let batch = [];
  let usedFallback = false;
  try {
    const result = await generateButtons(count);
    batch = result.buttons;
    if (result.errors.length) {
      console.warn(`⚠️ ${result.errors.length} items rejected:`, result.errors.slice(0, 5));
    }
  } catch (err) {
    console.error('❌ Gemini failure:', err.message);
  }

  if (batch.length < count) {
    console.warn('↩️  Topping up from fallback...');
    const extra = await buildFallbackBatch(count - batch.length);
    batch = [...batch, ...extra];
    usedFallback = true;
  }

  const docs = batch.map((b) => ({ ...b, batchDate }));
  const inserted = await Button.insertMany(docs, { ordered: false });
  console.log(
    `✅ Inserted ${inserted.length} buttons (fallback used: ${usedFallback})`
  );
  return inserted;
}

function startDailyCron() {
  const schedule = process.env.CRON_SCHEDULE || '5 0 * * *';
  if (!cron.validate(schedule)) {
    console.warn('⚠️ Invalid CRON_SCHEDULE, skipping cron.');
    return;
  }
  cron.schedule(schedule, () => {
    runDailyGeneration().catch((e) => console.error('Cron run failed:', e));
  });
  console.log(`⏰ Cron scheduled: ${schedule}`);
}

module.exports = startDailyCron;
module.exports.runDailyGeneration = runDailyGeneration;
