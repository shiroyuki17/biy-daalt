import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Champions from './pages/Champions'
import ChampionDetail from './pages/ChampionDetail'
import TierList from './pages/TierList'
import Items from './pages/Items'
import DatabaseGuide from './pages/DatabaseGuide'

import AdminWorkspace from './pages/AdminWorkspace'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <main className="main-content">
      <div className="page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/champions" element={<Champions />} />
          <Route path="/champions/:championName" element={<ChampionDetail />} />
          <Route path="/tierlist" element={<TierList />} />
          <Route path="/items" element={<Items />} />
          <Route path="/database" element={<DatabaseGuide />} />
          <Route path="/workspace" element={<AdminWorkspace />} />
        </Routes>
      </div>
    </main>
  )
}

function App() {
  useEffect(() => {
    const handlePointerMove = (event) => {
      const target = event.target.closest(
        '.champion-card, .champ-card, .tip-card, .item-card-full, .stat-card, .fav-item-card, .auth-card'
      )

      if (!target) return

      const rect = target.getBoundingClientRect()
      target.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      target.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }

    document.addEventListener('pointermove', handlePointerMove)
    return () => document.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return (
    <Router>
      <div className="app-layout">
        <div className="site-ambient" aria-hidden="true">
          <span className="ambient-ring ambient-ring-one"></span>
          <span className="ambient-ring ambient-ring-two"></span>
          <span className="ambient-strike ambient-strike-one"></span>
          <span className="ambient-strike ambient-strike-two"></span>
        </div>
        <Sidebar />
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App
