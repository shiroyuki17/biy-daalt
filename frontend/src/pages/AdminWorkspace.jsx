import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { gameContentAPI, adminAPI, gamesAPI } from '../api'

function AdminWorkspace() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('champions')

  // Data
  const [games, setGames] = useState([])
  const [champions, setChampions] = useState([])
  const [items, setItems] = useState([])
  const [runes, setRunes] = useState([])
  const [skills, setSkills] = useState([])
  const [spells, setSpells] = useState([])
  const [usersList, setUsersList] = useState([])

  // Form State
  const [champForm, setChampForm] = useState({ name: '', role: 'Top', difficulty: 'Medium', description: '', imageUrl: '', gameId: '', guideData: '' })
  const [itemForm, setItemForm] = useState({ name: '', type: 'Basic', description: '', price: 0, imageUrl: '', gameId: '', stats: '' })
  const [runeForm, setRuneForm] = useState({ name: '', type: 'Primary', description: '', imageUrl: '', gameId: '' })
  const [skillForm, setSkillForm] = useState({ name: '', description: '', damage: '', cooldown: '', manaCost: '', skillType: 'Q', championId: '' })
  const [spellForm, setSpellForm] = useState({ name: '', description: '', cooldown: 0, imageUrl: '', gameId: '' })

  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'EDITOR')) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const gRes = await gamesAPI.getAll()
      const fetchedGames = gRes.games || []
      setGames(fetchedGames)

      if (fetchedGames.length > 0) {
        const firstGameId = fetchedGames[0].id
        setChampForm(prev => ({ ...prev, gameId: firstGameId }))
        setItemForm(prev => ({ ...prev, gameId: firstGameId }))
        setRuneForm(prev => ({ ...prev, gameId: firstGameId }))
        setSpellForm(prev => ({ ...prev, gameId: firstGameId }))
      }

      const cRes = await gameContentAPI.getChampions()
      const fetchedChamps = cRes.champions || []
      setChampions(fetchedChamps)
      if (fetchedChamps.length > 0) {
        setSkillForm(prev => ({ ...prev, championId: fetchedChamps[0].id }))
      }

      const iRes = await gameContentAPI.getItems()
      setItems(iRes.items || [])

      const rRes = await gameContentAPI.getRunes()
      setRunes(rRes.runes || [])

      const sRes = await gameContentAPI.getSkills()
      setSkills(sRes.skills || [])

      const spRes = await gameContentAPI.getSpells()
      setSpells(spRes.spells || [])

      if (user.role === 'ADMIN') {
        const uRes = await adminAPI.getAllUsers()
        setUsersList(uRes.users || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    return (
      <div className="workspace-container">
        <h2>ÐÑÐ²Ñ‚Ñ€ÑÑ… ÑÑ€Ñ… Ñ…Ò¯Ñ€ÑÑ…Ð³Ò¯Ð¹ Ð±Ð°Ð¹Ð½Ð°</h2>
        <p>Ð­Ð½Ñ Ñ…ÑƒÑƒÐ´ÑÑ‹Ð³ Ð·Ó©Ð²Ñ…Ó©Ð½ ADMIN Ð±Ð¾Ð»Ð¾Ð½ EDITOR ÑÑ€Ñ…Ñ‚ÑÐ¹ Ñ…ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡ Ñ…Ð°Ñ€Ð°Ñ… Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ñ‚Ð¾Ð¹.</p>
      </div>
    )
  }

  const handleCreateChampion = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      let parsedGuideData = null
      if (champForm.guideData.trim()) {
        try { parsedGuideData = JSON.parse(champForm.guideData) }
        catch (e) { return setMessage('Guide Data JSON Ð±ÑƒÑ€ÑƒÑƒ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚Ñ‚Ð°Ð¹ Ð±Ð°Ð¹Ð½Ð°!') }
      }

      await gameContentAPI.createChampion({ ...champForm, guideData: parsedGuideData })
      setMessage('Ð‘Ð°Ð°Ñ‚Ð°Ñ€ Ð°Ð¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹ Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ!')
      setChampForm({ name: '', role: 'Top', difficulty: 'Medium', description: '', imageUrl: '', gameId: games[0]?.id || '', guideData: '' })
      loadData()
    } catch (err) {
      setMessage(`ÐÐ»Ð´Ð°Ð° Ð³Ð°Ñ€Ð»Ð°Ð°: ${err.message}`)
    }
  }

  const handleDeleteChampion = async (id) => {
    if (user.role !== 'ADMIN') {
      alert('Ð—Ó©Ð²Ñ…Ó©Ð½ ADMIN ÑƒÑÑ‚Ð³Ð°Ñ… ÑÑ€Ñ…Ñ‚ÑÐ¹.')
      return
    }
    if (window.confirm('Ð­Ð½Ñ Ð±Ð°Ð°Ñ‚Ñ€Ñ‹Ð³ ÑƒÑÑ‚Ð³Ð°Ñ… ÑƒÑƒ?')) {
      try {
        await gameContentAPI.deleteChampion(id)
        loadData()
      } catch (err) {
        alert(err.message)
      }
    }
  }

  // â”€â”€â”€ ITEM FUNCTIONS â”€â”€â”€
  const handleCreateItem = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await gameContentAPI.createItem(itemForm)
      setMessage('Item Ð°Ð¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹ Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ!')
      setItemForm({ name: '', type: 'Basic', description: '', price: 0, imageUrl: '', gameId: games[0]?.id || '', stats: '' })
      loadData()
    } catch (err) {
      setMessage(`ÐÐ»Ð´Ð°Ð°: ${err.message}`)
    }
  }

  const handleDeleteItem = async (id) => {
    if (user.role !== 'ADMIN') return alert('Ð—Ó©Ð²Ñ…Ó©Ð½ ADMIN ÑƒÑÑ‚Ð³Ð°Ñ… ÑÑ€Ñ…Ñ‚ÑÐ¹.')
    if (window.confirm('Ð£ÑÑ‚Ð³Ð°Ñ… ÑƒÑƒ?')) {
      try {
        await gameContentAPI.deleteItem(id)
        loadData()
      } catch (err) { alert(err.message) }
    }
  }

  // â”€â”€â”€ RUNE FUNCTIONS â”€â”€â”€
  const handleCreateRune = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await gameContentAPI.createRune(runeForm)
      setMessage('Rune Ð°Ð¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹ Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ!')
      setRuneForm({ name: '', type: 'Primary', description: '', imageUrl: '', gameId: games[0]?.id || '' })
      loadData()
    } catch (err) {
      setMessage(`ÐÐ»Ð´Ð°Ð°: ${err.message}`)
    }
  }

  const handleDeleteRune = async (id) => {
    if (user.role !== 'ADMIN') return alert('Ð—Ó©Ð²Ñ…Ó©Ð½ ADMIN ÑƒÑÑ‚Ð³Ð°Ñ… ÑÑ€Ñ…Ñ‚ÑÐ¹.')
    if (window.confirm('Ð£ÑÑ‚Ð³Ð°Ñ… ÑƒÑƒ?')) {
      try {
        await gameContentAPI.deleteRune(id)
        loadData()
      } catch (err) { alert(err.message) }
    }
  }

  // â”€â”€â”€ SKILL FUNCTIONS â”€â”€â”€
  const handleCreateSkill = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await gameContentAPI.createSkill({
        ...skillForm,
        championId: parseInt(skillForm.championId)
      })
      setMessage('Skill Ð°Ð¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹ Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ!')
      setSkillForm({ name: '', description: '', damage: '', cooldown: '', manaCost: '', skillType: 'Q', championId: champions[0]?.id || '' })
      loadData()
    } catch (err) {
      setMessage(`ÐÐ»Ð´Ð°Ð°: ${err.message}`)
    }
  }

  const handleDeleteSkill = async (id) => {
    if (user.role !== 'ADMIN') return alert('Ð—Ó©Ð²Ñ…Ó©Ð½ ADMIN ÑƒÑÑ‚Ð³Ð°Ñ… ÑÑ€Ñ…Ñ‚ÑÐ¹.')
    if (window.confirm('Ð£ÑÑ‚Ð³Ð°Ñ… ÑƒÑƒ?')) {
      try {
        await gameContentAPI.deleteSkill(id)
        loadData()
      } catch (err) { alert(err.message) }
    }
  }

  // â”€â”€â”€ SPELL FUNCTIONS â”€â”€â”€
  const handleCreateSpell = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await gameContentAPI.createSpell({
        ...spellForm,
        gameId: parseInt(spellForm.gameId),
        cooldown: parseInt(spellForm.cooldown) || 0
      })
      setMessage('Spell Ð°Ð¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹ Ð½ÑÐ¼ÑÐ³Ð´Ð»ÑÑ!')
      setSpellForm({ name: '', description: '', cooldown: 0, imageUrl: '', gameId: games[0]?.id || '' })
      loadData()
    } catch (err) {
      setMessage(`ÐÐ»Ð´Ð°Ð°: ${err.message}`)
    }
  }

  const handleDeleteSpell = async (id) => {
    if (user.role !== 'ADMIN') return alert('Ð—Ó©Ð²Ñ…Ó©Ð½ ADMIN ÑƒÑÑ‚Ð³Ð°Ñ… ÑÑ€Ñ…Ñ‚ÑÐ¹.')
    if (window.confirm('Ð£ÑÑ‚Ð³Ð°Ñ… ÑƒÑƒ?')) {
      try {
        await gameContentAPI.deleteSpell(id)
        loadData()
      } catch (err) { alert(err.message) }
    }
  }

  // â”€â”€â”€ USER FUNCTIONS (ADMIN ONLY) â”€â”€â”€
  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminAPI.updateRole(userId, newRole)
      setMessage('Ð­Ñ€Ñ… Ð°Ð¼Ð¶Ð¸Ð»Ñ‚Ñ‚Ð°Ð¹ ÑÐ¾Ð»Ð¸Ð³Ð´Ð»Ð¾Ð¾')
      loadData()
    } catch (err) { alert(err.message) }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Ð­Ð½Ñ Ñ…ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡Ð¸Ð¹Ð³ ÑƒÑÑ‚Ð³Ð°Ñ… ÑƒÑƒ?')) {
      try {
        await adminAPI.deleteUser(userId)
        setMessage('Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡ ÑƒÑÑ‚Ð³Ð°Ð³Ð´Ð»Ð°Ð°')
        loadData()
      } catch (err) { alert(err.message) }
    }
  }

  return (
    <div className="workspace-container" style={{ padding: '2rem', color: '#fff' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--c-primary)' }}>ÐÐ¶Ð»Ñ‹Ð½ Ñ‚Ð°Ð»Ð±Ð°Ñ€ (Workspace)</h1>

      <div className="workspace-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'champions' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('champions')}
        >
          Champions
        </button>
        <button
          className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>
        <button
          className={`btn ${activeTab === 'items' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
        <button
          className={`btn ${activeTab === 'runes' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('runes')}
        >
          Runes
        </button>
        <button
          className={`btn ${activeTab === 'spells' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('spells')}
        >
          Spells
        </button>
        {user.role === 'ADMIN' && (
          <button
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        )}
      </div>

      {message && <div className="alert" style={{ marginBottom: '1rem', padding: '1rem', background: '#333', borderRadius: '8px' }}>{message}</div>}

      {activeTab === 'champions' && (
        <div className="workspace-section">
          <h2>Ð¨Ð¸Ð½Ñ Ð‘Ð°Ð°Ñ‚Ð°Ñ€ (Champion) ÐÑÐ¼ÑÑ…</h2>
          <form onSubmit={handleCreateChampion} style={{ display: 'grid', gap: '1rem', background: 'var(--c-surface)', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
            <div>
              <label>Ð¢Ð¾Ð³Ð»Ð¾Ð¾Ð¼:</label>
              <select value={champForm.gameId} onChange={e => setChampForm({...champForm, gameId: e.target.value})} className="input">
                {games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div>
              <label>ÐÑÑ€:</label>
              <input type="text" value={champForm.name} onChange={e => setChampForm({...champForm, name: e.target.value})} className="input" required />
            </div>
            <div>
              <label>Ð”Ò¯Ñ€ (Role):</label>
              <select value={champForm.role} onChange={e => setChampForm({...champForm, role: e.target.value})} className="input">
                <option value="Top">Top</option>
                <option value="Jungle">Jungle</option>
                <option value="Mid">Mid</option>
                <option value="Bot">Bot</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div>
              <label>Ð¥Ò¯Ð½Ð´Ñ€ÑÐ»:</label>
              <select value={champForm.difficulty} onChange={e => setChampForm({...champForm, difficulty: e.target.value})} className="input">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label>Ð¢Ð°Ð¹Ð»Ð±Ð°Ñ€:</label>
              <textarea value={champForm.description} onChange={e => setChampForm({...champForm, description: e.target.value})} className="input" rows="3"></textarea>
            </div>
            <div>
              <label>Ð—ÑƒÑ€Ð³Ð¸Ð¹Ð½ URL:</label>
              <input type="text" value={champForm.imageUrl} onChange={e => setChampForm({...champForm, imageUrl: e.target.value})} className="input" placeholder="https://..." />
            </div>
            <div>
              <label>Guide Data (JSON Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚): <span style={{ fontSize: '0.8rem', color: '#888' }}>(ÐÑÐ¼ÑÐ»Ñ‚ Ð¼ÑÐ´ÑÑÐ»ÑÐ»)</span></label>
              <textarea
                value={champForm.guideData}
                onChange={e => setChampForm({...champForm, guideData: e.target.value})}
                className="input"
                rows="5"
                placeholder={`{\n  "winRate": "51.2%",\n  "items": { "starter": ["Doran's Blade"] },\n  "spells": ["Flash", "Ignite"]\n}`}
                style={{ fontFamily: 'monospace' }}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Ð¥Ð°Ð´Ð³Ð°Ð»Ð°Ñ…</button>
          </form>

          <h2 style={{ marginTop: '3rem' }}>ÐžÐ´Ð¾Ð¾ Ð±Ð°Ð¹Ð³Ð°Ð° Ð±Ð°Ð°Ñ‚Ñ€ÑƒÑƒÐ´</h2>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: 'var(--c-surface)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Ð—ÑƒÑ€Ð°Ð³</th>
                <th style={{ padding: '1rem' }}>ÐÑÑ€</th>
                <th style={{ padding: '1rem' }}>Ð”Ò¯Ñ€</th>
                <th style={{ padding: '1rem' }}>Ò®Ð¹Ð»Ð´ÑÐ»</th>
              </tr>
            </thead>
            <tbody>
              {champions.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{c.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <img src={c.imageUrl || `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${c.name}.png`} alt={c.name} width="40" height="40" style={{ borderRadius: '8px' }} onError={(e) => e.target.style.display = 'none'} />
                  </td>
                  <td style={{ padding: '1rem' }}>{c.name}</td>
                  <td style={{ padding: '1rem' }}>{c.role}</td>
                  <td style={{ padding: '1rem' }}>
                    {user.role === 'ADMIN' && (
                      <button onClick={() => handleDeleteChampion(c.id)} className="btn btn-outline" style={{ borderColor: 'red', color: 'red', padding: '0.25rem 0.5rem' }}>Ð£ÑÑ‚Ð³Ð°Ñ…</button>
                    )}
                  </td>
                </tr>
              ))}
              {champions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Ð‘Ð°Ð°Ñ‚Ð°Ñ€ Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="workspace-section">
          <h2>Ð¨Ð¸Ð½Ñ Ð­Ð´ Ð·Ò¯Ð¹Ð»Ñ (Item) ÐÑÐ¼ÑÑ…</h2>
          <form onSubmit={handleCreateItem} style={{ display: 'grid', gap: '1rem', background: 'var(--c-surface)', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
            <div>
              <label>Ð¢Ð¾Ð³Ð»Ð¾Ð¾Ð¼:</label>
              <select value={itemForm.gameId} onChange={e => setItemForm({...itemForm, gameId: e.target.value})} className="input">
                {games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div>
              <label>ÐÑÑ€:</label>
              <input type="text" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} className="input" required />
            </div>
            <div>
              <label>Ð¢Ó©Ñ€Ó©Ð» (Type):</label>
              <select value={itemForm.type} onChange={e => setItemForm({...itemForm, type: e.target.value})} className="input">
                <option value="Starter">Starter</option>
                <option value="Basic">Basic</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
                <option value="Mythic">Mythic</option>
              </select>
            </div>
            <div>
              <label>Ò®Ð½Ñ (Price):</label>
              <input type="number" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: e.target.value})} className="input" />
            </div>
            <div>
              <label>Stats (Ð¶Ð¸ÑˆÑÑ Ð½ÑŒ: +50 AD, +20% Crit):</label>
              <input type="text" value={itemForm.stats || ''} onChange={e => setItemForm({...itemForm, stats: e.target.value})} className="input" placeholder="+50 AD, +15% AS" />
            </div>
            <div>
              <label>Ð¢Ð°Ð¹Ð»Ð±Ð°Ñ€:</label>
              <textarea value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} className="input" rows="3"></textarea>
            </div>
            <div>
              <label>Ð—ÑƒÑ€Ð³Ð¸Ð¹Ð½ URL:</label>
              <input type="text" value={itemForm.imageUrl} onChange={e => setItemForm({...itemForm, imageUrl: e.target.value})} className="input" placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Ð¥Ð°Ð´Ð³Ð°Ð»Ð°Ñ…</button>
          </form>

          <h2 style={{ marginTop: '3rem' }}>ÐžÐ´Ð¾Ð¾ Ð±Ð°Ð¹Ð³Ð°Ð° Ð­Ð´ Ð·Ò¯Ð¹Ð»Ñ</h2>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: 'var(--c-surface)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Ð—ÑƒÑ€Ð°Ð³</th>
                <th style={{ padding: '1rem' }}>ÐÑÑ€</th>
                <th style={{ padding: '1rem' }}>Ð¢Ó©Ñ€Ó©Ð»</th>
                <th style={{ padding: '1rem' }}>Stats</th>
                <th style={{ padding: '1rem' }}>Ò®Ð½Ñ</th>
                <th style={{ padding: '1rem' }}>Ò®Ð¹Ð»Ð´ÑÐ»</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{i.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <img src={i.imageUrl || `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/${i.id}.png`} alt={i.name} width="40" height="40" style={{ borderRadius: '8px' }} onError={(e) => e.target.style.display = 'none'} />
                  </td>
                  <td style={{ padding: '1rem' }}>{i.name}</td>
                  <td style={{ padding: '1rem' }}>{i.type}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--c-primary)' }}>{i.stats || '-'}</td>
                  <td style={{ padding: '1rem' }}>{i.price}</td>
                  <td style={{ padding: '1rem' }}>
                    {user.role === 'ADMIN' && (
                      <button onClick={() => handleDeleteItem(i.id)} className="btn btn-outline" style={{ borderColor: 'red', color: 'red', padding: '0.25rem 0.5rem' }}>Ð£ÑÑ‚Ð³Ð°Ñ…</button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Ð­Ð´ Ð·Ò¯Ð¹Ð» Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'runes' && (
        <div className="workspace-section">
          <h2>Ð¨Ð¸Ð½Ñ Ð ÑƒÐ½ (Rune/Emblem) ÐÑÐ¼ÑÑ…</h2>
          <form onSubmit={handleCreateRune} style={{ display: 'grid', gap: '1rem', background: 'var(--c-surface)', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
            <div>
              <label>Ð¢Ð¾Ð³Ð»Ð¾Ð¾Ð¼:</label>
              <select value={runeForm.gameId} onChange={e => setRuneForm({...runeForm, gameId: e.target.value})} className="input">
                {games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div>
              <label>ÐÑÑ€:</label>
              <input type="text" value={runeForm.name} onChange={e => setRuneForm({...runeForm, name: e.target.value})} className="input" required />
            </div>
            <div>
              <label>Ð¢Ó©Ñ€Ó©Ð» (Type):</label>
              <select value={runeForm.type} onChange={e => setRuneForm({...runeForm, type: e.target.value})} className="input">
                <option value="Keystone">Keystone</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>
            <div>
              <label>Ð¢Ð°Ð¹Ð»Ð±Ð°Ñ€:</label>
              <textarea value={runeForm.description} onChange={e => setRuneForm({...runeForm, description: e.target.value})} className="input" rows="3"></textarea>
            </div>
            <div>
              <label>Ð—ÑƒÑ€Ð³Ð¸Ð¹Ð½ URL:</label>
              <input type="text" value={runeForm.imageUrl} onChange={e => setRuneForm({...runeForm, imageUrl: e.target.value})} className="input" placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Ð¥Ð°Ð´Ð³Ð°Ð»Ð°Ñ…</button>
          </form>

          <h2 style={{ marginTop: '3rem' }}>ÐžÐ´Ð¾Ð¾ Ð±Ð°Ð¹Ð³Ð°Ð° Ð ÑƒÐ½</h2>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: 'var(--c-surface)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Ð—ÑƒÑ€Ð°Ð³</th>
                <th style={{ padding: '1rem' }}>ÐÑÑ€</th>
                <th style={{ padding: '1rem' }}>Ð¢Ó©Ñ€Ó©Ð»</th>
                <th style={{ padding: '1rem' }}>Ò®Ð¹Ð»Ð´ÑÐ»</th>
              </tr>
            </thead>
            <tbody>
              {runes.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{r.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <img src={r.imageUrl} alt={r.name} width="40" height="40" style={{ borderRadius: '8px' }} onError={(e) => e.target.style.display = 'none'} />
                  </td>
                  <td style={{ padding: '1rem' }}>{r.name}</td>
                  <td style={{ padding: '1rem' }}>{r.type}</td>
                  <td style={{ padding: '1rem' }}>
                    {user.role === 'ADMIN' && (
                      <button onClick={() => handleDeleteRune(r.id)} className="btn btn-outline" style={{ borderColor: 'red', color: 'red', padding: '0.25rem 0.5rem' }}>Ð£ÑÑ‚Ð³Ð°Ñ…</button>
                    )}
                  </td>
                </tr>
              ))}
              {runes.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Ð ÑƒÐ½ Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && user.role === 'ADMIN' && (
        <div className="workspace-section">
          <h2>Ð¥ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡Ð¸Ð´ Ð±Ð¾Ð»Ð¾Ð½ ÐÐ¶Ð¸Ð»Ñ‡Ð¸Ð´ (Users)</h2>
          <div style={{ background: 'var(--c-surface)', padding: '1rem', borderRadius: '12px', marginTop: '1rem', display: 'inline-block' }}>
            <strong>ÐÐ¸Ð¹Ñ‚ Ð±Ò¯Ñ€Ñ‚Ð³ÑÐ»Ñ‚ÑÐ¹ Ñ…ÑÑ€ÑÐ³Ð»ÑÐ³Ñ‡:</strong> <span style={{ color: 'var(--c-primary)', fontSize: '1.2rem', marginLeft: '0.5rem' }}>{usersList.length}</span>
          </div>

          <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse', background: 'var(--c-surface)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>ÐÑÑ€</th>
                <th style={{ padding: '1rem' }}>Ð˜-Ð¼ÑÐ¹Ð»</th>
                <th style={{ padding: '1rem' }}>Ð­Ñ€Ñ… (Role)</th>
                <th style={{ padding: '1rem' }}>Ò®Ð¹Ð»Ð´ÑÐ»</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{u.id}</td>
                  <td style={{ padding: '1rem' }}>{u.username}</td>
                  <td style={{ padding: '1rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                      className="input"
                      style={{ padding: '0.25rem', width: 'auto' }}
                      disabled={u.id === user.id} // Ó¨Ó©Ñ€Ð¸Ð¹Ð½Ñ…Ó©Ó© ÑÑ€Ñ…Ð¸Ð¹Ð³ ÑÐ¾Ð»Ð¸Ñ…Ð³Ò¯Ð¹
                    >
                      <option value="USER">USER</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {u.id !== user.id && (
                      <button onClick={() => handleDeleteUser(u.id)} className="btn btn-outline" style={{ borderColor: 'red', color: 'red', padding: '0.25rem 0.5rem' }}>Ð£ÑÑ‚Ð³Ð°Ñ…</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'skills' && (
        <div className="workspace-section">
          <h2>Ð¨Ð¸Ð½Ñ Ð§Ð°Ð´Ð²Ð°Ñ€ (Skill) ÐÑÐ¼ÑÑ…</h2>
          <form onSubmit={handleCreateSkill} style={{ display: 'grid', gap: '1rem', background: 'var(--c-surface)', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
            <div>
              <label>Champion (Ð‘Ð°Ð°Ñ‚Ð°Ñ€):</label>
              <select value={skillForm.championId} onChange={e => setSkillForm({...skillForm, championId: e.target.value})} className="input" required>
                <option value="">-- Ð‘Ð°Ð°Ñ‚Ð°Ñ€ ÑÐ¾Ð½Ð³Ð¾ --</option>
                {champions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label>Ð§Ð°Ð´Ð²Ð°Ñ€Ñ‹Ð½ Ñ‚Ó©Ñ€Ó©Ð» (Skill Type):</label>
              <select value={skillForm.skillType} onChange={e => setSkillForm({...skillForm, skillType: e.target.value})} className="input">
                <option value="Passive">Passive</option>
                <option value="Q">Q</option>
                <option value="W">W</option>
                <option value="E">E</option>
                <option value="R">R</option>
              </select>
            </div>
            <div>
              <label>ÐÑÑ€:</label>
              <input type="text" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className="input" required />
            </div>
            {skillForm.skillType !== 'Passive' && (
              <>
                <div>
                  <label>Damage (Ð¶Ð¸ÑˆÑÑ Ð½ÑŒ: 80/120/160/200/240):</label>
                  <input type="text" value={skillForm.damage || ''} onChange={e => setSkillForm({...skillForm, damage: e.target.value})} className="input" />
                </div>
                <div>
                  <label>Cooldown (Ð¶Ð¸ÑˆÑÑ Ð½ÑŒ: 10/9/8/7/6):</label>
                  <input type="text" value={skillForm.cooldown || ''} onChange={e => setSkillForm({...skillForm, cooldown: e.target.value})} className="input" />
                </div>
                <div>
                  <label>Mana Cost (Ð¶Ð¸ÑˆÑÑ Ð½ÑŒ: 50/55/60/65/70):</label>
                  <input type="text" value={skillForm.manaCost || ''} onChange={e => setSkillForm({...skillForm, manaCost: e.target.value})} className="input" />
                </div>
              </>
            )}
            <div>
              <label>Ð¢Ð°Ð¹Ð»Ð±Ð°Ñ€:</label>
              <textarea value={skillForm.description} onChange={e => setSkillForm({...skillForm, description: e.target.value})} className="input" rows="3" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Ð¥Ð°Ð´Ð³Ð°Ð»Ð°Ñ…</button>
          </form>

          <h2 style={{ marginTop: '3rem' }}>ÐžÐ´Ð¾Ð¾ Ð±Ð°Ð¹Ð³Ð°Ð° Ð§Ð°Ð´Ð²Ð°Ñ€ÑƒÑƒÐ´</h2>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: 'var(--c-surface)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Ð‘Ð°Ð°Ñ‚Ð°Ñ€</th>
                <th style={{ padding: '1rem' }}>Ð¢Ó©Ñ€Ó©Ð»</th>
                <th style={{ padding: '1rem' }}>ÐÑÑ€</th>
                <th style={{ padding: '1rem' }}>Stats</th>
                <th style={{ padding: '1rem' }}>Ò®Ð¹Ð»Ð´ÑÐ»</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{s.id}</td>
                  <td style={{ padding: '1rem' }}>{s.champion?.name || s.championId}</td>
                  <td style={{ padding: '1rem' }}><span className={`lane-badge ${s.skillType}`} style={{ padding: '0.2rem 0.5rem', background: '#333', borderRadius: '4px' }}>{s.skillType}</span></td>
                  <td style={{ padding: '1rem' }}>{s.name}</td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#ccc' }}>
                    {s.skillType !== 'Passive' ? `CD: ${s.cooldown || '-'} | Mana: ${s.manaCost || '-'} | Dmg: ${s.damage || '-'}` : 'Passive'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {user.role === 'ADMIN' && (
                      <button onClick={() => handleDeleteSkill(s.id)} className="btn btn-outline" style={{ borderColor: 'red', color: 'red', padding: '0.25rem 0.5rem' }}>Ð£ÑÑ‚Ð³Ð°Ñ…</button>
                    )}
                  </td>
                </tr>
              ))}
              {skills.length === 0 && (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Ð§Ð°Ð´Ð²Ð°Ñ€ Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'spells' && (
        <div className="workspace-section">
          <h2>Ð¨Ð¸Ð½Ñ Summoner Spell ÐÑÐ¼ÑÑ…</h2>
          <form onSubmit={handleCreateSpell} style={{ display: 'grid', gap: '1rem', background: 'var(--c-surface)', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
            <div>
              <label>Ð¢Ð¾Ð³Ð»Ð¾Ð¾Ð¼:</label>
              <select value={spellForm.gameId} onChange={e => setSpellForm({...spellForm, gameId: e.target.value})} className="input">
                {games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div>
              <label>ÐÑÑ€ (Ð¶Ð¸ÑˆÑÑ: Flash, Ignite):</label>
              <input type="text" value={spellForm.name} onChange={e => setSpellForm({...spellForm, name: e.target.value})} className="input" required />
            </div>
            <div>
              <label>Cooldown (ÑÐµÐºÑƒÐ½Ð´ÑÑÑ€):</label>
              <input type="number" value={spellForm.cooldown} onChange={e => setSpellForm({...spellForm, cooldown: e.target.value})} className="input" />
            </div>
            <div>
              <label>Ð¢Ð°Ð¹Ð»Ð±Ð°Ñ€:</label>
              <textarea value={spellForm.description} onChange={e => setSpellForm({...spellForm, description: e.target.value})} className="input" rows="3" required></textarea>
            </div>
            <div>
              <label>Ð—ÑƒÑ€Ð³Ð¸Ð¹Ð½ URL:</label>
              <input type="text" value={spellForm.imageUrl} onChange={e => setSpellForm({...spellForm, imageUrl: e.target.value})} className="input" placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Ð¥Ð°Ð´Ð³Ð°Ð»Ð°Ñ…</button>
          </form>

          <h2 style={{ marginTop: '3rem' }}>ÐžÐ´Ð¾Ð¾ Ð±Ð°Ð¹Ð³Ð°Ð° Spells</h2>
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', background: 'var(--c-surface)', borderRadius: '12px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Ð—ÑƒÑ€Ð°Ð³</th>
                <th style={{ padding: '1rem' }}>ÐÑÑ€</th>
                <th style={{ padding: '1rem' }}>CD (sec)</th>
                <th style={{ padding: '1rem' }}>Ò®Ð¹Ð»Ð´ÑÐ»</th>
              </tr>
            </thead>
            <tbody>
              {spells.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{s.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <img src={s.imageUrl || `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/spell/SummonerFlash.png`} alt={s.name} width="40" height="40" style={{ borderRadius: '8px' }} onError={(e) => e.target.style.display = 'none'} />
                  </td>
                  <td style={{ padding: '1rem' }}>{s.name}</td>
                  <td style={{ padding: '1rem' }}>{s.cooldown}s</td>
                  <td style={{ padding: '1rem' }}>
                    {user.role === 'ADMIN' && (
                      <button onClick={() => handleDeleteSpell(s.id)} className="btn btn-outline" style={{ borderColor: 'red', color: 'red', padding: '0.25rem 0.5rem' }}>Ð£ÑÑ‚Ð³Ð°Ñ…</button>
                    )}
                  </td>
                </tr>
              ))}
              {spells.length === 0 && (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Summoner Spell Ð¾Ð»Ð´ÑÐ¾Ð½Ð³Ò¯Ð¹</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminWorkspace
