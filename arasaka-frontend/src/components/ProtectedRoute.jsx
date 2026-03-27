import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, onlyDoctor = false }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (onlyDoctor && user.role !== 'doctor') return <Navigate to="/appointments" replace />

  return children
}
