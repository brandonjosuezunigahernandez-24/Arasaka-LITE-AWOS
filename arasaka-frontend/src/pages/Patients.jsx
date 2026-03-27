import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import './Patients.css'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/patients')
      .then(res => setPatients(res.data.data))
      .catch(() => setError('No se pudieron cargar los pacientes'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Pacientes Registrados" />
        <div className="page-body">
          {loading && <p className="loading-text">Cargando pacientes...</p>}
          {error && <div className="error-box">{error}</div>}
          {!loading && !error && (
            <div className="card">
              <div className="card-header">
                <h2>Listado de Pacientes</h2>
                <span className="badge">{patients.length} registros</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Tipo Sangre</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr><td colSpan={6} className="empty-row">Sin pacientes registrados</td></tr>
                  ) : patients.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td className="name-cell">{p.name}</td>
                      <td>{p.email}</td>
                      <td>
                        {p.profile?.blood_type
                          ? <span className="blood-badge">{p.profile.blood_type}</span>
                          : <span className="na">—</span>}
                      </td>
                      <td>{p.profile?.phone || <span className="na">—</span>}</td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/patients/${p.id}`)}
                        >
                          Ver perfil
                        </button>
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
