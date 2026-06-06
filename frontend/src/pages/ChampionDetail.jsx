import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import champions, { getChampionImageUrl, roleIcons, getDifficultyColor } from '../data/champions'
import { getChampionDetails } from '../data/championDetails'
import { useGameData } from '../data/useGameData'
import { useAuth } from '../context/AuthContext'

const normalizeName = (name) => name ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

const ItemDisplay = ({ name, itemsData }) => {
  const url = itemsData[name] || itemsData[normalizeName(name)] || null;
  return (
    <div className="cd-item" title={name}>
      {url ? <img src={url} alt={name} className="cd-item-img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3340.png' }} /> : <div className="cd-item-img placeholder"></div>}
      <span className="cd-item-name">{name}</span>
    </div>
  )
}

const RuneDisplay = ({ name, isKeystone, runesData }) => {
  const url = runesData[name] || runesData[normalizeName(name)] || null;
  return (
    <div className={`cd-rune ${isKeystone ? 'cd-rune-key' : ''}`} title={name}>
      {url ? <img src={url} alt={name} className="cd-rune-img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/RunesIcon.png' }} /> : <div className="cd-rune-img placeholder"></div>}
      <span className="cd-rune-name">{name}</span>
    </div>
  )
}

const SpellDisplay = ({ name, spellsData }) => {
  const url = spellsData[name] || spellsData[normalizeName(name)] || null;
  return (
    <div className="cd-spell" title={name}>
      {url ? <img src={url} alt={name} className="cd-spell-img" onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/spell/SummonerFlash.png' }} /> : <div className="cd-spell-img placeholder"></div>}
      <span className="cd-spell-name">{name}</span>
    </div>
  )
}

function getWinRateColor(wr) {
  const val = parseFloat(wr)
  if (val >= 52) return '#A7D129'
  if (val >= 50) return '#7bc142'
  if (val >= 48) return '#ffaa2d'
  return '#ff4d6a'
}

function ChampionDetail() {
  const { championName } = useParams()
  const navigate = useNavigate()
  const { user, toggleFavoriteChampion, isFavoriteChampion } = useAuth()
  const [details, setDetails] = useState(null)
  const [champion, setChampion] = useState(null)
  const { items, runes, spells, loading: dataLoading } = useGameData()

  useEffect(() => {
    const champ = champions.find(c => c.name === championName)
    if (champ) {
      setChampion(champ)
      setDetails(getChampionDetails(championName))
    }
  }, [championName])

  const handleFav = () => {
    if (!user) { navigate('/profile'); return }
    toggleFavoriteChampion(championName)
  }

  if (!champion || !details || dataLoading) {
    return (
      <div className="cd-page">
        <button className="cd-back" onClick={() => navigate('/champions')}>← Champions</button>
        <div className="cd-loading">
          <div className="cd-loading-spinner"></div>
          <p>Loading Champion Data...</p>
        </div>
      </div>
    )
  }

  const wrColor = getWinRateColor(details.winRate)

  return (
    <div className="cd-page">
      {/* Hero Banner */}
      <div className="cd-hero">
        <div className="cd-hero-bg">
          <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.name.replace(/[\s']/g, '')}_0.jpg`}
            alt="" onError={(e) => { e.target.style.display = 'none' }} />
        </div>
        <div className="cd-hero-overlay"></div>

        <div className="cd-hero-content">
          <button className="cd-back" onClick={() => navigate('/champions')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            Champions
          </button>

          <div className="cd-hero-info">
            <div className="cd-avatar-wrap">
              <img src={getChampionImageUrl(champion.name)} alt={champion.name} className="cd-avatar"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png' }} />
            </div>
            <div className="cd-hero-text">
              <div className="cd-name-row">
                <h1 className="cd-name">{champion.name}</h1>
                <button className={`cd-fav-btn ${isFavoriteChampion(champion.name) ? 'fav-active' : ''}`} onClick={handleFav}>
                  {isFavoriteChampion(champion.name) ? '❤️' : '🤍'}
                </button>
              </div>
              <p className="cd-title">{champion.title}</p>
              <div className="cd-badges">
                {champion.roles.map(r => (
                  <span key={r} className="cd-role-badge">{roleIcons[r]} {r}</span>
                ))}
                <span className="cd-diff-badge">
                  <span className="diff-dot" style={{ background: getDifficultyColor(champion.difficulty) }}></span>
                  {champion.difficulty}
                </span>
                <span className="cd-lane-badge">📍 {details.lane}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="cd-stats-bar">
        <div className="cd-stat-item cd-stat-wr">
          <div className="cd-stat-circle" style={{ borderColor: wrColor }}>
            <span className="cd-stat-val" style={{ color: wrColor }}>{details.winRate}</span>
          </div>
          <span className="cd-stat-lbl">Win Rate</span>
        </div>
        <div className="cd-stat-item">
          <span className="cd-stat-val">{details.pickRate}</span>
          <span className="cd-stat-lbl">Pick Rate</span>
        </div>
        <div className="cd-stat-item">
          <span className="cd-stat-val">{details.banRate}</span>
          <span className="cd-stat-lbl">Ban Rate</span>
        </div>
        <div className="cd-stat-item">
          <span className="cd-stat-val">{Number(details.matches).toLocaleString()}</span>
          <span className="cd-stat-lbl">Matches</span>
        </div>
      </div>

      {/* Builds Section */}
      <div className="cd-section">
        <div className="cd-section-header">
          <h2>📋 Recommended Builds</h2>
          <span className="cd-section-sub">Patch 14.24 · {details.lane}</span>
        </div>
        <div className="cd-builds">
          {details.recommendedBuilds.map((b, i) => (
            <div key={i} className={`cd-build-card ${i === 0 ? 'cd-build-popular' : 'cd-build-best'}`}>
              <div className="cd-build-badge">{i === 0 ? '🔥 Most Popular' : '👑 Highest WR'}</div>
              <div className="cd-build-stats">
                <div className="cd-build-wr">
                  <span className="cd-build-wr-val" style={{ color: getWinRateColor(b.winRate) }}>{b.winRate}</span>
                  <span className="cd-build-wr-lbl">Win Rate</span>
                </div>
                <div className="cd-build-matches">
                  <span className="cd-build-m-val">{Number(b.matches).toLocaleString()}</span>
                  <span className="cd-build-m-lbl">Matches</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="cd-grid">
        {/* Left Column */}
        <div className="cd-col">
          {/* Spells */}
          <div className="cd-section">
            <div className="cd-section-header">
              <h2>⚡ Summoner Spells</h2>
            </div>
            <div className="cd-spells-row">
              {details.spells.map((s, i) => (
                <SpellDisplay key={i} name={s} spellsData={spells} />
              ))}
            </div>
          </div>

          {/* Runes */}
          <div className="cd-section">
            <div className="cd-section-header">
              <h2>🔮 Runes</h2>
            </div>
            <div className="cd-runes-grid">
              <div className="cd-rune-tree cd-rune-primary">
                <h3 className="cd-tree-title">
                  <span className="cd-tree-dot" style={{ background: '#ff6b4a' }}></span>
                  {details.runes.primary.path}
                  <span className="cd-tree-label">PRIMARY</span>
                </h3>
                <RuneDisplay name={details.runes.primary.keystone} isKeystone={true} runesData={runes} />
                <div className="cd-rune-perks">
                  {details.runes.primary.perks.map(p => <RuneDisplay key={p} name={p} runesData={runes} />)}
                </div>
              </div>
              <div className="cd-rune-tree cd-rune-secondary">
                <h3 className="cd-tree-title">
                  <span className="cd-tree-dot" style={{ background: '#4da6ff' }}></span>
                  {details.runes.secondary.path}
                  <span className="cd-tree-label">SECONDARY</span>
                </h3>
                <div className="cd-rune-perks">
                  {details.runes.secondary.perks.map(p => <RuneDisplay key={p} name={p} runesData={runes} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Ability Order */}
          <div className="cd-section">
            <div className="cd-section-header">
              <h2>🎮 Ability Order</h2>
            </div>
            <div className="cd-abilities">
              {details.abilityOrder.map((ability, i) => (
                <div key={i} className={`cd-ability ${i === 0 ? 'cd-ability-max' : ''}`}>
                  <span className="cd-ability-key">{ability}</span>
                  <span className="cd-ability-label">
                    {i === 0 ? 'MAX 1ST' : i === 1 ? 'MAX 2ND' : 'MAX 3RD'}
                  </span>
                  {i < details.abilityOrder.length - 1 && <span className="cd-ability-arrow">›</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="cd-col">
          {/* Items */}
          <div className="cd-section">
            <div className="cd-section-header">
              <h2>🗡️ Item Build</h2>
            </div>
            <div className="cd-items-groups">
              <div className="cd-item-group">
                <h4 className="cd-item-group-title"><span className="cd-group-dot starter"></span>Starter</h4>
                <div className="cd-item-row">{details.items.starter.map(i => <ItemDisplay key={i} name={i} itemsData={items} />)}</div>
              </div>
              <div className="cd-item-group">
                <h4 className="cd-item-group-title"><span className="cd-group-dot early"></span>Early</h4>
                <div className="cd-item-row">{details.items.early.map(i => <ItemDisplay key={i} name={i} itemsData={items} />)}</div>
              </div>
              <div className="cd-item-group cd-core-group">
                <h4 className="cd-item-group-title"><span className="cd-group-dot core"></span>Core Build <span className="cd-core-badge">⭐ CORE</span></h4>
                <div className="cd-item-row">{details.items.core.map(i => <ItemDisplay key={i} name={i} itemsData={items} />)}</div>
              </div>
              <div className="cd-item-group">
                <h4 className="cd-item-group-title"><span className="cd-group-dot full"></span>Full Build</h4>
                <div className="cd-item-row cd-item-row-wrap">{details.items.full.map(i => <ItemDisplay key={i} name={i} itemsData={items} />)}</div>
              </div>
              <div className="cd-item-group">
                <h4 className="cd-item-group-title"><span className="cd-group-dot situ"></span>Situational</h4>
                <div className="cd-item-row">{details.situationalItems.map(i => <ItemDisplay key={i} name={i} itemsData={items} />)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matchups */}
      <div className="cd-section cd-matchups-section">
        <div className="cd-section-header">
          <h2>⚔️ Matchups Overview</h2>
        </div>
        <div className="cd-matchups-grid">
          <div className="cd-matchup-col cd-matchup-weak">
            <div className="cd-matchup-header">
              <span className="cd-matchup-icon">🔴</span>
              <h3>Weak Against</h3>
            </div>
            {details.matchups.weakAgainst.map(m => (
              <div key={m.name} className="cd-matchup-row" onClick={() => navigate(`/champions/${m.name}`)} style={{ cursor: 'pointer' }}>
                <img src={getChampionImageUrl(m.name)} alt={m.name} className="cd-matchup-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png' }} />
                <span className="cd-matchup-name">{m.name}</span>
                <div className="cd-matchup-bar-wrap">
                  <div className="cd-matchup-bar cd-bar-lose" style={{ width: m.winRate }}></div>
                </div>
                <span className="cd-matchup-wr" style={{ color: '#ff4d6a' }}>{m.winRate}</span>
              </div>
            ))}
          </div>
          <div className="cd-matchup-col cd-matchup-strong">
            <div className="cd-matchup-header">
              <span className="cd-matchup-icon">🟢</span>
              <h3>Strong Against</h3>
            </div>
            {details.matchups.strongAgainst.map(m => (
              <div key={m.name} className="cd-matchup-row" onClick={() => navigate(`/champions/${m.name}`)} style={{ cursor: 'pointer' }}>
                <img src={getChampionImageUrl(m.name)} alt={m.name} className="cd-matchup-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png' }} />
                <span className="cd-matchup-name">{m.name}</span>
                <div className="cd-matchup-bar-wrap">
                  <div className="cd-matchup-bar cd-bar-win" style={{ width: m.winRate }}></div>
                </div>
                <span className="cd-matchup-wr" style={{ color: '#A7D129' }}>{m.winRate}</span>
              </div>
            ))}
          </div>
          <div className="cd-matchup-col cd-matchup-synergy">
            <div className="cd-matchup-header">
              <span className="cd-matchup-icon">🔵</span>
              <h3>Best Synergy</h3>
            </div>
            {details.matchups.synergy.map(m => (
              <div key={m.name} className="cd-matchup-row" onClick={() => navigate(`/champions/${m.name}`)} style={{ cursor: 'pointer' }}>
                <img src={getChampionImageUrl(m.name)} alt={m.name} className="cd-matchup-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png' }} />
                <span className="cd-matchup-name">{m.name}</span>
                <div className="cd-matchup-bar-wrap">
                  <div className="cd-matchup-bar cd-bar-synergy" style={{ width: m.winRate }}></div>
                </div>
                <span className="cd-matchup-wr" style={{ color: '#4da6ff' }}>{m.winRate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChampionDetail
