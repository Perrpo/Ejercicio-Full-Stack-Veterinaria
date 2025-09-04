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

interface Examen {
  id_examen: number
  id_paciente: number
  tipo_examen: string
  fecha_examen: string
  resultado: string
  observaciones: string
  estado: 'pendiente' | 'en_proceso' | 'completado'
  paciente_nombre?: string
}

interface ExamsManagementProps {
  userId: number
  pacientes: Paciente[]
}

export default function ExamsManagement({ userId, pacientes }: ExamsManagementProps) {
  const [examenes, setExamenes] = useState<Examen[]>([])
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<number>(0)
  const [selectedTipoExamen, setSelectedTipoExamen] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tiposExamen = [
    'Análisis de Sangre',
    'Radiografía',
    'Ecografía',
    'Análisis de Orina',
    'Análisis de Heces',
    'Biopsia',
    'Endoscopia',
    'Electrocardiograma',
    'Análisis de Piel',
    'Análisis de Plumas',
    'Otro'
  ]

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    try {
      setLoading(true)
      const examenesData = await apiFetch('/client/examenes')
      setExamenes(examenesData)
    } catch (error) {
      console.error('Error al cargar exámenes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPaciente || !selectedTipoExamen) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    try {
      setIsSubmitting(true)
      await apiFetch('/client/examenes', {
        method: 'POST',
        body: JSON.stringify({
          id_paciente: selectedPaciente,
          tipo_examen: selectedTipoExamen,
          observaciones: observaciones
        })
      })
      
      // Recargar exámenes y cerrar modal
      await loadExams()
      setShowRequestModal(false)
      resetForm()
      alert('Examen solicitado exitosamente')
    } catch (error) {
      console.error('Error al solicitar examen:', error)
      alert('Error al solicitar el examen')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedPaciente(0)
    setSelectedTipoExamen('')
    setObservaciones('')
  }

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completado': return { bg: '#dcfce7', color: '#166534' }
      case 'en_proceso': return { bg: '#dbeafe', color: '#1e40af' }
      default: return { bg: '#fef3c7', color: '#92400e' }
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'completado': return 'Completado'
      case 'en_proceso': return 'En Proceso'
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
        border: '2px solid #f0e7de',
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
        border: '2px solid #f0e7de'
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
              📋 Exámenes
            </h2>
            <h3 style={{ fontSize: 18, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>
              Gestión de Exámenes
            </h3>
            <p style={{ fontSize: 14, color: '#9ca3af' }}>
              Solicita y revisa los resultados de exámenes médicos para tus mascotas
            </p>
          </div>
          <button
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
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
            Solicitar Examen
          </button>
        </div>

        {/* Mensaje central cuando no hay mascotas */}
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            fontSize: 64, 
            marginBottom: 24, 
            opacity: 0.7,
            color: '#f97316'
          }}>
            📋
          </div>
          <h3 style={{
            fontSize: 24,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 16
          }}>
            No puedes solicitar exámenes aún
          </h3>
          <p style={{
            fontSize: 16,
            color: '#f97316',
            lineHeight: 1.6,
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Primero debes registrar al menos una mascota para poder solicitar exámenes médicos.
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
      border: '2px solid #f0e7de'
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
            📋 Exámenes
          </h2>
          <h3 style={{ fontSize: 18, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>
            Gestión de Exámenes
          </h3>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>
            Solicita y revisa los resultados de exámenes médicos para tus mascotas
          </p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
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
          Solicitar Examen
        </button>
      </div>

      {/* Lista de Exámenes */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#374151', marginBottom: 16 }}>
          Mis Exámenes
        </h3>
        
        {examenes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📋</div>
            <p style={{ fontSize: 16, marginBottom: 0 }}>No tienes exámenes solicitados</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {examenes.map((examen) => (
              <div
                key={examen.id_examen}
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
                    {examen.tipo_examen}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: '#6b7280'
                  }}>
                    {examen.paciente_nombre || 'Mascota'} • {formatDate(examen.fecha_examen)}
                  </div>
                  {examen.resultado && (
                    <div style={{
                      fontSize: 14,
                      color: '#059669',
                      marginTop: 4
                    }}>
                      Resultado: {examen.resultado}
                    </div>
                  )}
                  {examen.observaciones && (
                    <div style={{
                      fontSize: 14,
                      color: '#6b7280',
                      marginTop: 4,
                      fontStyle: 'italic'
                    }}>
                      {examen.observaciones}
                    </div>
                  )}
                </div>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: getStatusColor(examen.estado).bg,
                  color: getStatusColor(examen.estado).color
                }}>
                  {getStatusText(examen.estado)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Solicitud */}
      {showRequestModal && (
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
                Solicitar Nuevo Examen
              </h2>
              <button
                onClick={() => {
                  setShowRequestModal(false)
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
                  Tipo de Examen *
                </label>
                <select
                  value={selectedTipoExamen}
                  onChange={(e) => setSelectedTipoExamen(e.target.value)}
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
                  <option value="" disabled>Selecciona un tipo de examen</option>
                  {tiposExamen.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: 14
                }}>
                  Observaciones
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Describe cualquier síntoma o motivo para el examen..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 16,
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false)
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
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Solicitando...' : 'Solicitar Examen'}
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

