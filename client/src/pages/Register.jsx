import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function up(k) { return (e) => setForm((f) => ({ ...f, [k]: e.target.value })); }

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      nav('/');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-extrabold mb-1">Create your account</h1>
      <p className="text-slate-400 mb-6">Free forever. No card required.</p>
      <form onSubmit={submit} className="glass p-6 space-y-4">
        <input className="input" placeholder="Name" required value={form.name} onChange={up('name')} />
        <input className="input" type="email" placeholder="Email" required value={form.email} onChange={up('email')} />
        <input className="input" type="password" placeholder="Password (min 8 chars)" required minLength={8} value={form.password} onChange={up('password')} />
        {error && <p className="text-rose-400 text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? 'Creating…' : 'Create Account'}
        </button>
        <p className="text-sm text-center text-slate-400">
          Already registered? <Link to="/login" className="text-fuchsia-300 font-semibold">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
