const mongoose = require('mongoose');

const CATEGORIES = [
  'hover',
  'gradient',
  '3d',
  'neon',
  'glassmorphism',
  'ripple',
  'morph',
  'outline',
  'social',
  'loader',
];

const ButtonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    // HTML used for the live preview (sanitized)
    previewHTML: { type: String, required: true },
    // CSS used for the live preview (sanitized + scoped via uid)
    previewCSS: { type: String, required: true },
    // Full snippet (HTML + CSS) that the user can copy/download
    fullCode: { type: String, required: true },
    uid: { type: String, required: true, unique: true }, // scope id for CSS
    source: { type: String, enum: ['ai', 'fallback', 'seed', 'manual'], default: 'ai' },
    approved: { type: Boolean, default: true },
    likes: { type: Number, default: 0, index: true },
    cartAdds: { type: Number, default: 0 },
    batchDate: { type: String, index: true }, // YYYY-MM-DD
  },
  { timestamps: true }
);

ButtonSchema.index({ createdAt: -1 });
ButtonSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Button', ButtonSchema);
module.exports.CATEGORIES = CATEGORIES;
