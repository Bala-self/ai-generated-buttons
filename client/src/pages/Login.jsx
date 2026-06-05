import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-extrabold mb-1">Welcome back</h1>
      <p className="text-slate-400 mb-6">Sign in to like buttons and use the cart.</p>
      <form onSubmit={submit} className="glass p-6 space-y-4">
        <input className="input" type="email" placeholder="Email" required
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password (8+ chars)" required
               value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-rose-400 text-sm">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="text-sm text-center text-slate-400">
          No account? <Link to="/register" className="text-fuchsia-300 font-semibold">Register</Link>
        </p>
      </form>
    </div>
  );
}
