import React, { useState, useEffect } from 'react'
import { apiFetch } from '../api/client'

interface Paciente {
  id_paciente: number
  nombre: string
  especie: string
  raza: string
  edad: number
  peso: number
}

interface Servicio {
  id_servicio: number
  nombre: string
  descripcion: string
  precio: number
  duracion: number
  precio_formateado: string
}

interface Cita {
  id_cita: number
  fecha_cita: string
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
  paciente_nombre: string
  servicio_nombre: string
  precio: number
  precio_formateado?: string
}

interface AppointmentBookingProps {
  userId: number
  pacientes: Paciente[]
}

export default function AppointmentBooking({ userId, pacientes }: AppointmentBookingProps) {
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<number>(0)
  const [selectedServicio, setSelectedServicio] = useState<number>(0)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [serviciosData, citasData] = await Promise.all([
        apiFetch('/client/servicios'),
        apiFetch('/client/citas')
      ])
      setServicios(serviciosData)
      setCitas(citasData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPaciente || !selectedServicio || !selectedDate || !selectedTime) {
      alert('Por favor completa todos los campos')
      return
    }

    const fechaCita = `${selectedDate}T${selectedTime}:00`
    
    try {
      setIsSubmitting(true)
      await apiFetch('/client/citas', {
        method: 'POST',
        body: JSON.stringify({
          id_paciente: selectedPaciente,
          id_servicio: selectedServicio,
          fecha_cita: fechaCita
        })
      })
      
      // Recargar citas y cerrar modal
      await loadData()
      setShowBookingModal(false)
      resetForm()
      alert('Cita agendada exitosamente')
    } catch (error) {
      console.error('Error al agendar cita:', error)
      alert('Error al agendar la cita')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedPaciente(0)
    setSelectedServicio(0)
    setSelectedDate('')
    setSelectedTime('')
  }

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    })
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'confirmada': return { bg: '#dbeafe', color: '#1e40af' }
      case 'completada': return { bg: '#dcfce7', color: '#166534' }
      case 'cancelada': return { bg: '#fee2e2', color: '#dc2626' }
      default: return { bg: '#fef3c7', color: '#92400e' }
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'confirmada': return 'Confirmada'
      case 'completada': return 'Completada'
      case 'cancelada': return 'Cancelada'
      default: return 'Pendiente'
    }
  }

  if (loading) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '2px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 24, color: '#6b7280' }}>Cargando...</div>
      </div>
    )
  }

  // Si no hay mascotas registradas, mostrar mensaje
  if (pacientes.length === 0) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '2px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24
        }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>
              📅 Reservar Citas
            </h2>
            <h3 style={{ fontSize: 18, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>
              Gestión de Citas
            </h3>
            <p style={{ fontSize: 14, color: '#9ca3af' }}>
              Agenda citas veterinarias a domicilio para tus mascotas
            </p>
          </div>
          <button
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '12px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
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
            <span style={{ fontSize: 16 }}>+</span>
            Nueva Cita
          </button>
        </div>

        {/* Mensaje central cuando no hay mascotas */}
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            fontSize: 64, 
            marginBottom: 24, 
            opacity: 0.7,
            color: '#2563eb'
          }}>
            📅
          </div>
          <h3 style={{
            fontSize: 24,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 16
          }}>
            No puedes agendar citas aún
          </h3>
          <p style={{
            fontSize: 16,
            color: '#2563eb',
            lineHeight: 1.6,
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Primero debes registrar al menos una mascota para poder agendar citas veterinarias.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '2px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24
      }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>
            📅 Reservar Citas
          </h2>
          <h3 style={{ fontSize: 18, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>
            Gestión de Citas
          </h3>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>
            Agenda citas veterinarias a domicilio para tus mascotas
          </p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
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
          <span style={{ fontSize: 16 }}>+</span>
          Nueva Cita
        </button>
      </div>

      {/* Lista de Citas */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 16 }}>
          Mis Citas
        </h3>
        
        {citas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📅</div>
            <p style={{ fontSize: 16, marginBottom: 0 }}>No tienes citas agendadas</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {citas.map((cita) => (
              <div
                key={cita.id_cita}
                style={{
                  padding: '16px 20px',
                  background: '#f9fafb',
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
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
                                     <div style={{
                     fontSize: 14,
                     color: '#059669',
                     fontWeight: 500,
                     marginTop: 4
                   }}>
                     ${cita.precio_formateado || formatPrice(cita.precio || 0)}
                   </div>
                </div>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: getStatusColor(cita.estado).bg,
                  color: getStatusColor(cita.estado).color
                }}>
                  {getStatusText(cita.estado)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Reserva */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px 24px 0 24px',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: 24
            }}>
              <h2 style={{
                margin: 0,
                color: '#1f2937',
                fontSize: 20,
                fontWeight: 600
              }}>
                Agendar Nueva Cita
              </h2>
              <button
                onClick={() => {
                  setShowBookingModal(false)
                  resetForm()
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px 24px' }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: 14
                }}>
                  Mascota *
                </label>
                <select
                  value={selectedPaciente}
                  onChange={(e) => setSelectedPaciente(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 16,
                    background: 'white'
                  }}
                  required
                >
                  <option value={0} disabled>Selecciona una mascota</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id_paciente} value={paciente.id_paciente}>
                      {paciente.nombre} ({paciente.especie} - {paciente.raza})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: 14
                }}>
                  Servicio *
                </label>
                <select
                  value={selectedServicio}
                  onChange={(e) => setSelectedServicio(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 16,
                    background: 'white'
                  }}
                  required
                >
                  <option value={0} disabled>Selecciona un servicio</option>
                                     {servicios.map((servicio) => (
                     <option key={servicio.id_servicio} value={servicio.id_servicio}>
                       {servicio.nombre} - ${servicio.precio_formateado}
                     </option>
                   ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: 14
                }}>
                  Fecha *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: 14
                }}>
                  Hora *
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  min="08:00"
                  max="18:00"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                  required
                />
                <p style={{
                  fontSize: 12,
                  color: '#6b7280',
                  marginTop: 4,
                  marginBottom: 0
                }}>
                  Horario disponible: 8:00 AM - 6:00 PM
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false)
                    resetForm()
                  }}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    padding: '12px 24px',
                    borderRadius: 8,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Agendando...' : 'Agendar Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
