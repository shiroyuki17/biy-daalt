import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
)
const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const ChampIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
)
const TierIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
)
const ItemsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-4l-2-3H10L8 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>
)
const WorkspaceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
)
const DatabaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/></svg>
)

const navItems = [
  { path: '/', icon: <HomeIcon />, label: 'Home' },
  { path: '/profile', icon: <ProfileIcon />, label: 'Profile' },
  { path: '/champions', icon: <ChampIcon />, label: 'Champions' },
  { path: '/items', icon: <ItemsIcon />, label: 'Items' },
  { path: '/tierlist', icon: <TierIcon />, label: 'Tier List' },
  { path: '/database', icon: <DatabaseIcon />, label: 'Database' },
]

function Sidebar() {
  const { user } = useAuth()

  return (
    <nav className="sidebar" id="main-sidebar">
      <div className="sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A7D129" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </div>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.path === '/profile' && user && (
                <span className="nav-user-dot"></span>
              )}
            </NavLink>
          </li>
        ))}
        {user && (user.role === 'ADMIN' || user.role === 'EDITOR') && (
          <li>
            <NavLink
              to="/workspace"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              id="nav-workspace"
              title="Workspace"
            >
              <span className="nav-icon"><WorkspaceIcon /></span>
            </NavLink>
          </li>
        )}
      </ul>
      <div className="sidebar-footer">
        {user ? (
          <div className="sidebar-user-badge" title={user.username}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${user.icon}.png`}
              alt="avatar"
              className="sidebar-user-avatar"
            />
          </div>
        ) : (
          <div className="patch-badge">14.24</div>
        )}
      </div>
    </nav>
  )
}

export default Sidebar
