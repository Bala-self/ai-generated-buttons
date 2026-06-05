const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');
const { validateButton } = require('./sanitizer');
const { CATEGORIES } = require('../models/Button');
const templates = require('../utils/templates');

const SYSTEM_PROMPT = `You are a SENIOR CREATIVE TECHNOLOGIST at a top-tier design studio (think Apple, Linear, Vercel, Stripe).
Your job: design {N} animated CSS buttons that look like they belong on $50M product launch sites.

🚨 NON-NEGOTIABLE RULES:
1. Every button MUST look visually distinct — no two share vibe, palette, shape, or animation pattern.
2. NEVER reuse any title, label text, color combination, or effect twice in this batch.
3. Each button must feel PREMIUM — like a paid product, not a CodePen demo.
4. CSS only. No url(), no @import, no position:fixed, no scripts, no inline events.

🎨 ROTATE THROUGH THESE DESIGN LANGUAGES (different one per button):
Glassmorphism, Neumorphism, Brutalism, Material Design 3, Cyberpunk Neon, Holographic,
Liquid/Gooey, Skeuomorphic premium, Minimalist Swiss, Y2K Vaporwave, Bento Soft modern,
Aurora, Magnetic hover, Glitch, Tactile 3D.

✨ EFFECTS TOOLKIT (use 2-4 per button):
conic gradients with rotation, backdrop-filter blur+saturate, filter drop-shadow halos,
clip-path polygon shapes, animated background-position, ::before/::after glow auras &
shimmer sweeps, inset+outer box-shadow embossing, text-shadow chains for neon/glitch,
perspective tilt, @keyframes (breathe, pulse, shimmer, float, glitch, aurora, ripple),
cubic-bezier springs, letter-spacing animations, mix-blend-mode, stacked gradients.

🎯 SHAPES (rotate): pill, rounded-md, rounded-xl, sharp 2px, asymmetric corners,
clip-path pentagon/parallelogram, circle icon button.
📏 SIZES (rotate): xs / sm / md / lg / xl hero CTA.

🏷️ LABELS — NEVER reuse within batch. Mix contexts:
"Get Started", "Book a Demo", "Buy Now", "Subscribe", "Follow", "Watch Trailer",
"Download", "Save", "Sign in with Apple", "Go Premium", "🚀 Launch", "✨ Surprise",
"Processing…" (disabled), "Saving…" (loading), "✓ Saved!" (success), "✕ Delete Forever" (destructive).
Include at least one disabled, loading, success, and destructive state in every batch.

🎨 COLORS: every button needs a UNIQUE color story. Mix solid, 2-stop, 3-stop, conic, radial.
Include 1-2 monochrome (black/white/grey). Use both saturated (electric blue, hot pink, lime,
violet) and muted designer palettes (slate, indigo, rose, emerald).

🧬 OBJECT SHAPE:
{
  "title": "Distinctive name",
  "category": one of ${CATEGORIES.map((c) => `"${c}"`).join(', ')},
  "html": "<button class=\\"btn\\">...</button>",
  "css": ".btn { ... } .btn:hover { ... } .btn::before { ... } @keyframes name { ... }"
}

🔥 QUALITY BAR: if it looks like a tutorial, redesign. If two buttons look siblings,
diversify. Every button must make a designer say "ooh, that's nice".

OUTPUT: ONLY a JSON array of {N} objects. No markdown fences. No commentary.`;

function safeParseJSON(text) {
  const cleaned = text
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      try { return JSON.parse(cleaned.slice(start, end + 1)); }
      catch { return null; }
    }
    return null;
  }
}

async function callGemini(count) {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    generationConfig: {
      temperature: 1.15,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  });

  const prompt = SYSTEM_PROMPT.replace(/\{N\}/g, count);
  const res = await model.generateContent(prompt);
  const text = res.response.text();
  const json = safeParseJSON(text);
  if (!Array.isArray(json)) throw new Error('Gemini did not return JSON array');
  return json;
}

/**
 * Generate `count` validated buttons. Falls back to templates if AI fails.
 * De-duplicates titles + labels within the batch.
 */
async function generateButtons(count = 25) {
  const accepted = [];
  const errors = [];
  const seenTitles = new Set();
  const seenLabels = new Set();

  try {
    const raw = await callGemini(count);
    for (const item of raw) {
      const uid = crypto.randomBytes(4).toString('hex');
      const result = validateButton(item, uid);
      if (!result.ok) { errors.push(result.reason); continue; }

      const titleKey = (result.value.title || '').toLowerCase().trim();
      const labelMatch = (item.html || '').match(/>([^<]+)</);
      const labelKey = labelMatch ? labelMatch[1].toLowerCase().trim() : '';
      if (titleKey && seenTitles.has(titleKey)) { errors.push('duplicate-title'); continue; }
      if (labelKey && seenLabels.has(labelKey)) { errors.push('duplicate-label'); continue; }
      seenTitles.add(titleKey);
      if (labelKey) seenLabels.add(labelKey);

      accepted.push(result.value);
      if (accepted.length >= count) break;
    }
  } catch (err) {
    errors.push(`gemini-error: ${err.message}`);
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
