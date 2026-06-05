import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  const link = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/60 border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500 grid place-items-center font-black">
            ✦
          </span>
          <span className="font-extrabold tracking-tight text-lg">
            AI<span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">Buttons</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={link}>Today</NavLink>
          <NavLink to="/explore" className={link}>Explore</NavLink>
          <NavLink to="/categories" className={link}>Categories</NavLink>
          {user?.isAdmin && <NavLink to="/admin" className={link}>Admin</NavLink>}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative btn-ghost text-sm">
            🛒 Cart
            {count > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-fuchsia-500 text-white font-bold">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <button onClick={logout} className="btn-ghost text-sm">Logout</button>
          ) : (
            <Link to="/login" className="btn-primary text-sm">Sign In</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
