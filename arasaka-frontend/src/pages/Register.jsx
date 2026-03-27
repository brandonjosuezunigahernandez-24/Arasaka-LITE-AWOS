import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const initialForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'patient',
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await register(form)
      navigate(user.role === 'doctor' ? '/patients' : '/appointments')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors && typeof errors === 'object') {
        const message = Object.values(errors).flat().join(' ')
        setError(message)
      } else {
        setError(err.response?.data?.message || 'No se pudo completar el registro')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card auth-card-wide">
        <div className="login-logo">
          <span className="login-logo-icon">⚕</span>
          <h1 className="login-brand">ArasakaHealth</h1>
        </div>
        <p className="login-subtitle">Crear Cuenta</p>
        <p className="login-hint">Registro de usuario clínico dentro del sistema</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="Nombre del usuario"
                required
                autoFocus
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div className="form-group">
            <label>Rol</label>
            <div className="input-wrap input-wrap-select">
              <span className="input-icon">🏷</span>
              <select name="role" value={form.role} onChange={handle} required>
                <option value="patient">Paciente</option>
                <option value="doctor">Médico</option>
              </select>
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
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <div className="input-wrap">
              <span className="input-icon">🔐</span>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handle}
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrar usuario'}
          </button>
        </form>

        <p className="auth-switch-text">
          ¿Ya tienes cuenta? <Link to="/login" className="auth-switch-link">Inicia sesión</Link>
        </p>

        <p className="login-footer">
          Los usuarios registrados reciben token y acceso inmediato según su rol.
        </p>
      </div>
    </div>
  )
}