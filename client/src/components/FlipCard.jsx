import { useState } from 'react';

/**
 * 3D flip card for the Cart page.
 * Front: live preview of the sanitized button.
 * Back:  the raw fullCode (escaped) ready to copy.
 */
export default function FlipCard({ button, onRemove }) {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(button.fullCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function download() {
    const blob = new Blob([button.fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${button.title.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flip-scene h-[360px]">
      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        {/* FRONT */}
        <div className="flip-face glass flex flex-col">
          <div className="preview-stage flex-1">
            <div id={`scope-${button.uid}`}>
              <style dangerouslySetInnerHTML={{ __html: button.previewCSS }} />
              <div dangerouslySetInnerHTML={{ __html: button.previewHTML }} />
            </div>
          </div>
          <div className="p-3 border-t border-white/5 flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{button.title}</p>
              <p className="text-[11px] uppercase tracking-widest text-fuchsia-300/80">
                {button.category}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFlipped(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500"
              >
                View Code →
              </button>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-face flip-back glass flex flex-col bg-slate-900/80">
          <div className="px-3 py-2 flex items-center justify-between border-b border-white/10">
            <p className="text-xs font-bold tracking-widest text-slate-400">SOURCE CODE</p>
            <button
              onClick={() => setFlipped(false)}
              className="text-xs text-slate-300 hover:text-white"
            >
              ← Back
            </button>
          </div>
          <pre className="text-[11px] leading-snug overflow-auto flex-1 p-3 font-mono text-emerald-200/90 whitespace-pre-wrap break-words">
{button.fullCode}
          </pre>
          <div className="p-2 border-t border-white/10 flex gap-2">
            <button onClick={copy} className="flex-1 btn-ghost text-xs py-2">
              {copied ? '✓ Copied' : '⧉ Copy'}
            </button>
            <button onClick={download} className="flex-1 btn-ghost text-xs py-2">
              ⬇ Download
            </button>
            {onRemove && (
              <button
                onClick={() => onRemove(button._id)}
                className="text-xs py-2 px-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30 hover:bg-rose-500/30"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
