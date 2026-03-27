import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'doctor' ? '/patients' : '/appointments')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-icon">⚕</span>
          <h1 className="login-brand">ArasakaHealth</h1>
        </div>
        <p className="login-subtitle">Acceso al Sistema</p>
        <p className="login-hint">Solo personal médico autorizado</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                placeholder="correo@ejemplo.com"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-switch-text">
          ¿No tienes cuenta? <Link to="/register" className="auth-switch-link">Regístrate aquí</Link>
        </p>

        <p className="login-footer">
          Sistema de gestión médica seguro — ArasakaHealth v1.0
        </p>
      </div>
    </div>
  )
}
