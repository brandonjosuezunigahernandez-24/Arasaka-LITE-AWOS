import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './PatientDetail.css'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/patients/${id}`)
      .then(res => setPatient(res.data.data))
      .catch(() => setError('No se pudo cargar el paciente'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Perfil del Paciente" />
        <div className="page-body">
          <button className="back-btn" onClick={() => navigate('/patients')}>
            ← Regresar a pacientes
          </button>

          {loading && <p className="loading-text">Cargando datos...</p>}
          {error && <div className="error-box">{error}</div>}

          {patient && (
            <div className="detail-grid">
              <div className="card patient-header-card">
                <div className="patient-avatar-lg">
                  {patient.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="patient-name-lg">{patient.name}</h2>
                  <p className="patient-email">{patient.email}</p>
                </div>
              </div>

              <div className="card info-card">
                <div className="card-header"><h2>Datos Clínicos</h2></div>
                <div className="info-grid">
                  <InfoRow label="CURP" value={patient.profile?.curp} />
                  <InfoRow label="Tipo de Sangre">
                    {patient.profile?.blood_type
                      ? <span className="blood-badge">{patient.profile.blood_type}</span>
                      : '—'}
                  </InfoRow>
                  <InfoRow label="Peso" value={patient.profile?.weight_kg && `${patient.profile.weight_kg} kg`} />
                  <InfoRow label="Estatura" value={patient.profile?.height_cm && `${patient.profile.height_cm} cm`} />
                  <InfoRow label="Teléfono" value={patient.profile?.phone} />
                </div>
              </div>

              {patient.appointments && patient.appointments.length > 0 && (
                <div className="card appt-card">
                  <div className="card-header"><h2>Citas Recientes</h2></div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.appointments.map(a => (
                        <tr key={a.id}>
                          <td>{new Date(a.scheduled_at).toLocaleString('es-MX')}</td>
                          <td><StatusBadge status={a.status} /></td>
                          <td>{a.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, children }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{children ?? (value || '—')}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending: ['Pendiente', 'status-pending'],
    confirmed: ['Confirmada', 'status-confirmed'],
    cancelled: ['Cancelada', 'status-cancelled'],
  }
  const [label, cls] = map[status] || ['—', '']
  return <span className={`status-badge ${cls}`}>{label}</span>
}
