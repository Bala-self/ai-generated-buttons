/**
 * Hand-crafted, trusted fallback button templates.
 * Used when AI generation fails or returns < N valid items.
 * Each generator returns { title, category, html, css } in the same shape
 * Gemini is asked to produce — so it goes through the same validator.
 *
 * Variety axes:
 *  - Shape:       rounded, pill, square, sharp, asymmetric
 *  - Size:        sm, md, lg, xl
 *  - Color:       solid, gradient (2-3 stops), transparent+border, dark/light
 *  - Effect:      hover-scale, glow, ripple, slide, shine, flip-text, jelly, push
 *  - Content:     text only, icon+text, emoji, with arrow
 *  - State:       default, disabled, loading, success, error
 *  - Animation:   pulse, bounce, wobble, shake, rotate, breathe
 */

// 24 vibrant palette pairs
const palettes = [
  ['#6366f1', '#ec4899'],   ['#0ea5e9', '#22d3ee'],
  ['#f59e0b', '#ef4444'],   ['#10b981', '#06b6d4'],
  ['#8b5cf6', '#f43f5e'],   ['#14b8a6', '#84cc16'],
  ['#f97316', '#facc15'],   ['#3b82f6', '#a855f7'],
  ['#06b6d4', '#3b82f6'],   ['#ec4899', '#f97316'],
  ['#22c55e', '#eab308'],   ['#d946ef', '#6366f1'],
  ['#ef4444', '#f59e0b'],   ['#0891b2', '#0d9488'],
  ['#7c3aed', '#2563eb'],   ['#db2777', '#9333ea'],
  ['#059669', '#0284c7'],   ['#dc2626', '#7c2d12'],
  ['#1e293b', '#475569'],   ['#fbbf24', '#f97316'],
  ['#a78bfa', '#67e8f9'],   ['#fb7185', '#fbbf24'],
  ['#34d399', '#60a5fa'],   ['#f472b6', '#c084fc'],
];

// 60+ varied button labels across many contexts
const labels = [
  // CTAs
  'Get Started', 'Try Free', 'Sign Up', 'Join Now', 'Start Trial', 'Book Demo',
  // Commerce
  'Buy Now', 'Add to Cart', 'Checkout', 'Order Now', 'Shop Now', 'Subscribe',
  // Content
  'Learn More', 'Read More', 'Explore', 'Discover', 'See Details', 'View All',
  // Actions
  'Download', 'Upload', 'Save', 'Submit', 'Send', 'Share', 'Continue', 'Confirm',
  // Social
  'Follow', 'Like', 'Connect', 'Message', 'Invite', 'Share Now',
  // Media
  'Watch Now', 'Play', 'Listen', 'Stream', 'Pause', 'Replay',
  // Account
  'Sign In', 'Log Out', 'Register', 'Profile', 'Settings', 'Account',
  // Navigation
  'Next', 'Previous', 'Back', 'Home', 'Menu', 'Skip',
  // Marketing
  'Claim Offer', 'Get Coupon', 'Redeem', 'Upgrade', 'Go Pro', 'Unlock',
  // Casual / Fun
  'Hello 👋', 'Let\'s Go', 'Yes!', 'Tap Me', '🚀 Launch', 'Hit Me',
];

// Sizes: padding · font-size · border-radius
const sizes = {
  sm: { pad: '8px 18px',  fs: '13px', bigRadius: '999px', smRadius: '6px', sqRadius: '0' },
  md: { pad: '12px 28px', fs: '15px', bigRadius: '999px', smRadius: '10px', sqRadius: '0' },
  lg: { pad: '16px 36px', fs: '17px', bigRadius: '999px', smRadius: '14px', sqRadius: '0' },
  xl: { pad: '20px 44px', fs: '19px', bigRadius: '999px', smRadius: '18px', sqRadius: '0' },
};

// Shape -> radius preset
const shapes = {
  pill:    (s) => s.bigRadius,
  rounded: (s) => s.smRadius,
  square:  (s) => s.sqRadius,
  sharp:   () => '2px',
  asymm:   () => '20px 4px 20px 4px',
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickKey = (obj) => pick(Object.keys(obj));
const label = () => pick(labels);
const sizeKey = () => pickKey(sizes);
const shapeKey = () => pickKey(shapes);

const icons = {
  arrow:    '→',
  rocket:   '🚀',
  heart:    '❤',
  star:     '★',
  check:    '✓',
  download: '⬇',
  cart:     '🛒',
  play:     '▶',
  fire:     '🔥',
  bolt:     '⚡',
  sparkle:  '✦',
  plus:     '+',
};

// =====================================================================
//                          GENERATORS
// =====================================================================
const generators = [

  // ── 1. Gradient — full surface
  function gradientShift() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    const shp = shapeKey();
    return {
      title: `Gradient Shift ${sk.toUpperCase()}`,
      category: 'gradient',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 600;
          color: #fff; border: none; border-radius: ${shapes[shp](s)};
          cursor: pointer;
          background: linear-gradient(135deg, ${a}, ${b}, ${a});
          background-size: 200% 200%;
          transition: background-position 0.6s ease, transform 0.2s ease;
        }
        .btn:hover { background-position: 100% 0; transform: translateY(-2px); }
      `,
    };
  },

  // ── 2. Tri-stop diagonal gradient
  function triGradient() {
    const [a, b] = pick(palettes);
    const [, c] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Triple Gradient`,
      category: 'gradient',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; border: none; border-radius: ${shapes[shapeKey()](s)};
          background: linear-gradient(120deg, ${a}, ${b} 50%, ${c});
          cursor: pointer; transition: filter 0.3s ease, transform 0.2s ease;
        }
        .btn:hover { filter: brightness(1.15) saturate(1.2); transform: scale(1.04); }
      `,
    };
  },

  // ── 3. Neon outline pulse
  function neonGlow() {
    const [a] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Neon Pulse`,
      category: 'neon',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: ${a}; background: transparent;
          border: 2px solid ${a}; border-radius: ${shapes[shapeKey()](s)};
          cursor: pointer; transition: all 0.3s ease;
        }
        .btn:hover {
          color: #fff; background: ${a};
          box-shadow: 0 0 8px ${a}, 0 0 24px ${a}, 0 0 48px ${a};
        }
      `,
    };
  },

  // ── 4. 3D push button
  function lift3D() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `3D Push`,
      category: '3d',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: ${a}; border: none;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
          box-shadow: 0 6px 0 ${b};
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 0 ${b}; }
        .btn:active { transform: translateY(4px); box-shadow: 0 2px 0 ${b}; }
      `,
    };
  },

  // ── 5. Glassmorphism
  function glass() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Glass Frost`,
      category: 'glassmorphism',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, ${a}55, ${b}55);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: ${shapes[shapeKey()](s)};
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          cursor: pointer; transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.3); }
      `,
    };
  },

  // ── 6. Hover ripple
  function ripple() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Ripple Wave`,
      category: 'ripple',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          position: relative; padding: ${s.pad}; font-size: ${s.fs};
          font-weight: 600; color: #fff; background: ${a}; border: none;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer; overflow: hidden;
        }
        .btn::before {
          content: ''; position: absolute; top: 50%; left: 50%;
          width: 0; height: 0; background: ${b};
          border-radius: 50%; transform: translate(-50%, -50%);
          transition: width 0.5s ease, height 0.5s ease;
        }
        .btn:hover::before { width: 320px; height: 320px; }
      `,
    };
  },

  // ── 7. Morph pill
  function morphPill() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Morph Pill`,
      category: 'morph',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 600;
          color: #fff; background: linear-gradient(135deg, ${a}, ${b});
          border: none; border-radius: 8px; cursor: pointer;
          transition: border-radius 0.4s ease, padding 0.4s ease, letter-spacing 0.4s ease;
        }
        .btn:hover { border-radius: 999px; padding: ${s.pad.replace(/(\d+)px$/, (_,n) => +n+16+'px')}; letter-spacing: 2px; }
      `,
    };
  },

  // ── 8. Outline → fill sweep
  function outlineFill() {
    const [a] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Outline Sweep`,
      category: 'outline',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          position: relative; padding: ${s.pad}; font-size: ${s.fs};
          font-weight: 700; color: ${a}; background: transparent;
          border: 2px solid ${a}; border-radius: ${shapes[shapeKey()](s)};
          cursor: pointer; overflow: hidden; z-index: 0;
          transition: color 0.4s ease;
        }
        .btn::before {
          content: ''; position: absolute; inset: 0; background: ${a};
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease; z-index: -1;
        }
        .btn:hover { color: #fff; }
        .btn:hover::before { transform: scaleX(1); }
      `,
    };
  },

  // ── 9. Shine sweep
  function shineHover() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Shine Sweep`,
      category: 'hover',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          position: relative; padding: ${s.pad}; font-size: ${s.fs};
          font-weight: 600; color: #fff;
          background: linear-gradient(135deg, ${a}, ${b});
          border: none; border-radius: ${shapes[shapeKey()](s)};
          cursor: pointer; overflow: hidden;
        }
        .btn::after {
          content: ''; position: absolute; top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.5), transparent);
          transform: skewX(-25deg); transition: left 0.6s ease;
        }
        .btn:hover::after { left: 125%; }
      `,
    };
  },

  // ── 10. Loader (spinner)
  function loaderSpinner() {
    const [a] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Loader Spin`,
      category: 'loader',
      html: `<button class="btn"><span>Loading…</span></button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: ${a}; border: none;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
        }
        .btn::before {
          content: ''; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.9s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `,
    };
  },

  // ── 11. Loader (dots)
  function loaderDots() {
    const [a] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Loader Dots`,
      category: 'loader',
      html: `<button class="btn"><span>•</span><span>•</span><span>•</span></button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: 22px; font-weight: 900;
          color: #fff; background: ${a}; border: none;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
          display: inline-flex; gap: 6px; line-height: 1;
        }
        .btn span { animation: bounce 1.2s infinite ease-in-out; }
        .btn span:nth-child(2) { animation-delay: 0.2s; }
        .btn span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-6px); }
        }
      `,
    };
  },

  // ── 12. Social pill (pure CSS, no external icons)
  function socialPill() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Social Pill`,
      category: 'social',
      html: `<button class="btn"><span>${pick(['Follow','Like','Share','Tweet','Pin'])}</span></button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: linear-gradient(45deg, ${a}, ${b});
          border: none; border-radius: 999px; cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn:hover { transform: scale(1.05); box-shadow: 0 8px 24px ${a}66; }
      `,
    };
  },

  // ── 13. Icon + text
  function iconText() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    const ic = pick(Object.values(icons));
    return {
      title: `Icon + Text`,
      category: 'hover',
      html: `<button class="btn"><span>${ic}</span> ${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: linear-gradient(135deg, ${a}, ${b});
          border: none; border-radius: ${shapes[shapeKey()](s)};
          cursor: pointer; display: inline-flex; gap: 10px; align-items: center;
          transition: transform 0.2s ease, gap 0.3s ease;
        }
        .btn:hover { transform: translateX(2px); gap: 14px; }
      `,
    };
  },

  // ── 14. Arrow slide
  function arrowSlide() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Arrow Slide`,
      category: 'hover',
      html: `<button class="btn"><span>${label()}</span> <span class="arr">→</span></button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: linear-gradient(135deg, ${a}, ${b});
          border: none; border-radius: ${shapes[shapeKey()](s)};
          cursor: pointer; overflow: hidden; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn .arr {
          display: inline-block; transition: transform 0.3s cubic-bezier(.4,.2,.2,1);
        }
        .btn:hover .arr { transform: translateX(8px); }
      `,
    };
  },

  // ── 15. Soft pulse (animated)
  function softPulse() {
    const [a] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Soft Pulse`,
      category: 'neon',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: ${a}; border: none;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 ${a}aa; }
          50%     { box-shadow: 0 0 0 14px ${a}00; }
        }
      `,
    };
  },

  // ── 16. Jelly squish
  function jelly() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Jelly Squish`,
      category: 'morph',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: linear-gradient(135deg, ${a}, ${b});
          border: none; border-radius: 14px; cursor: pointer;
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
        }
        .btn:hover  { transform: scale(1.08, 0.92); }
        .btn:active { transform: scale(0.92, 1.08); }
      `,
    };
  },

  // ── 17. Slide-from-left fill
  function slideFill() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Slide Fill`,
      category: 'hover',
      html: `<button class="btn"><span>${label()}</span></button>`,
      css: `
        .btn {
          position: relative; padding: ${s.pad}; font-size: ${s.fs};
          font-weight: 700; color: ${a}; background: transparent;
          border: 2px solid ${a}; border-radius: ${shapes[shapeKey()](s)};
          cursor: pointer; overflow: hidden;
          transition: color 0.4s ease;
        }
        .btn span { position: relative; z-index: 1; }
        .btn::before {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, ${a}, ${b});
          transition: left 0.4s ease;
        }
        .btn:hover { color: #fff; }
        .btn:hover::before { left: 0; }
      `,
    };
  },

  // ── 18. Dark with neon border
  function darkNeonBorder() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Dark Neon`,
      category: 'neon',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: #0b1020;
          border: 2px solid ${a}; border-radius: ${shapes[shapeKey()](s)};
          cursor: pointer; transition: box-shadow 0.3s ease, color 0.3s ease;
        }
        .btn:hover {
          color: ${b};
          box-shadow: 0 0 12px ${a}aa, 0 0 24px ${a}55, inset 0 0 8px ${a}55;
        }
      `,
    };
  },

  // ── 19. Embossed soft (light theme)
  function softEmboss() {
    const [a] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Soft Emboss`,
      category: '3d',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 600;
          color: ${a}; background: #e6e7ee; border: none;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
          box-shadow: 6px 6px 12px #b8b9be, -6px -6px 12px #ffffff;
          transition: box-shadow 0.2s ease;
        }
        .btn:active {
          box-shadow: inset 4px 4px 8px #b8b9be, inset -4px -4px 8px #ffffff;
        }
      `,
    };
  },

  // ── 20. Wobble on hover
  function wobble() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Wobble`,
      category: 'morph',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: linear-gradient(135deg, ${a}, ${b});
          border: none; border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
        }
        .btn:hover { animation: wobble 0.6s ease; }
        @keyframes wobble {
          0%,100% { transform: rotate(0deg); }
          25%     { transform: rotate(-3deg); }
          50%     { transform: rotate(3deg); }
          75%     { transform: rotate(-2deg); }
        }
      `,
    };
  },

  // ── 21. Success state
  function successState() {
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Success State`,
      category: 'social',
      html: `<button class="btn"><span>✓</span> Saved</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: #10b981; border: none;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 6px 20px rgba(16,185,129,0.4);
          transition: transform 0.2s ease;
        }
        .btn:hover { transform: translateY(-2px); }
      `,
    };
  },

  // ── 22. Error / destructive state
  function errorState() {
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Destructive`,
      category: 'social',
      html: `<button class="btn"><span>✕</span> Delete</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: #dc2626; border: none;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .btn:hover { background: #b91c1c; transform: translateY(-2px); }
      `,
    };
  },

  // ── 23. Disabled state
  function disabledState() {
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Disabled State`,
      category: 'outline',
      html: `<button class="btn" disabled>${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 600;
          color: #94a3b8; background: #1e293b; border: 1px solid #334155;
          border-radius: ${shapes[shapeKey()](s)}; cursor: not-allowed;
          opacity: 0.6; pointer-events: none;
        }
      `,
    };
  },

  // ── 24. Conic gradient rotate
  function conicRotate() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Conic Glow`,
      category: 'gradient',
      html: `<button class="btn"><span>${label()}</span></button>`,
      css: `
        .btn {
          position: relative; padding: ${s.pad}; font-size: ${s.fs};
          font-weight: 700; color: #fff; background: #0b1020;
          border: none; border-radius: ${shapes[shapeKey()](s)};
          cursor: pointer; overflow: hidden; z-index: 0;
        }
        .btn span { position: relative; z-index: 2; }
        .btn::before {
          content: ''; position: absolute; inset: -2px; z-index: 0;
          background: conic-gradient(from 0deg, ${a}, ${b}, ${a});
          animation: rot 4s linear infinite;
        }
        .btn::after {
          content: ''; position: absolute; inset: 2px; z-index: 1;
          background: #0b1020; border-radius: inherit;
        }
        @keyframes rot { to { transform: rotate(360deg); } }
      `,
    };
  },

  // ── 25. Soft minimal (light)
  function softMinimal() {
    const [a] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Soft Minimal`,
      category: 'outline',
      html: `<button class="btn">${label()}</button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 600;
          color: ${a}; background: ${a}1a; border: 1px solid ${a}33;
          border-radius: ${shapes[shapeKey()](s)}; cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .btn:hover { background: ${a}33; transform: translateY(-1px); }
      `,
    };
  },

  // ── 26. Skew on hover
  function skewHover() {
    const [a, b] = pick(palettes);
    const sk = sizeKey(), s = sizes[sk];
    return {
      title: `Skew Push`,
      category: '3d',
      html: `<button class="btn"><span>${label()}</span></button>`,
      css: `
        .btn {
          padding: ${s.pad}; font-size: ${s.fs}; font-weight: 700;
          color: #fff; background: linear-gradient(135deg, ${a}, ${b});
          border: none; border-radius: 4px; cursor: pointer;
          transition: transform 0.25s ease;
        }
        .btn span { display: inline-block; transition: transform 0.25s ease; }
        .btn:hover { transform: skewX(-8deg); }
        .btn:hover span { transform: skewX(8deg); }
      `,
    };
  },

  // ── 27. Big CTA
  function bigCTA() {
    const [a, b] = pick(palettes);
    return {
      title: `Big CTA`,
      category: 'gradient',
      html: `<button class="btn">${pick(['Get Started Free','Start Your Trial','Build Yours Now','Launch Your App'])}</button>`,
      css: `
        .btn {
          padding: 22px 56px; font-size: 20px; font-weight: 800;
          letter-spacing: 0.5px; color: #fff;
          background: linear-gradient(135deg, ${a}, ${b});
          border: none; border-radius: 16px; cursor: pointer;
          box-shadow: 0 20px 40px -10px ${a}88;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 26px 50px -8px ${a}aa; }
      `,
    };
  },

  // ── 28. Tiny chip
  function tinyChip() {
    const [a] = pick(palettes);
    return {
      title: `Tiny Chip`,
      category: 'outline',
      html: `<button class="btn">${pick(['New','Pro','Beta','Hot','Sale','Free'])}</button>`,
      css: `
        .btn {
          padding: 4px 10px; font-size: 11px; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase;
          color: #fff; background: ${a}; border: none;
          border-radius: 4px; cursor: pointer;
          transition: filter 0.2s ease;
        }
        .btn:hover { filter: brightness(1.15); }
      `,
    };
  },
];

module.exports = {
  random() {
    return pick(generators)();
  },
  all() {
    return generators.map((g) => g());
  },
};