import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'doctor') return <Navigate to="/patients" replace />
  return <Navigate to="/appointments" replace />
}
