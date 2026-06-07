// Backend API-тэй ярих нэгдсэн service
// Vite proxy-оор /api/* → http://localhost:3000/api/*

const BASE = '/api'

function getToken() {
  return localStorage.getItem('auth_token')
}

function authHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(method, path, body = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeader()
  }
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, opts)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Алдаа гарлаа')
  }
  return data
}

// ─── AUTH ──────────────────────────────────────────────
export const authAPI = {
  register: (username, email, password) =>
    request('POST', '/auth/register', { username, email, password }),

  login: (email, password) =>
    request('POST', '/auth/login', { email, password }),

  getProfile: () =>
    request('GET', '/users/me'),

  getMyGuides: () =>
    request('GET', '/users/me/guides'),
}

// ─── GAMES ─────────────────────────────────────────────
export const gamesAPI = {
  getAll: () =>
    request('GET', '/games'),

  getById: (id) =>
    request('GET', `/games/${id}`),

  create: (data) =>
    request('POST', '/games', data),

  update: (id, data) =>
    request('PUT', `/games/${id}`, data),

  delete: (id) =>
    request('DELETE', `/games/${id}`),
}

// ─── GUIDES ────────────────────────────────────────────
export const guidesAPI = {
  getAll: () =>
    request('GET', '/guides'),

  getById: (id) =>
    request('GET', `/guides/${id}`),

  create: (data) =>
    request('POST', '/guides', data),

  update: (id, data) =>
    request('PUT', `/guides/${id}`, data),

  delete: (id) =>
    request('DELETE', `/guides/${id}`),

  addComment: (guideId, content) =>
    request('POST', `/guides/${guideId}/comments`, { content }),
}

// ─── ADMIN ─────────────────────────────────────────────
export const adminAPI = {
  getAllUsers: () =>
    request('GET', '/admin/users'),

  updateRole: (userId, role) =>
    request('PUT', `/admin/users/${userId}/role`, { role }),

  deleteUser: (userId) =>
    request('DELETE', `/admin/users/${userId}`),
}
