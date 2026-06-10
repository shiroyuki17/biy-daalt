// Backend API-Ñ‚ÑÐ¹ ÑÑ€Ð¸Ñ… Ð½ÑÐ³Ð´ÑÑÐ½ service
// Vite proxy-Ð¾Ð¾Ñ€ /api/* â†’ http://localhost:3000/api/*

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
    throw new Error(data.message || 'ÐÐ»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°')
  }
  return data
}

// â”€â”€â”€ AUTH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ GAMES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ GUIDES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ ADMIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const adminAPI = {
  getAllUsers: () =>
    request('GET', '/admin/users'),

  updateRole: (userId, role) =>
    request('PUT', `/admin/users/${userId}/role`, { role }),

  deleteUser: (userId) =>
    request('DELETE', `/admin/users/${userId}`),
}

// â”€â”€â”€ GAME CONTENT (Champions, Items, Runes) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const gameContentAPI = {
  getChampions: (gameId) =>
    request('GET', `/champions${gameId ? `?gameId=${gameId}` : ''}`),
  getChampionById: (id) => request('GET', `/champions/${id}`),
  createChampion: (data) => request('POST', '/champions', data),
  updateChampion: (id, data) => request('PUT', `/champions/${id}`, data),
  deleteChampion: (id) => request('DELETE', `/champions/${id}`),

  getSkills: (championId) =>
    request('GET', `/skills${championId ? `?championId=${championId}` : ''}`),
  createSkill: (data) => request('POST', '/skills', data),
  updateSkill: (id, data) => request('PUT', `/skills/${id}`, data),
  deleteSkill: (id) => request('DELETE', `/skills/${id}`),

  getItems: (gameId) =>
    request('GET', `/items${gameId ? `?gameId=${gameId}` : ''}`),
  createItem: (data) => request('POST', '/items', data),
  updateItem: (id, data) => request('PUT', `/items/${id}`, data),
  deleteItem: (id) => request('DELETE', `/items/${id}`),

  getRunes: (gameId) =>
    request('GET', `/runes${gameId ? `?gameId=${gameId}` : ''}`),
  createRune: (data) => request('POST', '/runes', data),
  updateRune: (id, data) => request('PUT', `/runes/${id}`, data),
  deleteRune: (id) => request('DELETE', `/runes/${id}`),

  getSpells: (gameId) =>
    request('GET', `/spells${gameId ? `?gameId=${gameId}` : ''}`),
  createSpell: (data) => request('POST', '/spells', data),
  updateSpell: (id, data) => request('PUT', `/spells/${id}`, data),
  deleteSpell: (id) => request('DELETE', `/spells/${id}`),
}
