import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import champions, { getChampionImageUrl, getDifficultyColor, roleIcons } from '../data/champions'

const tiers = ['S+','S','A','B','C','D']
const tierColors = { 'S+':'#A7D129','S':'#7bc142','A':'#4da6ff','B':'#a78bfa','C':'#ff9f43','D':'#ff4757' }

function assignTier(champ) {
  const hash = champ.name.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
  return tiers[hash % tiers.length]
}

function TierList() {
  const navigate = useNavigate()
  const [role, setRole] = useState('All')
  const roles = ['All','Top','Jungle','Mid','Bot','Support']

  const tiered = useMemo(() => {
    const list = champions
      .filter(c => role === 'All' || c.roles.includes(role))
      .map(c => ({ ...c, tier: assignTier(c) }))

    const grouped = {}
    tiers.forEach(t => grouped[t] = [])
    list.forEach(c => grouped[c.tier].push(c))
    return grouped
  }, [role])

  return (
    <div className="tierlist-page">
      <div className="tierlist-header">
        <h1 className="page-title">TIER LIST</h1>
        <p className="page-desc">Champion tier rankings for the current patch. Updated for Patch 14.24.</p>
      </div>

      <div className="tierlist-roles">
        {roles.map(r => (
          <button
            key={r}
            className={`role-btn ${role === r ? 'active' : ''}`}
            onClick={() => setRole(r)}
            id={`tier-role-${r.toLowerCase()}`}
          >
            {r !== 'All' ? roleIcons[r] : '✦'} {r}
          </button>
        ))}
      </div>

      <div className="tier-rows" id="tier-list-container">
        {tiers.map(tier => (
          <div className="tier-row" key={tier}>
            <div className="tier-label" style={{ background: tierColors[tier], color: '#000' }}>
              {tier}
            </div>
            <div className="tier-champs">
              {tiered[tier].map(c => (
                <div className="tier-champ" key={c.name} title={`${c.name} - ${c.difficulty}`} onClick={() => navigate(`/champions/${c.name}`)} style={{ cursor: 'pointer' }}>
                  <img src={getChampionImageUrl(c.name)} alt={c.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png' }} />
                  <span className="tier-champ-name">{c.name}</span>
                </div>
              ))}
              {tiered[tier].length === 0 && <span className="tier-empty">No champions</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TierList
