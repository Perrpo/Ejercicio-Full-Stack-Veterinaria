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

interface PerfilUsuario {
  id_usuario: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  fecha_registro: string
  ultima_conexion?: string
}

interface ProfileManagementProps {
  userId: number
  pacientes: Paciente[]
}

export default function ProfileManagement({ userId, pacientes }: ProfileManagementProps) {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estados para el formulario de edición
  const [editForm, setEditForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const perfilData = await apiFetch('/client/perfil')
      setPerfil(perfilData)
      
      // Inicializar formulario de edición
      setEditForm({
        nombre: perfilData.nombre || '',
        apellido: perfilData.apellido || '',
        telefono: perfilData.telefono || '',
        direccion: perfilData.direccion || ''
      })
    } catch (error) {
      console.error('Error al cargar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      await apiFetch('/client/perfil', {
        method: 'PUT',
        body: JSON.stringify(editForm)
      })
      
      // Recargar perfil y cerrar modal
      await loadProfile()
      setShowEditModal(false)
      alert('Perfil actualizado exitosamente')
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      alert('Error al actualizar el perfil')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDisplayValue = (value: string | null | undefined, fallback: string = 'No especificado') => {
    return value && value.trim() !== '' ? value : fallback
  }

  const getDisplayValueAddress = (value: string | null | undefined, fallback: string = 'No especificada') => {
    return value && value.trim() !== '' ? value : fallback
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
        <div style={{ fontSize: 24, color: '#6b7280' }}>Cargando perfil...</div>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '2px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 24, color: '#6b7280' }}>Error al cargar el perfil</div>
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
            👤 Mi Perfil
          </h2>
          <h3 style={{ fontSize: 18, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>
            Gestiona tu información personal y de contacto
          </h3>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
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
          <span style={{ fontSize: 16 }}>✏️</span>
          Editar Perfil
        </button>
      </div>

      {/* Información Personal */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20
        }}>
          <span style={{ fontSize: 20 }}>👤</span>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#374151',
            margin: 0
          }}>
            Información Personal
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24
        }}>
          {/* Columna Izquierda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              padding: '16px 20px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8
              }}>
                <span style={{ fontSize: 16, color: '#6b7280' }}>👤</span>
                <span style={{
                  fontSize: 14,
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Nombre Completo
                </span>
              </div>
              <div style={{
                fontSize: 16,
                color: '#1f2937',
                fontWeight: 500
              }}>
                {getDisplayValue(`${perfil.nombre} ${perfil.apellido}`.trim())}
              </div>
            </div>

            <div style={{
              padding: '16px 20px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8
              }}>
                <span style={{ fontSize: 16, color: '#6b7280' }}>📞</span>
                <span style={{
                  fontSize: 14,
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Teléfono
                </span>
              </div>
              <div style={{
                fontSize: 16,
                color: '#1f2937',
                fontWeight: 500
              }}>
                {getDisplayValue(perfil.telefono)}
              </div>
            </div>

            <div style={{
              padding: '16px 20px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8
              }}>
                <span style={{ fontSize: 16, color: '#6b7280' }}>📍</span>
                <span style={{
                  fontSize: 14,
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Dirección Principal
                </span>
              </div>
              <div style={{
                fontSize: 16,
                color: '#1f2937',
                fontWeight: 500
              }}>
                {getDisplayValueAddress(perfil.direccion)}
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              padding: '16px 20px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8
              }}>
                <span style={{ fontSize: 16, color: '#6b7280' }}>📧</span>
                <span style={{
                  fontSize: 14,
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Correo Electrónico
                </span>
              </div>
              <div style={{
                fontSize: 16,
                color: '#1f2937',
                fontWeight: 500,
                marginBottom: 4
              }}>
                {perfil.email}
              </div>
              <div style={{
                fontSize: 12,
                color: '#9ca3af',
                fontStyle: 'italic'
              }}>
                No se puede modificar
              </div>
            </div>

            <div style={{
              padding: '16px 20px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 8
              }}>
                <span style={{ fontSize: 16, color: '#6b7280' }}>🚨</span>
                <span style={{
                  fontSize: 14,
                  color: '#6b7280',
                  fontWeight: 500
                }}>
                  Contacto de Emergencia
                </span>
              </div>
              <div style={{
                fontSize: 16,
                color: '#1f2937',
                fontWeight: 500
              }}>
                {getDisplayValue(perfil.telefono)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notas Adicionales */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          padding: '16px 20px',
          background: '#f9fafb',
          borderRadius: 12,
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: 14,
            color: '#6b7280',
            fontWeight: 500,
            marginBottom: 8
          }}>
            Notas Adicionales
          </div>
          <div style={{
            fontSize: 16,
            color: '#1f2937',
            fontStyle: 'italic'
          }}>
            No hay notas adicionales
          </div>
        </div>
      </div>

      {/* Información de la Cuenta */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20
        }}>
          <span style={{ fontSize: 20 }}>🔐</span>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#374151',
            margin: 0
          }}>
            Información de la Cuenta
          </h3>
        </div>

        <div style={{
          padding: '20px',
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{
                fontSize: 14,
                color: '#6b7280',
                fontWeight: 500
              }}>
                ID de Usuario:
              </span>
              <span style={{
                fontSize: 14,
                color: '#1f2937',
                fontFamily: 'monospace',
                background: '#f3f4f6',
                padding: '4px 8px',
                borderRadius: 4
              }}>
                {perfil.id_usuario}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{
                fontSize: 14,
                color: '#6b7280',
                fontWeight: 500
              }}>
                Fecha de Registro:
              </span>
              <span style={{
                fontSize: 14,
                color: '#1f2937'
              }}>
                {formatDate(perfil.fecha_registro)}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0'
            }}>
              <span style={{
                fontSize: 14,
                color: '#6b7280',
                fontWeight: 500
              }}>
                Última Conexión:
              </span>
              <span style={{
                fontSize: 14,
                color: '#1f2937'
              }}>
                {perfil.ultima_conexion ? formatDate(perfil.ultima_conexion) : formatDate(perfil.fecha_registro)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
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
                Editar Perfil
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
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

            <form onSubmit={handleEditSubmit} style={{ padding: '0 24px 24px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 8,
                    color: '#374151',
                    fontWeight: 500,
                    fontSize: 14
                  }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 16,
                      background: 'white'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: 8,
                    color: '#374151',
                    fontWeight: 500,
                    fontSize: 14
                  }}>
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={editForm.apellido}
                    onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 16,
                      background: 'white'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: 14
                }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={editForm.telefono}
                  onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 16,
                    background: 'white'
                  }}
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
                  Dirección
                </label>
                <textarea
                  value={editForm.direccion}
                  onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                  placeholder="Ingresa tu dirección completa..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontSize: 16,
                    minHeight: '80px',
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
                  onClick={() => setShowEditModal(false)}
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
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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
