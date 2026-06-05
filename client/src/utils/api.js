const BASE = import.meta.env.VITE_API_URL || '/api';

function authHeader() {
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? authHeader() : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // auth
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me', { auth: true }),

  // buttons
  latest: () => request('/buttons'),
  all: (page = 1) => request(`/buttons/all?page=${page}`),
  byCategory: (c, page = 1) => request(`/buttons/category/${c}?page=${page}`),
  like: (id) => request(`/buttons/${id}/like`, { method: 'POST', auth: true }),

  // cart
  cart: () => request('/cart', { auth: true }),
  addToCart: (buttonId) =>
    request('/cart/add', { method: 'POST', auth: true, body: { buttonId } }),
  removeFromCart: (buttonId) =>
    request('/cart/remove', { method: 'POST', auth: true, body: { buttonId } }),

  // admin
  adminGenerate: () => request('/admin/generate', { method: 'POST', auth: true }),
  adminStats: () => request('/admin/stats', { auth: true }),
};
