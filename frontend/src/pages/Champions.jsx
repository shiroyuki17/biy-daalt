import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import champions, { getChampionImageUrl, getDifficultyColor, roleIcons } from '../data/champions'
import { useAuth } from '../context/AuthContext'

const allRoles = ['All','Top','Jungle','Mid','Bot','Support']
const allDiffs = ['Any Difficulty','Easy','Average','Hard','Severe']
const allTags = ['All','Fighter','Mage','Assassin','Marksman','Tank','Support']

function Champions() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, toggleFavoriteChampion, isFavoriteChampion } = useAuth()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [role, setRole] = useState('All')
  const [diff, setDiff] = useState('Any Difficulty')
  const [tag, setTag] = useState('All')

  const filtered = useMemo(() => {
    return champions.filter(c => {
      const matchName = c.name.toLowerCase().includes(search.toLowerCase())
      const matchRole = role === 'All' || c.roles.includes(role)
      const matchDiff = diff === 'Any Difficulty' || c.difficulty === diff
      const matchTag = tag === 'All' || c.tags.includes(tag)
      return matchName && matchRole && matchDiff && matchTag
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [search, role, diff, tag])

  const handleFav = (e, champName) => {
    e.stopPropagation()
    if (!user) {
      navigate('/profile')
      return
    }
    toggleFavoriteChampion(champName)
  }

  return (
    <div className="champions-page">
      <div className="champions-header">
        <h1 className="page-title">ALL LEAGUE OF LEGENDS CHAMPIONS,<br/>BUILDS AND STATS AT YOUR FINGERTIPS</h1>
        <p className="page-desc">
          There are <span className="highlight-text">{champions.length} champions</span> in LoL. Find builds, guides, and tips for every champion.
        </p>
      </div>

      <div className="champions-filters" id="champion-filters">
        <div className="filter-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by champion"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input"
            id="champion-search-input"
          />
        </div>

        <div className="filter-roles">
          {allRoles.map(r => (
            <button
              key={r}
              className={`role-btn ${role === r ? 'active' : ''}`}
              onClick={() => setRole(r)}
              id={`role-${r.toLowerCase()}`}
            >
              {r !== 'All' ? roleIcons[r] : '✦'} {r}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <select value={diff} onChange={(e) => setDiff(e.target.value)} className="filter-select" id="difficulty-filter">
            {allDiffs.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="filter-select" id="tag-filter">
            {allTags.map(t => <option key={t} value={t}>{t === 'All' ? 'All Classes' : t}</option>)}
          </select>
        </div>
      </div>

      <div className="champions-count">{filtered.length} champions found</div>

      <div className="champions-grid" id="champions-grid">
        {filtered.map(champ => (
          <div 
            className="champ-card" 
            key={champ.name} 
            id={`champ-${champ.name.replace(/[\s']/g,'')}`}
            onClick={() => navigate(`/champions/${champ.name}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="champ-card-tags">
              {champ.tags.slice(0,2).map(t => (
                <span key={t} className="champ-tag-icon">{t === 'Fighter' ? '⚔️' : t === 'Mage' ? '🔮' : t === 'Assassin' ? '🗡️' : t === 'Marksman' ? '🏹' : t === 'Tank' ? '🛡️' : '💚'}</span>
              ))}
            </div>
            <button
              className={`fav-btn ${isFavoriteChampion(champ.name) ? 'fav-active' : ''}`}
              onClick={(e) => handleFav(e, champ.name)}
              title={isFavoriteChampion(champ.name) ? 'Дуртай-аас хасах' : 'Дуртай нэмэх'}
            >
              {isFavoriteChampion(champ.name) ? '❤️' : '🤍'}
            </button>
            <div className="champ-card-roles">
              {champ.roles.map(r => (
                <span key={r} className="champ-role-icon" title={r}>{roleIcons[r]}</span>
              ))}
            </div>
            <div className="champ-avatar">
              <img src={getChampionImageUrl(champ.name)} alt={champ.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png' }} />
            </div>
            <h3 className="champ-name">{champ.name}</h3>
            <p className="champ-title">{champ.title}</p>
            <div className="champ-diff">
              <span className="diff-dot" style={{ background: getDifficultyColor(champ.difficulty) }}></span>
              {champ.difficulty}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No champions found</h3>
          <p>Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  )
}

export default Champions
