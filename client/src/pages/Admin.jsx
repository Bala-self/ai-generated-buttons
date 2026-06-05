import { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try { setStats(await api.adminStats()); } catch (e) { setMsg(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function generate() {
    setBusy(true); setMsg('');
    try {
      const r = await api.adminGenerate();
      setMsg(`✅ Inserted ${r.inserted} buttons.`);
      await load();
    } catch (e) { setMsg(`❌ ${e.message}`); }
    finally { setBusy(false); }
  }

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Admin dashboard</h1>
          <p className="text-slate-400 text-sm">Monitor AI generations & engagement.</p>
        </div>
        <button onClick={generate} disabled={busy} className="btn-primary">
          {busy ? 'Generating…' : 'Run generation now'}
        </button>
      </header>

      {msg && <div className="glass p-4 mb-6 text-sm">{msg}</div>}

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass p-5">
            <p className="text-slate-400 text-sm">Total approved buttons</p>
            <p className="text-4xl font-extrabold mt-2">{stats.total}</p>
          </div>
          <div className="glass p-5 lg:col-span-2">
            <p className="text-slate-400 text-sm mb-3">By category</p>
            <div className="flex flex-wrap gap-2">
              {stats.byCategory.map((c) => (
                <span key={c._id} className="chip">
                  {c._id} <b className="ml-1 text-fuchsia-300">{c.count}</b>
                </span>
              ))}
            </div>
          </div>
          <div className="glass p-5 lg:col-span-3">
            <p className="text-slate-400 text-sm mb-3">Top 10 by likes</p>
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">Title</th>
                  <th>Category</th>
                  <th>Likes</th>
                  <th>Cart adds</th>
                </tr>
              </thead>
              <tbody>
                {stats.top.map((b) => (
                  <tr key={b._id} className="border-t border-white/5">
                    <td className="py-2 font-semibold">{b.title}</td>
                    <td className="text-fuchsia-300">{b.category}</td>
                    <td>{b.likes}</td>
                    <td>{b.cartAdds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
