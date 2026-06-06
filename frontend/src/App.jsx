import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Champions from './pages/Champions'
import ChampionDetail from './pages/ChampionDetail'
import TierList from './pages/TierList'
import Items from './pages/Items'

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/champions" element={<Champions />} />
            <Route path="/champions/:championName" element={<ChampionDetail />} />
            <Route path="/tierlist" element={<TierList />} />
            <Route path="/items" element={<Items />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
