const crypto = require('crypto');
const { validateButton } = require('./sanitizer');
const { CATEGORIES } = require('../models/Button');
const templates = require('../utils/templates');

const SYSTEM_PROMPT = `You are a world-class UI engineer designing a daily showcase of CSS buttons.
Generate EXACTLY {N} buttons as a JSON array. Each object MUST have:
- "title": short distinctive name (max 60 chars) — never reuse a title in this batch
- "category": one of ${CATEGORIES.map((c) => `"${c}"`).join(', ')}
- "html": a single <button class="btn">...</button> (no scripts, no inline events, no style attr)
- "css": CSS for .btn (optional :hover, :active, :focus, ::before, ::after, @keyframes)

VARIETY (across the {N} buttons): mix shapes (pill/rounded/square/asymmetric),
sizes (sm/md/lg/xl), colors (solid/gradient/transparent), effects (scale/glow/ripple/shine/slide/jelly/skew),
content (text only / icon+text / emoji / arrow), states (1 disabled, 1 loading, 1 success, 1 error).
Vary labels: "Get Started", "Subscribe", "Launch", "Like", "Saved", "Download", "Continue"…
Never repeat the same label twice in this batch.

CSS RULES: only visual/animation properties; NO url(), NO @import, NO position:fixed, NO scripts.
Always include a transition on :hover.

Return ONLY the JSON array — no markdown fences, no commentary.`;

function safeParseJSON(text) {
  const cleaned = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(cleaned); }
  catch {
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { return null; }
    }
    return null;
  }
}

async function callGroq(count) {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY missing');

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT.replace('{N}', count) },
        { role: 'user', content: `Generate ${count} animated CSS buttons now.` },
      ],
      temperature: 1.0,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) throw new Error(`Groq HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';

  let parsed = safeParseJSON(text);
  if (parsed && !Array.isArray(parsed)) {
    parsed = parsed.buttons || parsed.data || parsed.items || Object.values(parsed)[0];
  }
  if (!Array.isArray(parsed)) throw new Error('Groq did not return a JSON array');
  return parsed;
}

async function generateButtons(count = 25) {
  const accepted = [];
  const errors = [];

  try {
    const raw = await callGroq(count);
    for (const item of raw) {
      const uid = crypto.randomBytes(4).toString('hex');
      const result = validateButton(item, uid);
      if (result.ok) accepted.push(result.value);
      else errors.push(result.reason);
      if (accepted.length >= count) break;
    }
  } catch (err) {
    errors.push(`groq-error: ${err.message}`);
  }

  while (accepted.length < count) {
    const tpl = templates.random();
    const uid = crypto.randomBytes(4).toString('hex');
    const result = validateButton(tpl, uid);
    if (result.ok) {
      result.value.source = 'fallback';
      accepted.push(result.value);
    } else break;
  }

  return { buttons: accepted.slice(0, count), errors };
}

module.exports = { generateButtons };
