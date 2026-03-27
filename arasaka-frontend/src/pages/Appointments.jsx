import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Appointments.css'

const STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
}

export default function Appointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ doctor_id: '', scheduled_at: '', notes: '' })
  const [doctors, setDoctors] = useState([])
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/appointments')
      .then(res => setAppointments(res.data.data))
      .catch(() => setError('No se pudieron cargar las citas'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    // Patients need a list of doctors to book with; doctors register as 'doctor' role
    // We fetch patients list if user is doctor, otherwise we try a workaround
    if (user?.role === 'patient') {
      // Fetch from a known endpoint — in our API doctors aren't listed separately,
      // so we use a hardcoded search or let user type doctor_id manually.
      // For a better UX we just show the field as a number input.
    }
  }, [user])

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}`, { status })
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Error al actualizar')
    }
  }

  const deleteAppt = async (id) => {
    if (!confirm('¿Eliminar esta cita?')) return
    try {
      await api.delete(`/appointments/${id}`)
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Error al eliminar')
    }
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/appointments', form)
      setShowForm(false)
      setForm({ doctor_id: '', scheduled_at: '', notes: '' })
      load()
    } catch (e) {
      alert(e.response?.data?.message || JSON.stringify(e.response?.data?.errors))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Citas Médicas" />
        <div className="page-body">

          {user?.role === 'patient' && (
            <div className="toolbar">
              <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? '✕ Cancelar' : '+ Nueva Cita'}
              </button>
            </div>
          )}

          {showForm && (
            <div className="card form-card">
              <div className="card-header"><h2>Agendar Cita</h2></div>
              <form onSubmit={submitForm} className="appt-form">
                <div className="form-group">
                  <label>ID del Médico</label>
                  <input
                    type="number"
                    value={form.doctor_id}
                    onChange={e => setForm({ ...form, doctor_id: e.target.value })}
                    placeholder="Ej. 1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha y Hora</label>
                  <input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Notas (opcional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Motivo de consulta..."
                    rows={3}
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Confirmar Cita'}
                </button>
              </form>
            </div>
          )}

          {loading && <p className="loading-text">Cargando citas...</p>}
          {error && <div className="error-box">{error}</div>}

          {!loading && !error && (
            <div className="card">
              <div className="card-header">
                <h2>Listado de Citas</h2>
                <span className="badge">{appointments.length} citas</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan={7} className="empty-row">Sin citas registradas</td></tr>
                  ) : appointments.map((a, i) => (
                    <tr key={a.id}>
                      <td>{i + 1}</td>
                      <td className="name-cell">{a.patient?.name || `ID ${a.patient_id}`}</td>
                      <td>{a.doctor?.name || `ID ${a.doctor_id}`}</td>
                      <td>{new Date(a.scheduled_at).toLocaleString('es-MX')}</td>
                      <td>
                        <StatusBadge status={a.status} />
                      </td>
                      <td>{a.notes || <span className="na">—</span>}</td>
                      <td className="actions-cell">
                        {user?.role === 'doctor' && a.status === 'pending' && (
                          <button className="btn-confirm" onClick={() => changeStatus(a.id, 'confirmed')}>
                            Confirmar
                          </button>
                        )}
                        {a.status !== 'cancelled' && (
                          <button className="btn-cancel" onClick={() => changeStatus(a.id, 'cancelled')}>
                            Cancelar
                          </button>
                        )}
                        {user?.role === 'doctor' && (
                          <button className="btn-delete" onClick={() => deleteAppt(a.id)}>
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const cls = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled',
  }[status] || ''
  return <span className={`status-badge ${cls}`}>{STATUS_LABELS[status] || status}</span>
}
