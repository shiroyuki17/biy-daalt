import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import itemsFullData, { itemCategories } from '../data/itemsFullData'
import { getChampionImageUrl } from '../data/champions'
import { useAuth } from '../context/AuthContext'

const DD_VERSION = "14.8.1"

function getItemImageUrl(item) {
  if (item.imageUrl) return item.imageUrl
  return `https://ddragon.leagueoflegends.com/cdn/${DD_VERSION}/img/item/${item.id}.png`
}

function getCategoryIcon(cat) {
  const icons = {
    All: '✦', Starter: '🌱', Boots: '👟', Fighter: '⚔️',
    Mage: '🔮', Marksman: '🏹', Assassin: '🗡️', Tank: '🛡️', Support: '💚'
  }
  return icons[cat] || '✦'
}

function getCategoryColor(cat) {
  const colors = {
    Starter: '#8bb83a', Boots: '#4da6ff', Fighter: '#ff6b4a',
    Mage: '#b86aff', Marksman: '#ffaa2d', Assassin: '#ff2d55',
    Tank: '#4dd4ac', Support: '#4da6ff'
  }
  return colors[cat] || '#A7D129'
}

function Items() {
  const navigate = useNavigate()
  const { user, toggleFavoriteItem, isFavoriteItem } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [dbItems, setDbItems] = useState([])

  useEffect(() => {
    const fetchDbItems = async () => {
      try {
        const { gameContentAPI } = await import('../api')
        const res = await gameContentAPI.getItems()
        if (res.success && res.items) {
          setDbItems(res.items)
        }
      } catch (err) {
        console.error('Failed to load items from DB:', err)
      }
    }
    fetchDbItems()
  }, [])

  const allItems = useMemo(() => {
    const merged = [...itemsFullData]
    dbItems.forEach(dbItem => {
      const idx = merged.findIndex(i => i.name.toLowerCase() === dbItem.name.toLowerCase())
      const formatted = {
        id: dbItem.id,
        name: dbItem.name,
        category: dbItem.type || 'Basic',
        price: dbItem.price || 0,
        description: dbItem.description || '',
        stats: dbItem.stats ? dbItem.stats.split(',').map(s => s.trim()) : [],
        imageUrl: dbItem.imageUrl || null,
        tags: [],
        recommendedChampions: []
      }
      if (idx > -1) {
        merged[idx] = { ...merged[idx], ...formatted, tags: merged[idx].tags, recommendedChampions: merged[idx].recommendedChampions }
      } else {
        merged.push(formatted)
      }
    })
    return merged
  }, [dbItems])

  const filtered = useMemo(() => {
    return allItems.filter(item => {
      const matchName = item.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'All' || item.category === category
      return matchName && matchCat
    })
  }, [search, category, allItems])

  const handleItemClick = (item) => {
    setSelectedItem(selectedItem?.name === item.name ? null : item)
  }

  const handleFav = (e, itemName) => {
    e.stopPropagation()
    if (!user) {
      navigate('/profile')
      return
    }
    toggleFavoriteItem(itemName)
  }

  return (
    <div className="items-page">
      <div className="items-header">
        <h1 className="page-title">LEAGUE OF LEGENDS ITEMS<br /><span className="highlight-text">DATABASE & GUIDE</span></h1>
        <p className="page-desc">
          Browse <span className="highlight-text">{itemsFullData.length} items</span> with stats, descriptions, and recommended champions.
        </p>
      </div>

      <div className="items-filters" id="item-filters">
        <div className="filter-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input"
            id="item-search-input"
          />
        </div>

        <div className="filter-roles">
          {itemCategories.map(cat => (
            <button
              key={cat}
              className={`role-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
              id={`cat-${cat.toLowerCase()}`}
            >
              {getCategoryIcon(cat)} {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="items-count">{filtered.length} items found</div>

      <div className="items-list-grid" id="items-grid">
        {filtered.map(item => (
          <div
            className={`item-card-full ${selectedItem?.name === item.name ? 'expanded' : ''}`}
            key={item.name}
            id={`item-${item.name.replace(/[\s']/g, '')}`}
            onClick={() => handleItemClick(item)}
          >
            <div className="item-card-top">
              <div className="item-card-img-wrap" style={{ borderColor: getCategoryColor(item.category) }}>
                <img
                  src={getItemImageUrl(item)}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3340.png' }}
                />
              </div>
              <div className="item-card-info">
                <h3 className="item-card-title">{item.name}</h3>
                <div className="item-card-meta">
                  <span className="item-cat-badge" style={{ background: getCategoryColor(item.category) + '22', color: getCategoryColor(item.category) }}>
                    {getCategoryIcon(item.category)} {item.category}
                  </span>
                  <span className="item-price">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffaa2d"><circle cx="12" cy="12" r="10" /><text x="12" y="16" textAnchor="middle" fill="#000" fontSize="12" fontWeight="bold">G</text></svg>
                    {item.price}
                  </span>
                </div>
              </div>
              <button
                className={`fav-btn item-fav-btn ${isFavoriteItem(item.name) ? 'fav-active' : ''}`}
                onClick={(e) => handleFav(e, item.name)}
                title={isFavoriteItem(item.name) ? 'Дуртай-аас хасах' : 'Дуртай нэмэх'}
              >
                {isFavoriteItem(item.name) ? '❤️' : '🤍'}
              </button>
            </div>

            <div className="item-card-stats">
              {item.stats.map((stat, i) => (
                <span key={i} className="item-stat-pill">{stat}</span>
              ))}
            </div>

            {selectedItem?.name === item.name && (
              <div className="item-card-expanded">
                <div className="item-card-desc">
                  <h4>Description</h4>
                  <p>{item.description}</p>
                </div>

                {item.tags.length > 0 && (
                  <div className="item-card-tags-section">
                    <h4>Tags</h4>
                    <div className="item-tag-list">
                      {item.tags.map(tag => (
                        <span key={tag} className="item-tag-chip">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {item.recommendedChampions.length > 0 && (
                  <div className="item-card-champs">
                    <h4>Best Champions</h4>
                    <div className="item-champ-list">
                      {item.recommendedChampions.map(name => (
                        <div
                          key={name}
                          className="item-champ-avatar"
                          title={name}
                          onClick={(e) => { e.stopPropagation(); navigate(`/champions/${name}`) }}
                        >
                          <img
                            src={getChampionImageUrl(name)}
                            alt={name}
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/29.png' }}
                          />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No items found</h3>
          <p>Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  )
}

export default Items
