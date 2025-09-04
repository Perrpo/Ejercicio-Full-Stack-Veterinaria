import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client'
import PetsManagement from '../components/PetsManagement'
import AppointmentBooking from '../components/AppointmentBooking'
import ExamsManagement from '../components/ExamsManagement'
import MedicalHistory from '../components/MedicalHistory'
import PaymentsManagement from '../components/PaymentsManagement'
import ProfileManagement from '../components/ProfileManagement'

type Paciente = {
  id_paciente: number
  nombre: string
  especie: string
  raza: string
  edad: number
  peso: number
}

type Cita = {
  id_cita: number
  fecha_cita: string
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
  paciente_nombre: string
  servicio_nombre: string
}

type Examen = {
  id_examen: number
  fecha_examen: string
  tipo_examen: string
  resultado: string
  paciente_nombre: string
}

type Pago = {
  id_pago: number
  fecha_pago: string
  monto: number
  estado: 'pendiente' | 'pagado' | 'fallido'
  servicio_nombre: string
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!user || user.rol !== 'cliente') {
      navigate('/login')
    }
  }, [user, navigate])

  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [examenes, setExamenes] = useState<Examen[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'inicio' | 'mascotas' | 'citas' | 'examenes' | 'historial' | 'pagos' | 'perfil'>('inicio')

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  async function fetchUserData() {
    try {
      setLoading(true)
      
      // Obtener todos los datos del dashboard
      const dashboardData = await apiFetch('/client/dashboard')
      
      setPacientes(dashboardData.pacientes || [])
      setCitas(dashboardData.citas || [])
      setExamenes(dashboardData.examenes || [])
      setPagos(dashboardData.pagos || [])
    } catch (error) {
      console.error('Error al cargar datos:', error)
      // En caso de error, mostrar datos vacíos
      setPacientes([])
      setCitas([])
      setExamenes([])
      setPagos([])
    } finally {
      setLoading(false)
    }
  }

  function formatDate(iso: string) {
    const date = new Date(iso)
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  function getCurrentDate() {
    return formatDate(new Date().toISOString())
  }

  const totalPacientes = pacientes.length
  const citasProximas = citas.filter(c => c.estado === 'pendiente' || c.estado === 'confirmada').length
  const examenesRecientes = examenes.filter(e => {
    const fechaExamen = new Date(e.fecha_examen)
    const hace30Dias = new Date()
    hace30Dias.setDate(hace30Dias.getDate() - 30)
    return fechaExamen > hace30Dias
  }).length
  const pagosPendientes = pagos.filter(p => p.estado === 'pendiente').length

  // Función para renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return (
          <>
            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16
            }}>
              {[
                { label: 'Mascotas', value: totalPacientes, icon: '🐾', color: '#059669' },
                { label: 'Citas Próximas', value: citasProximas, icon: '📅', color: '#2563eb' },
                { label: 'Exámenes Recientes', value: examenesRecientes, icon: '📋', color: '#1d4ed8' },
                { label: 'Pagos Pendientes', value: pagosPendientes, icon: '⚠️', color: '#dc2626' }
              ].map((card, index) => (
                <div
                  key={index}
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: `2px solid ${card.color}20`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16
                  }}>
                    <span style={{ fontSize: 24 }}>{card.icon}</span>
                    <div style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: card.color
                    }}>
                      {card.value}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: '#6b7280',
                    fontWeight: 500
                  }}>
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Notificaciones */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '2px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>🔔</span>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                    Notificaciones
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: 16,
                color: '#6b7280',
                lineHeight: 1.6
              }}>
                Registra tu primera mascota para comenzar
              </div>
            </div>

            {/* Próximas Citas */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '2px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>📅</span>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#1f2937' }}>
                    Próximas Citas
                  </div>
                </div>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  + Nueva Cita
                </button>
              </div>
              
              {citas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📅</div>
                  <div style={{
                    fontSize: 18,
                    color: '#6b7280',
                    marginBottom: 24
                  }}>
                    No tienes citas próximas
                  </div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      padding: '12px 24px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    Agendar Primera Cita
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {citas.slice(0, 3).map((cita, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '16px 20px',
                        background: '#f8fafc',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#1f2937',
                            marginBottom: 4
                          }}>
                            {cita.servicio_nombre}
                          </div>
                          <div style={{
                            fontSize: 14,
                            color: '#6b7280'
                          }}>
                            {cita.paciente_nombre} • {formatDate(cita.fecha_cita)}
                          </div>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: cita.estado === 'confirmada' ? '#dbeafe' : '#fef3c7',
                          color: cita.estado === 'confirmada' ? '#1e40af' : '#92400e'
                        }}>
                          {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Acciones Rápidas */}
            <div style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '2px solid #e2e8f0'
            }}>
              <div style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: 20
              }}>
                Acciones Rápidas
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16
              }}>
                {[
                  { label: 'Agendar Cita', icon: '📅', primary: true, action: () => setActiveSection('citas') },
                  { label: 'Solicitar Examen', icon: '📋', primary: false, action: () => setActiveSection('examenes') },
                  { label: 'Ver Historial', icon: '📄', primary: false, action: () => setActiveSection('historial') },
                  { label: 'Mis Mascotas', icon: '🐾', primary: false, action: () => setActiveSection('mascotas') }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    style={{
                      background: action.primary 
                        ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                        : '#ffffff',
                      color: action.primary ? 'white' : '#6b7280',
                      border: action.primary ? 'none' : '2px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '16px 20px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                    onMouseEnter={(e) => {
                      if (action.primary) {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.3)'
                      } else {
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.borderColor = '#cbd5e1'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (action.primary) {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      } else {
                        e.currentTarget.style.background = '#ffffff'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                      }
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )
      
      case 'mascotas':
        return <PetsManagement userId={user?.id || 0} />
      
      case 'citas':
        return <AppointmentBooking userId={user?.id || 0} pacientes={pacientes} />
      
      case 'examenes':
        return <ExamsManagement userId={user?.id || 0} pacientes={pacientes} />
      
      case 'historial':
        return <MedicalHistory userId={user?.id || 0} pacientes={pacientes} />
      
      case 'pagos':
        return <PaymentsManagement userId={user?.id || 0} pacientes={pacientes} />
      
      case 'perfil':
        return <ProfileManagement userId={user?.id || 0} pacientes={pacientes} />
      
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>Cargando...</div>
          <div style={{ fontSize: 14 }}>Preparando tu dashboard</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 20px rgba(37, 99, 235, 0.08)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <strong style={{ fontSize: 20, color: '#1f2937' }}>VetCare</strong>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Hola, {user?.nombre || 'Usuario'}</div>
            </div>
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Cerrar Sesión
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Fecha */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 20px 0 20px'
      }}>
        <div style={{
          fontSize: 16,
          color: '#6b7280',
          marginBottom: 24
        }}>
          {getCurrentDate()}
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 40px 20px',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: 32
      }}>
        {/* Sidebar */}
        <aside style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          height: 'fit-content'
        }}>
          <div style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: 8
          }}>
            ¡Hola, {user?.nombre || 'Usuario'}!
          </div>
          <div style={{
            fontSize: 14,
            color: '#6b7280',
            marginBottom: 32,
            lineHeight: 1.5
          }}>
            Gestiona el cuidado de tus mascotas
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { key: 'inicio', label: 'Inicio', icon: '🏠' },
              { key: 'mascotas', label: 'Mis Mascotas', icon: '🐾' },
              { key: 'citas', label: 'Reservar Citas', icon: '📅' },
              { key: 'examenes', label: 'Exámenes', icon: '📋' },
              { key: 'historial', label: 'Historial Médico', icon: '📄' },
              { key: 'pagos', label: 'Pagos', icon: '💳' },
              { key: 'perfil', label: 'Mi Perfil', icon: '👤' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  background: activeSection === item.key ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                  color: activeSection === item.key ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: activeSection === item.key ? 600 : 500,
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.key) {
                    e.currentTarget.style.background = '#f8fafc'
                    e.currentTarget.style.color = '#1f2937'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.key) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#6b7280'
                  }
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {renderContent()}
        </main>
      </div>


    </div>
  )
}
