import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import champions, { getChampionImageUrl, getDifficultyColor } from '../data/champions'
import itemsFullData from '../data/itemsFullData'

const DD_VERSION = "14.8.1"

function getItemImageUrl(id) {
  return `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/item/${id}.png`
}

function Profile() {
  const { user, login, register, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editRole, setEditRole] = useState('')
  const [editRank, setEditRank] = useState('')
  const [editRegion, setEditRegion] = useState('')
  const [editNotes, setEditNotes] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Бүх талбарыг бөглөнө үү!')
      return
    }
    const result = await login(email.trim(), password)
    if (!result.success) setError(result.error)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !username.trim() || !password.trim()) {
      setError('Бүх талбарыг бөглөнө үү!')
      return
    }
    if (password.length < 6) {
      setError('Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой!')
      return
    }
    if (password !== confirmPw) {
      setError('Нууц үг таарахгүй байна!')
      return
    }
    const result = await register(email.trim(), username.trim(), password)
    if (!result.success) setError(result.error)
    else setSuccess('Амжилттай бүртгэгдлээ! 🎉')
  }

  const handleSaveProfile = () => {
    updateUser({
      mainRole: editRole,
      rank: editRank,
      region: editRegion,
      notes: editNotes
    })
    setEditMode(false)
  }

  const startEdit = () => {
    setEditRole(user.mainRole || '')
    setEditRank(user.rank || 'Unranked')
    setEditRegion(user.region || 'KR')
    setEditNotes(user.notes || '')
    setEditMode(true)
  }

  // Logged out → Show login/register form
  if (!user) {
    return (
      <div className="profile-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A7D129" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <h1 className="auth-title">{mode === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</h1>
              <p className="auth-subtitle">
                {mode === 'login'
                  ? 'Аккаунтаараа нэвтрэн favourite champion, item-ээ хадгалаарай'
                  : 'Шинэ аккаунт үүсгэж эхлээрэй'}
              </p>
            </div>

            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              >
                Нэвтрэх
              </button>
              <button
                className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setError(''); setSuccess('') }}
              >
                Бүртгүүлэх
              </button>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="auth-form">
              <div className="auth-field">
                <label>Имэйл</label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  id="auth-email"
                />
              </div>

              {mode === 'register' && (
                <div className="auth-field">
                  <label>Хэрэглэгчийн нэр</label>
                  <input
                    type="text"
                    placeholder="Summoner Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="auth-input"
                    id="auth-username"
                  />
                </div>
              )}

              <div className="auth-field">
                <label>Нууц үг</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  id="auth-password"
                />
              </div>

              {mode === 'register' && (
                <div className="auth-field">
                  <label>Нууц үг давтах</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="auth-input"
                    id="auth-confirm-password"
                  />
                </div>
              )}

              <button type="submit" className="auth-submit-btn" id="auth-submit">
                {mode === 'login' ? '🔑 Нэвтрэх' : '✨ Бүртгүүлэх'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Logged in → Show profile with favorites
  const favChamps = champions.filter(c => user.favoriteChampions?.includes(c.name))
  const favItems = itemsFullData.filter(i => user.favoriteItems?.includes(i.name))

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-card-wrapper">
        <div className="profile-banner">
          <div className="profile-banner-overlay"></div>
        </div>
        <div className="profile-main-card">
          <div className="profile-avatar">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${user.icon}.png`}
              alt="Icon"
            />
          </div>
          <h2 className="profile-name">
            {user.username}
            <span className="profile-tag">#{user.email.split('@')[0]}</span>
          </h2>
          <span className="profile-region-badge">🌍 {user.region}</span>
          <div className="profile-level">{user.rank} · {user.mainRole || 'No Role Set'}</div>

          <div className="profile-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-label">Fav Champions</div>
              <div className="stat-value highlight-text">{user.favoriteChampions?.length || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚔️</div>
              <div className="stat-label">Fav Items</div>
              <div className="stat-value">{user.favoriteItems?.length || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-label">Бүртгүүлсэн</div>
              <div className="stat-value" style={{ fontSize: '13px' }}>{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Edit Profile */}
          {editMode ? (
            <div className="profile-edit-section">
              <h3 className="profile-section-title">Профайл засах</h3>
              <div className="edit-grid">
                <div className="auth-field">
                  <label>Main Role</label>
                  <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="auth-input">
                    <option value="">Select Role</option>
                    <option value="Top">Top</option>
                    <option value="Jungle">Jungle</option>
                    <option value="Mid">Mid</option>
                    <option value="Bot">Bot</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div className="auth-field">
                  <label>Rank</label>
                  <select value={editRank} onChange={(e) => setEditRank(e.target.value)} className="auth-input">
                    {['Unranked','Iron','Bronze','Silver','Gold','Platinum','Emerald','Diamond','Master','Grandmaster','Challenger'].map(r =>
                      <option key={r} value={r}>{r}</option>
                    )}
                  </select>
                </div>
                <div className="auth-field">
                  <label>Region</label>
                  <select value={editRegion} onChange={(e) => setEditRegion(e.target.value)} className="auth-input">
                    {['NA','EUW','EUNE','KR','JP','BR','LAN','LAS','OCE','TR','RU','PH','SG','TH','TW','VN'].map(r =>
                      <option key={r} value={r}>{r}</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="auth-field" style={{ marginTop: '12px' }}>
                <label>Тэмдэглэл</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="auth-input"
                  rows="3"
                  placeholder="Өөрийн тухай..."
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="edit-actions">
                <button className="auth-submit-btn" onClick={handleSaveProfile}>💾 Хадгалах</button>
                <button className="refresh-btn" onClick={() => setEditMode(false)}>Цуцлах</button>
              </div>
            </div>
          ) : (
            <div className="profile-actions">
              <button className="auth-submit-btn" onClick={startEdit} style={{ marginRight: '8px' }}>✏️ Засах</button>
              <button className="refresh-btn logout-btn" onClick={logout}>🚪 Гарах</button>
            </div>
          )}

          {user.notes && !editMode && (
            <div className="profile-notes">
              <p>"{user.notes}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Favorite Champions */}
      <section className="profile-fav-section">
        <div className="section-header">
          <h2 className="section-title">❤️ ДУРТАЙ CHAMPION-УУД</h2>
          {favChamps.length > 0 && (
            <button className="explore-btn" onClick={() => navigate('/champions')}>Нэмэх →</button>
          )}
        </div>
        {favChamps.length > 0 ? (
          <div className="champion-grid">
            {favChamps.map(champ => (
              <div className="champion-card" key={champ.name} onClick={() => navigate(`/champions/${champ.name}`)} style={{ cursor: 'pointer' }}>
                <div className="card-tags">
                  {champ.tags.slice(0, 2).map(t => (
                    <span key={t} className="card-tag">{t === 'Fighter' ? '⚔️' : t === 'Mage' ? '🔮' : t === 'Assassin' ? '🗡️' : t === 'Marksman' ? '🏹' : t === 'Tank' ? '🛡️' : '💚'}</span>
                  ))}
                </div>
                <div className="card-avatar">
                  <img src={getChampionImageUrl(champ.name)} alt={champ.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png' }} />
                </div>
                <h3 className="card-name">{champ.name}</h3>
                <p className="card-title">{champ.title}</p>
                <div className="card-difficulty">
                  <span className="diff-dot" style={{ background: getDifficultyColor(champ.difficulty) }}></span>
                  <span>{champ.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-fav">
            <p>🏆 Champion хуудас руу орж дуртай champion-оо нэмээрэй!</p>
            <button className="explore-btn" onClick={() => navigate('/champions')}>Champions руу очих →</button>
          </div>
        )}
      </section>

      {/* Favorite Items */}
      <section className="profile-fav-section">
        <div className="section-header">
          <h2 className="section-title">⚔️ ДУРТАЙ ITEM-ҮҮД</h2>
          {favItems.length > 0 && (
            <button className="explore-btn" onClick={() => navigate('/items')}>Нэмэх →</button>
          )}
        </div>
        {favItems.length > 0 ? (
          <div className="fav-items-grid">
            {favItems.map(item => (
              <div className="fav-item-card" key={item.name} onClick={() => navigate('/items')}>
                <img
                  src={getItemImageUrl(item.id)}
                  alt={item.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3340.png' }}
                />
                <div className="fav-item-info">
                  <span className="fav-item-name">{item.name}</span>
                  <span className="fav-item-cat">{item.category} · {item.price}g</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-fav">
            <p>🗡️ Items хуудас руу орж дуртай item-ээ нэмээрэй!</p>
            <button className="explore-btn" onClick={() => navigate('/items')}>Items руу очих →</button>
          </div>
        )}
      </section>
    </div>
  )
}

export default Profile
