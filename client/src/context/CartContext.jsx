import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext.jsx';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // full button docs
  const [ids, setIds] = useState(new Set());

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]); setIds(new Set()); return;
    }
    try {
      const { buttons } = await api.cart();
      setItems(buttons);
      setIds(new Set(buttons.map((b) => b._id)));
    } catch {}
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  async function add(button) {
    if (!user) throw new Error('Login required');
    await api.addToCart(button._id);
    setItems((p) => (p.find((b) => b._id === button._id) ? p : [button, ...p]));
    setIds((p) => new Set(p).add(button._id));
  }
  async function remove(id) {
    await api.removeFromCart(id);
    setItems((p) => p.filter((b) => b._id !== id));
    setIds((p) => { const n = new Set(p); n.delete(id); return n; });
  }
  function has(id) { return ids.has(id); }

  return (
    <CartCtx.Provider value={{ items, add, remove, has, refresh, count: items.length }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
