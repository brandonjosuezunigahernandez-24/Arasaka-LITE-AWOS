import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const navItems = [
  { to: '/', label: 'Inicio', icon: '⊞', exact: true },
  { to: '/patients', label: 'Pacientes', icon: '👥', doctorOnly: true },
  { to: '/appointments', label: 'Citas', icon: '📅' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const items = user?.role === 'doctor'
    ? navItems
    : navItems.filter(i => !i.doctorOnly)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">⚕</span>
        <span className="logo-text">ArasakaHealth</span>
      </div>

      <nav className="sidebar-nav">
        {items.map(({ to, label, icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="nav-item logout-btn" onClick={handleLogout}>
        <span className="nav-icon">🚪</span>
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  )
}
