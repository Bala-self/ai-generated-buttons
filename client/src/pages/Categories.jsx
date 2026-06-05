import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import ButtonCard from '../components/ButtonCard.jsx';
import Filters from '../components/Filters.jsx';

export default function Categories() {
  const [active, setActive] = useState('all');
  const [buttons, setButtons] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const p = active === 'all' ? api.all(1) : api.byCategory(active, 1);
    p.then((d) => setButtons(d.buttons))
     .catch(() => setButtons([]))
     .finally(() => setLoading(false));
  }, [active]);

  return (
    <>
      <h1 className="text-3xl font-extrabold mb-6 text-center">Browse by category</h1>
      <div className="mb-8">
        <Filters active={active} onChange={setActive} />
      </div>
      {loading ? (
        <p className="text-center text-slate-400">Loading…</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {buttons.map((b) => <ButtonCard key={b._id} button={b} />)}
        </section>
      )}
    </>
  );
}
