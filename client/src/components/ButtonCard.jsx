import { memo, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../utils/api';

/**
 * Renders a sanitized AI button preview inside an isolated scope div
 * (#scope-<uid>) so the scoped CSS only applies inside that node.
 */
function ButtonPreview({ button }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="preview-stage">
      {visible ? (
        <div id={`scope-${button.uid}`}>
          <style dangerouslySetInnerHTML={{ __html: button.previewCSS }} />
          <div dangerouslySetInnerHTML={{ __html: button.previewHTML }} />
        </div>
      ) : (
        <div className="h-10 w-32 rounded-md bg-white/5 animate-pulse" />
      )}
    </div>
  );
}

function ButtonCard({ button, onLikeChange }) {
  const { user } = useAuth();
  const { add, has, remove } = useCart();
  const [liked, setLiked] = useState(user?.likes?.includes(button._id));
  const [likes, setLikes] = useState(button.likes || 0);
  const [busy, setBusy] = useState(false);
  const inCart = has(button._id);

  async function toggleLike() {
    if (!user) return alert('Please log in to like buttons.');
    setBusy(true);
    try {
      const res = await api.like(button._id);
      setLiked(res.liked);
      setLikes((l) => l + (res.liked ? 1 : -1));
      onLikeChange?.(button._id, res.liked);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleCart() {
    if (!user) return alert('Please log in to use the cart.');
    setBusy(true);
    try {
      if (inCart) await remove(button._id);
      else await add(button);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(button.fullCode);
    } catch {}
  }

  return (
    <div className="glass overflow-hidden flex flex-col group hover:border-white/20 transition">
      <ButtonPreview button={button} />

      <div className="px-4 pb-4 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold truncate text-sm">{button.title}</h3>
            <p className="text-[11px] uppercase tracking-widest text-fuchsia-300/80">
              {button.category}
            </p>
          </div>
          <button
            onClick={toggleLike}
            disabled={busy}
            className={`text-sm font-semibold flex items-center gap-1 px-2 py-1 rounded-lg transition ${
              liked ? 'text-pink-400 bg-pink-500/10' : 'text-slate-300 hover:bg-white/5'
            }`}
            title={liked ? 'Unlike' : 'Like'}
          >
            {liked ? '♥' : '♡'} {likes}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleCart}
            disabled={busy}
            className={`flex-1 text-xs font-semibold py-2 rounded-lg transition ${
              inCart
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            {inCart ? '✓ In Cart' : '+ Cart'}
          </button>
          <button
            onClick={copyCode}
            className="text-xs font-semibold py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
            title="Copy full code"
          >
            ⧉
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ButtonCard);
