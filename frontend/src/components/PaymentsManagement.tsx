import { useState, useEffect } from 'react'
import { apiFetch } from '../api/client'

interface Paciente {
  id_paciente: number
  nombre: string
  especie: string
  raza: string
  edad: number
  peso: number
}

interface Pago {
  id_pago: number
  id_cita: number
  metodo_pago: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'transferencia'
  monto: number
  fecha_pago: string
  estado: 'pendiente' | 'pagado' | 'fallido'
  servicio_nombre: string
  fecha_cita: string
  paciente_nombre?: string
}

interface PaymentsManagementProps {
  userId: string
  pacientes: Paciente[]
}

export default function PaymentsManagement({ userId: _userId, pacientes: _pacientes }: PaymentsManagementProps) {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const pagosData = await apiFetch('/client/pagos')
      setPagos(pagosData)
    } catch (error) {
      console.error('Error al cargar pagos:', error)
      setPagos([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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

  const getPaymentMethodText = (metodo: string) => {
    switch (metodo) {
      case 'efectivo': return 'Efectivo'
      case 'tarjeta_credito': return 'Tarjeta de Crédito'
      case 'tarjeta_debito': return 'Tarjeta de Débito'
      case 'transferencia': return 'Transferencia'
      default: return metodo
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pagado':
        return { bg: '#dcfce7', color: '#166534', icon: '✅' }
      case 'pendiente':
        return { bg: '#fef3c7', color: '#92400e', icon: '⏰' }
      case 'fallido':
        return { bg: '#fee2e2', color: '#dc2626', icon: '❌' }
      default:
        return { bg: '#f3f4f6', color: '#6b7280', icon: '❓' }
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pagado': return 'Pagado'
      case 'pendiente': return 'Pendiente'
      case 'fallido': return 'Fallido'
      default: return estado
    }
  }

  // Calcular estadísticas
  const totalPagado = pagos
    .filter(pago => pago.estado === 'pagado')
    .reduce((sum, pago) => sum + pago.monto, 0)

  const totalPendiente = pagos
    .filter(pago => pago.estado === 'pendiente')
    .reduce((sum, pago) => sum + pago.monto, 0)

  const totalGeneral = pagos.reduce((sum, pago) => sum + pago.monto, 0)

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
        <div style={{ fontSize: 24, color: '#6b7280' }}>Cargando pagos...</div>
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
            💳 Pagos
          </h2>
          <h3 style={{ fontSize: 18, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>
            Gestión de Pagos
          </h3>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>
            Gestiona los pagos de los servicios veterinarios para tus mascotas
          </p>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        {/* Total Pagado */}
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #bbf7d0',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 24,
            marginBottom: 8,
            color: '#166534'
          }}>
            ✅
          </div>
          <div style={{
            fontSize: 14,
            color: '#166534',
            fontWeight: 500,
            marginBottom: 4
          }}>
            Total Pagado
          </div>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#166534'
          }}>
            {formatCurrency(totalPagado)}
          </div>
        </div>

        {/* Pendiente */}
        <div style={{
          background: '#fffbeb',
          border: '2px solid #fde68a',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 24,
            marginBottom: 8,
            color: '#92400e'
          }}>
            ⏰
          </div>
          <div style={{
            fontSize: 14,
            color: '#92400e',
            fontWeight: 500,
            marginBottom: 4
          }}>
            Pendiente
          </div>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#92400e'
          }}>
            {formatCurrency(totalPendiente)}
          </div>
        </div>

        {/* Total */}
        <div style={{
          background: '#fff7ed',
          border: '2px solid #fed7aa',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 24,
            marginBottom: 8,
            color: '#2563eb'
          }}>
            💰
          </div>
          <div style={{
            fontSize: 14,
            color: '#2563eb',
            fontWeight: 500,
            marginBottom: 4
          }}>
            Total
          </div>
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#2563eb'
          }}>
            {formatCurrency(totalGeneral)}
          </div>
        </div>
      </div>

      {/* Historial de Pagos */}
      <div>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 600, 
          color: '#374151', 
          marginBottom: 20 
        }}>
          Historial de Pagos
        </h3>
        
        {pagos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ 
              fontSize: 64, 
              marginBottom: 24, 
              opacity: 0.7,
              color: '#2563eb'
            }}>
              💳
            </div>
            <h3 style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 16
            }}>
              No tienes pagos registrados
            </h3>
            <p style={{
              fontSize: 16,
              color: '#2563eb',
              lineHeight: 1.6,
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Los pagos aparecerán aquí una vez que realices servicios.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pagos.map((pago) => (
              <div
                key={pago.id_pago}
                style={{
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  borderLeft: '4px solid #2563eb'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12
                }}>
                  <div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: 4
                    }}>
                      {pago.servicio_nombre}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: '#6b7280',
                      marginBottom: 8
                    }}>
                      {pago.paciente_nombre || 'Mascota'} • {formatDate(pago.fecha_pago)}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: '#6b7280'
                    }}>
                      Método: {getPaymentMethodText(pago.metodo_pago)}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#1f2937',
                      marginBottom: 8
                    }}>
                      {formatCurrency(pago.monto)}
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: getStatusColor(pago.estado).bg,
                      color: getStatusColor(pago.estado).color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <span>{getStatusColor(pago.estado).icon}</span>
                      {getStatusText(pago.estado)}
                    </span>
                  </div>
                </div>
                
                {pago.estado === 'fallido' && (
                  <div style={{
                    fontSize: 14,
                    color: '#dc2626',
                    padding: '8px 12px',
                    background: '#fef2f2',
                    borderRadius: 6,
                    border: '1px solid #fecaca',
                    marginTop: 8
                  }}>
                    ⚠️ Este pago falló. Por favor, contacta con la clínica para resolver el problema.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información adicional si hay pagos */}
      {pagos.length > 0 && (
        <div style={{
          marginTop: 24,
          padding: '16px 20px',
          background: '#f8fafc',
          borderRadius: 8,
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: 14,
            color: '#6b7280',
            lineHeight: 1.6
          }}>
            <strong>💡 Información:</strong> Los pagos se procesan automáticamente después de cada servicio. 
            Si tienes pagos pendientes, asegúrate de completar el proceso de pago. 
            Para pagos fallidos, contacta con la clínica para resolver cualquier problema.
          </div>
        </div>
      )}
    </div>
  )
}
