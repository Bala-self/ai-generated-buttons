/**
 * Validates and sanitizes AI-generated button code.
 * - HTML: DOMPurify with a tight allowlist (button + spans + svg basics)
 * - CSS:  property whitelist + value blacklist (no url(), no @import, no expression())
 * - Scope: rewrites selectors so a `.btn` rule only applies inside the unique uid wrapper
 */

const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const ALLOWED_TAGS = [
  'button', 'span', 'i', 'em', 'strong', 'b', 'svg', 'path', 'circle',
  'rect', 'line', 'polygon', 'polyline', 'g', 'div',
];
const ALLOWED_ATTR = [
  'class', 'type', 'aria-label', 'role',
  'viewBox', 'xmlns', 'fill', 'stroke', 'stroke-width', 'stroke-linecap',
  'stroke-linejoin', 'd', 'cx', 'cy', 'r', 'x', 'y', 'width', 'height',
  'points', 'transform', 'data-text',
];

// CSS properties we permit. Keeps things visual/animation-only.
const ALLOWED_CSS_PROPS = new Set([
  'align-items','animation','animation-delay','animation-direction','animation-duration',
  'animation-fill-mode','animation-iteration-count','animation-name','animation-play-state',
  'animation-timing-function','backdrop-filter','-webkit-backdrop-filter','background',
  'background-color','background-image','background-position','background-size','background-clip',
  '-webkit-background-clip','border','border-radius','border-color','border-width','border-style',
  'border-top','border-bottom','border-left','border-right','box-shadow','box-sizing',
  'color','cursor','display','filter','flex','flex-direction','font','font-family','font-size',
  'font-weight','gap','height','justify-content','letter-spacing','line-height','margin',
  'max-width','min-width','min-height','opacity','outline','overflow','padding','perspective',
  'place-items','pointer-events','position','top','left','right','bottom','text-align','text-decoration',
  'text-shadow','text-transform','transform','transform-origin','transform-style','transition',
  'transition-delay','transition-duration','transition-property','transition-timing-function',
  'user-select','vertical-align','visibility','white-space','width','word-spacing','z-index',
  '-webkit-text-fill-color','will-change','content',
]);

// Block dangerous values regardless of property.
const VALUE_BLACKLIST = [
  /url\s*\(/i,
  /expression\s*\(/i,
  /javascript\s*:/i,
  /@import/i,
  /behavior\s*:/i,
  /position\s*:\s*fixed/i,
];

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function sanitizeDeclarations(block) {
  return block
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .filter((d) => {
      const idx = d.indexOf(':');
      if (idx === -1) return false;
      const prop = d.slice(0, idx).trim().toLowerCase();
      const val = d.slice(idx + 1).trim();
      if (!ALLOWED_CSS_PROPS.has(prop)) return false;
      if (VALUE_BLACKLIST.some((re) => re.test(val))) return false;
      if (val.length > 500) return false;
      return true;
    })
    .join('; ');
}

/**
 * Scope every selector by prepending `#scope-<uid>`.
 * Handles @keyframes (renamed per uid) and @media blocks.
 */
function sanitizeAndScopeCSS(rawCss, uid) {
  if (!rawCss || typeof rawCss !== 'string') return '';
  if (rawCss.length > 12000) rawCss = rawCss.slice(0, 12000);
  let css = stripComments(rawCss);

  // Strip dangerous @-rules that don't have brace bodies (@import, @charset, @namespace)
  css = css.replace(/@(import|charset|namespace)[^;]*;/gi, '');

  const scope = `#scope-${uid}`;
  const out = [];
  const keyframeMap = new Map();

  // Extract & rename keyframes first
  css = css.replace(
    /@(-webkit-)?keyframes\s+([A-Za-z0-9_-]+)\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g,
    (_m, prefix, name, body) => {
      const newName = `${name}-${uid}`;
      keyframeMap.set(name, newName);
      // sanitize inner blocks
      const sanitizedBody = body.replace(/([^{}]+)\{([^{}]+)\}/g, (_mm, sel, decls) => {
        return `${sel.trim()} { ${sanitizeDeclarations(decls)} }`;
      });
      out.push(`@${prefix || ''}keyframes ${newName} { ${sanitizedBody} }`);
      return '';
    }
  );

  // Strip @media wrapper but keep inner rules scoped
  css = css.replace(/@media[^{]+{([\s\S]*?)}\s*}/g, (_m, inner) => inner + '}');

  // Now handle plain rules: selector { decls }
  css = css.replace(/([^{}]+)\{([^{}]+)\}/g, (_m, selectorList, decls) => {
    const scopedSelectors = selectorList
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        // never allow html/body/:root escapes
        if (/^(html|body|:root|\*)/i.test(s)) return `${scope} ${s.replace(/^(html|body|:root|\*)/i, '').trim() || 'button'}`;
        return `${scope} ${s}`;
      })
      .join(', ');
    const sanitized = sanitizeDeclarations(decls);
    if (!sanitized) return '';
    // Rename animation references
    let finalDecls = sanitized;
    for (const [oldName, newName] of keyframeMap.entries()) {
      finalDecls = finalDecls.replace(new RegExp(`\\b${oldName}\\b`, 'g'), newName);
    }
    out.push(`${scopedSelectors} { ${finalDecls} }`);
    return '';
  });

  return out.join('\n');
}

function sanitizeHTML(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'style'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'style'],
    KEEP_CONTENT: true,
  }).trim();
}

/**
 * Validate the shape of a single AI button object.
 * Returns { ok, value, reason }.
 */
function validateButton(raw, uid) {
  if (!raw || typeof raw !== 'object') return { ok: false, reason: 'not-object' };
  const { title, category, html, css } = raw;
  if (typeof title !== 'string' || title.length < 2 || title.length > 80)
    return { ok: false, reason: 'bad-title' };
  if (typeof category !== 'string') return { ok: false, reason: 'bad-category' };
  if (typeof html !== 'string' || !html.includes('<button'))
    return { ok: false, reason: 'no-button' };
  if (typeof css !== 'string' || css.length < 10)
    return { ok: false, reason: 'no-css' };

  const cleanHTML = sanitizeHTML(html);
  if (!cleanHTML.includes('<button')) return { ok: false, reason: 'sanitized-empty' };
  const cleanCSS = sanitizeAndScopeCSS(css, uid);
  if (!cleanCSS) return { ok: false, reason: 'css-empty-after-sanitize' };

  const fullCode = `<!-- ${title} -->\n${html.trim()}\n\n<style>\n${css.trim()}\n</style>`;
  return {
    ok: true,
    value: {
      title: title.trim(),
      category: category.toLowerCase().trim(),
      previewHTML: cleanHTML,
      previewCSS: cleanCSS,
      fullCode,
      uid,
    },
  };
}

module.exports = { sanitizeHTML, sanitizeAndScopeCSS, validateButton };
