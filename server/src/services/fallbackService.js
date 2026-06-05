const crypto = require('crypto');
const Button = require('../models/Button');
const { validateButton } = require('./sanitizer');
const templates = require('../utils/templates');

/**
 * If today's generation totally failed, clone yesterday's batch into a new batch
 * dated today so the "newest 25" always shows fresh on the front page.
 * If nothing exists at all (cold start), build 25 from local templates.
 */
async function buildFallbackBatch(count = 25) {
  const yesterdayBatch = await Button.find({ approved: true })
    .sort({ createdAt: -1 })
    .limit(count)
    .lean();

  const out = [];

  if (yesterdayBatch.length >= count) {
    for (const b of yesterdayBatch.slice(0, count)) {
      const uid = crypto.randomBytes(4).toString('hex');
      out.push({
        title: b.title,
        category: b.category,
        previewHTML: b.previewHTML.replace(/scope-[a-f0-9]+/g, `scope-${uid}`),
        previewCSS: b.previewCSS.replace(/scope-[a-f0-9]+/g, `scope-${uid}`)
                                 .replace(/-[a-f0-9]{8}\b/g, `-${uid}`),
        fullCode: b.fullCode,
        uid,
        source: 'fallback',
      });
    }
    return out;
  }

  // Cold start — build from templates
  while (out.length < count) {
    const tpl = templates.random();
    const uid = crypto.randomBytes(4).toString('hex');
    const res = validateButton(tpl, uid);
    if (res.ok) {
      res.value.source = 'fallback';
      out.push(res.value);
    }
  }
  return out;
}

module.exports = { buildFallbackBatch };
