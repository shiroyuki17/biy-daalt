import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

// LoL-д хамаарах локал мэдээлэл (champion, item) localStorage-д хадгалах
const LOL_PREFS_KEY = 'lol_prefs'

function getLolPrefs(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(LOL_PREFS_KEY)) || {}
    return all[userId] || {
      favoriteChampions: [],
      favoriteItems: [],
      mainRole: '',
      rank: 'Unranked',
      region: 'KR',
      icon: Math.floor(Math.random() * 28) + 1,
      notes: ''
    }
  } catch { return {} }
}

function saveLolPrefs(userId, prefs) {
  try {
    const all = JSON.parse(localStorage.getItem(LOL_PREFS_KEY)) || {}
    all[userId] = prefs
    localStorage.setItem(LOL_PREFS_KEY, JSON.stringify(all))
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Апп ачаалахад token байвал profile авна
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { setLoading(false); return }

    authAPI.getProfile()
      .then(data => {
        const prefs = getLolPrefs(data.user.id)
        setUser({ ...data.user, ...prefs })
      })
      .catch(() => {
        localStorage.removeItem('auth_token')
      })
      .finally(() => setLoading(false))
  }, [])

  // ─── REGISTER ───────────────────────────────────────
  const register = async (email, username, password) => {
    try {
      await authAPI.register(username, email, password)
      // Бүртгүүлсний дараа шууд нэвтэрнэ
      return await login(email, password)
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // ─── LOGIN ──────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password)
      localStorage.setItem('auth_token', data.token)
      const prefs = getLolPrefs(data.user.id)
      setUser({ ...data.user, ...prefs })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  // ─── LOGOUT ─────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  // ─── UPDATE LOCAL PREFS (LoL мэдээлэл) ─────────────
  const updateUser = (updates) => {
    if (!user) return
    const updated = { ...user, ...updates }
    saveLolPrefs(user.id, {
      favoriteChampions: updated.favoriteChampions,
      favoriteItems:     updated.favoriteItems,
      mainRole:          updated.mainRole,
      rank:              updated.rank,
      region:            updated.region,
      icon:              updated.icon,
      notes:             updated.notes
    })
    setUser(updated)
  }

  // ─── CHAMPION FAVORITES ─────────────────────────────
  const toggleFavoriteChampion = (champName) => {
    if (!user) return false
    const favs = [...(user.favoriteChampions || [])]
    const idx = favs.indexOf(champName)
    if (idx > -1) favs.splice(idx, 1)
    else favs.push(champName)
    updateUser({ favoriteChampions: favs })
    return true
  }

  // ─── ITEM FAVORITES ─────────────────────────────────
  const toggleFavoriteItem = (itemName) => {
    if (!user) return false
    const favs = [...(user.favoriteItems || [])]
    const idx = favs.indexOf(itemName)
    if (idx > -1) favs.splice(idx, 1)
    else favs.push(itemName)
    updateUser({ favoriteItems: favs })
    return true
  }

  const isFavoriteChampion = (champName) =>
    user?.favoriteChampions?.includes(champName) || false

  const isFavoriteItem = (itemName) =>
    user?.favoriteItems?.includes(itemName) || false

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      logout,
      updateUser,
      toggleFavoriteChampion,
      toggleFavoriteItem,
      isFavoriteChampion,
      isFavoriteItem
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
