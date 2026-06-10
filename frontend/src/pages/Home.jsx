import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import champions, { getChampionImageUrl, getDifficultyColor } from '../data/champions'

const featured = ['Yasuo','Jinx','Ahri','Thresh','Lee Sin','Lux','Zed','Kai\'Sa']

const tipsData = [
  {
    id: 'map',
    icon: '🗺️',
    title: 'Map Awareness',
    summary: 'Always keep an eye on the minimap. Check it every few seconds to track enemy movements.',
    details: [
      { point: 'Minimap-аа 3 секунд тутамд шалга', desc: 'Дайсны jungler хаана байгааг мэдэх нь ганк-аас зайлсхийхэд маш чухал.' },
      { point: 'Дайсан lane-аас алга болвол SS/MIA ping дар', desc: 'Бусад teammate-дээ анхааруулга өг. Энэ нь team-ийн амьдрал аврах боломжтой.' },
      { point: 'Ward-тай газар дээр fight хий', desc: 'Харанхуй газар руу нүүрээрээ явахаас зайлсхий. Fog of War-т дайсан хүлээж байж болно.' },
      { point: 'Дайсны summoner spell cooldown мэд', desc: 'Flash 5 минут, Teleport 6 минут. Timer тавьж fight-д давуу тал олж ав.' },
    ],
    relatedRole: 'Jungle',
    difficulty: 'Easy',
    importance: '⭐⭐⭐⭐⭐',
  },
  {
    id: 'cs',
    icon: '⚡',
    title: 'CS is King',
    summary: 'Focus on last-hitting minions. 15 CS roughly equals one kill in gold value.',
    details: [
      { point: 'Caster minion 2 tower shot + 1 AA', desc: 'Tower доор CS авах аргыг сура. Melee minion-д 2 shot + 1 AA, Caster-д 1 shot + 2 AA (эхний level-д).' },
      { point: '10 минутад 80+ CS-тэй бай', desc: 'Perfect CS нь 10 минутад 107. 80+ бол маш сайн, 60+ бол дундаж. Practice tool дээр бэлтгэ.' },
      { point: 'Kill хөөхгүйгээр farm хий', desc: '1 kill = ~300 gold. 15 CS = ~300 gold. Kill хөөж 15 CS алдахаас farm хийсэн нь дээр.' },
      { point: 'Side lane farm-ыг бүү мартаарай', desc: 'Mid-game-д хүн бүр mid-д цугларахаас side lane-ийн wave-ийг catch хий. Энэ нь маш их gold алдагдах шалтгаан болдог.' },
    ],
    relatedRole: 'Mid',
    difficulty: 'Average',
    importance: '⭐⭐⭐⭐⭐',
  },
  {
    id: 'vision',
    icon: '🎯',
    title: 'Vision Control',
    summary: 'Buy control wards every back. Vision wins games at every level of play.',
    details: [
      { point: 'Recall хийх бүрдээ Control Ward ав', desc: '75 gold-оор team-ийнхээ амьдрал аврах боломжтой. Хамгийн хямд бөгөөд үнэ цэнэтэй item.' },
      { point: 'Objective-ийн өмнө ward тавь', desc: 'Dragon/Baron spawns-ийн 1 минутын өмнө эргэн тойрныг ward-лаж бэлдээрэй.' },
      { point: 'Дайсны ward-ыг устга', desc: 'Oracle Lens (Red trinket) ашиглаж дайсны ward устга. Vision denial нь vision placement-тэй адил чухал.' },
      { point: 'Pixel brush ward', desc: 'River-ийн pixel brush дээр ward тавьвал 2 зүгийг нэгэн зэрэг хянаж болно. Маш effective ward location.' },
    ],
    relatedRole: 'Support',
    difficulty: 'Easy',
    importance: '⭐⭐⭐⭐',
  },
  {
    id: 'objective',
    icon: '🔥',
    title: 'Objective Focus',
    summary: 'Prioritize Dragons, Baron, and towers over chasing kills across the map.',
    details: [
      { point: 'Dragon > Kill', desc: 'Dragon soul нь team-fight-д асар их давуу тал өгдөг. 4 dragon = soul power. Энэ нь game-ийн хамгийн чухал objective.' },
      { point: 'Baron = 2-3 tower', desc: 'Baron buff-тэй minion маш хүчтэй. Push хийж tower авах боломж олгодог. Baron авсны дараа хамтдаа push хий.' },
      { point: 'Rift Herald-ийг эрт ав', desc: 'Rift Herald нь 14 минутын өмнө spawn болдог. First tower gold (150g/team) авахад тусална.' },
      { point: 'Ace-ийн дараа objective ав', desc: 'Team fight хожсоны дараа kill хөөхгүйгээр Baron/Dragon/Tower ав. Давуу тал бататга.' },
    ],
    relatedRole: 'Jungle',
    difficulty: 'Average',
    importance: '⭐⭐⭐⭐⭐',
  },
]

function Home() {
  const [search, setSearch] = useState('')
  const [expandedTip, setExpandedTip] = useState(null)
  const navigate = useNavigate()
  const featuredChamps = champions.filter(c => featured.includes(c.name))
  const heroChamps = featuredChamps.slice(0, 5)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/champions?search=${encodeURIComponent(search.trim())}`)
    }
  }

  const toggleTip = (id) => {
    setExpandedTip(expandedTip === id ? null : id)
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }} />
          ))}
        </div>
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-kicker">Patch 14.24 / Champion Guide System</div>
            <h1 className="hero-title">
              WIN MORE IN <span className="hero-highlight">LEAGUE OF LEGENDS</span>
            </h1>
            <p className="hero-subtitle">
              Your all-in-one gaming companion that helps players of all skill levels improve and climb.
            </p>
            <form className="hero-search" onSubmit={handleSearch} id="hero-search-form">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search Champion..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
                id="hero-search-input"
              />
            </form>
          </div>

          <div className="hero-showcase" aria-hidden="true">
            <div className="hero-orbit"></div>
            {heroChamps.map((champ, index) => (
              <div className={`hero-champ-card hero-champ-${index + 1}`} key={champ.name}>
                <img src={getChampionImageUrl(champ.name)} alt="" loading="eager" />
                <span>{champ.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-track-strip" aria-hidden="true">
          <div className="track-line">
            <span>CHAMPIONS</span>
            <span>RUNES</span>
            <span>ITEM BUILDS</span>
            <span>GUIDES</span>
            <span>SKILLS</span>
            <span>MATCHUPS</span>
            <span>CHAMPIONS</span>
            <span>RUNES</span>
            <span>ITEM BUILDS</span>
            <span>GUIDES</span>
            <span>SKILLS</span>
            <span>MATCHUPS</span>
          </div>
        </div>
      </div>

      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">FEATURED CHAMPIONS</h2>
          <button className="explore-btn" onClick={() => navigate('/champions')} id="explore-all-btn">
            Explore all Champions →
          </button>
        </div>
        <p className="section-desc">Looking to try out a new champion? Here are some of our favorite recommendations!</p>
        <div className="champion-grid">
          {featuredChamps.map(champ => (
            <div className="champion-card" key={champ.name} id={`featured-${champ.name.replace(/\s/g,'')}`} onClick={() => navigate(`/champions/${champ.name}`)} style={{ cursor: 'pointer' }}>
              <div className="card-tags">
                {champ.tags.slice(0,2).map(t => (
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
      </section>

      <section className="tips-section">
        <h2 className="section-title">PRO GAMING TIPS</h2>
        <p className="section-desc">Master these fundamentals to climb the ranked ladder. Click on each tip for detailed breakdown.</p>
        <div className="tips-grid">
          {tipsData.map(tip => (
            <div
              className={`tip-card ${expandedTip === tip.id ? 'tip-expanded' : ''}`}
              key={tip.id}
              id={`tip-${tip.id}`}
              onClick={() => toggleTip(tip.id)}
            >
              <div className="tip-card-header">
                <div className="tip-icon">{tip.icon}</div>
                <div className="tip-header-info">
                  <h3>{tip.title}</h3>
                  <div className="tip-meta">
                    <span className="tip-role-badge">{tip.relatedRole}</span>
                    <span className="tip-importance">{tip.importance}</span>
                  </div>
                </div>
                <span className={`tip-chevron ${expandedTip === tip.id ? 'open' : ''}`}>▼</span>
              </div>
              <p className="tip-summary">{tip.summary}</p>

              {expandedTip === tip.id && (
                <div className="tip-details">
                  {tip.details.map((d, i) => (
                    <div className="tip-detail-item" key={i}>
                      <div className="tip-detail-num">{i + 1}</div>
                      <div className="tip-detail-content">
                        <strong>{d.point}</strong>
                        <p>{d.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="tip-footer">
                    <span className="tip-diff-badge">
                      <span className="diff-dot" style={{ background: getDifficultyColor(tip.difficulty) }}></span>
                      {tip.difficulty}
                    </span>
                    <button
                      className="explore-btn"
                      onClick={(e) => { e.stopPropagation(); navigate('/champions') }}
                    >
                      Champions харах →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
