import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar({ title }) {
  const { user } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-title">{title}</div>
      <div className="navbar-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">
              {user?.role === 'doctor' ? 'Médico' : 'Paciente'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
