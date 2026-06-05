import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '../utils/api';
import ButtonCard from '../components/ButtonCard.jsx';

export default function Explore() {
  const [buttons, setButtons] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false); // prevent double-fire from observer

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const d = await api.all(page);
      // Dedupe just in case
      setButtons((prev) => {
        const seen = new Set(prev.map((b) => b._id));
        const fresh = d.buttons.filter((b) => !seen.has(b._id));
        return [...prev, ...fresh];
      });
      setHasMore(d.hasMore);
      setPage((p) => p + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore]);

  // First load
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '400px' } // start loading 400px before bottom
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [loadMore, hasMore]);

  return (
    <>
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Explore the entire gallery
        </h1>
        <p className="text-slate-400 text-sm">
          {buttons.length > 0 && `Showing ${buttons.length} buttons · `}
          Scroll down to load more — automatically
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {buttons.map((b) => (
          <ButtonCard key={b._id} button={b} />
        ))}
      </section>

      {/* Sentinel — when this enters viewport, fetch next page */}
      <div ref={sentinelRef} className="h-20 flex items-center justify-center mt-8">
        {loading && (
          <div className="flex items-center gap-3 text-slate-400">
            <span className="w-4 h-4 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-sm">Loading more…</span>
          </div>
        )}
        {!hasMore && buttons.length > 0 && (
          <p className="text-slate-500 text-sm">
            ✨ You've reached the end · {buttons.length} buttons total
          </p>
        )}
        {error && (
          <button
            onClick={loadMore}
            className="text-rose-300 text-sm hover:text-rose-200 underline"
          >
            ⚠ {error} — tap to retry
          </button>
        )}
      </div>
    </>
  );
}