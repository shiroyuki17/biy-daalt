import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// localStorage-д хэрэглэгчдийн мэдээлэл хадгална
const USERS_KEY = 'lol_users'
const CURRENT_USER_KEY = 'lol_current_user'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {}
  } catch { return {} }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getCurrentUser() {
  try {
    const email = localStorage.getItem(CURRENT_USER_KEY)
    if (!email) return null
    const users = getUsers()
    return users[email] || null
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = getCurrentUser()
    if (saved) setUser(saved)
    setLoading(false)
  }, [])

  const register = (email, username, password) => {
    const users = getUsers()
    if (users[email]) {
      return { success: false, error: 'Энэ имэйл хаяг бүртгэлтэй байна!' }
    }
    const newUser = {
      email,
      username,
      password,
      createdAt: new Date().toISOString(),
      favoriteChampions: [],
      favoriteItems: [],
      mainRole: '',
      rank: 'Unranked',
      region: 'KR',
      icon: Math.floor(Math.random() * 28) + 1,
      notes: ''
    }
    users[email] = newUser
    saveUsers(users)
    localStorage.setItem(CURRENT_USER_KEY, email)
    setUser(newUser)
    return { success: true }
  }

  const login = (email, password) => {
    const users = getUsers()
    const u = users[email]
    if (!u) return { success: false, error: 'Хэрэглэгч олдсонгүй!' }
    if (u.password !== password) return { success: false, error: 'Нууц үг буруу байна!' }
    localStorage.setItem(CURRENT_USER_KEY, email)
    setUser(u)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY)
    setUser(null)
  }

  const updateUser = (updates) => {
    if (!user) return
    const users = getUsers()
    const updated = { ...user, ...updates }
    users[user.email] = updated
    saveUsers(users)
    setUser(updated)
  }

  const toggleFavoriteChampion = (champName) => {
    if (!user) return false
    const favs = [...user.favoriteChampions]
    const idx = favs.indexOf(champName)
    if (idx > -1) favs.splice(idx, 1)
    else favs.push(champName)
    updateUser({ favoriteChampions: favs })
    return true
  }

  const toggleFavoriteItem = (itemName) => {
    if (!user) return false
    const favs = [...user.favoriteItems]
    const idx = favs.indexOf(itemName)
    if (idx > -1) favs.splice(idx, 1)
    else favs.push(itemName)
    updateUser({ favoriteItems: favs })
    return true
  }

  const isFavoriteChampion = (champName) => {
    return user?.favoriteChampions?.includes(champName) || false
  }

  const isFavoriteItem = (itemName) => {
    return user?.favoriteItems?.includes(itemName) || false
  }

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
