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

interface HistorialItem {
  id: number
  tipo: 'cita' | 'examen'
  fecha: string
  paciente_nombre: string
  descripcion: string
  resultado?: string
  observaciones?: string
  estado: string
  servicio_nombre?: string
  tipo_examen?: string
}

interface MedicalHistoryProps {
  userId: number
  pacientes: Paciente[]
}

export default function MedicalHistory({ userId, pacientes }: MedicalHistoryProps) {
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'summary'>('timeline')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPaciente, setSelectedPaciente] = useState<number>(0)
  const [selectedTipo, setSelectedTipo] = useState<string>('todos')
  const [filteredHistorial, setFilteredHistorial] = useState<HistorialItem[]>([])

  useEffect(() => {
    loadHistorial()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [historial, searchTerm, selectedPaciente, selectedTipo])

  const loadHistorial = async () => {
    try {
      setLoading(true)
      
      // Obtener citas y exámenes del usuario
      const [citas, examenes] = await Promise.all([
        apiFetch('/client/citas'),
        apiFetch('/client/examenes')
      ])

      // Combinar y formatear datos
      const historialCombinado: HistorialItem[] = [
        ...citas.map((cita: any) => ({
          id: cita.id_cita,
          tipo: 'cita' as const,
          fecha: cita.fecha_cita,
          paciente_nombre: cita.paciente_nombre,
          descripcion: cita.servicio_nombre,
          estado: cita.estado,
          servicio_nombre: cita.servicio_nombre
        })),
        ...examenes.map((examen: any) => ({
          id: examen.id_examen,
          tipo: 'examen' as const,
          fecha: examen.fecha_examen,
          paciente_nombre: examen.paciente_nombre,
          descripcion: examen.tipo_examen,
          resultado: examen.resultado,
          observaciones: examen.observaciones,
          estado: examen.estado,
          tipo_examen: examen.tipo_examen
        }))
      ]

      // Ordenar por fecha (más reciente primero)
      historialCombinado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      
      setHistorial(historialCombinado)
    } catch (error) {
      console.error('Error al cargar historial:', error)
      setHistorial([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...historial]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.paciente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.observaciones && item.observaciones.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtro por mascota
    if (selectedPaciente !== 0) {
      const paciente = pacientes.find(p => p.id_paciente === selectedPaciente)
      if (paciente) {
        filtered = filtered.filter(item => item.paciente_nombre === paciente.nombre)
      }
    }

    // Filtro por tipo
    if (selectedTipo !== 'todos') {
      filtered = filtered.filter(item => item.tipo === selectedTipo)
    }

    setFilteredHistorial(filtered)
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
      case 'completado':
      case 'completada':
        return { bg: '#dcfce7', color: '#166534' }
      case 'en_proceso':
      case 'confirmada':
        return { bg: '#dbeafe', color: '#1e40af' }
      default:
        return { bg: '#fef3c7', color: '#92400e' }
    }
  }

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'completado':
      case 'completada':
        return 'Completado'
      case 'en_proceso':
      case 'confirmada':
        return 'En Proceso'
      default:
        return 'Pendiente'
    }
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === 'cita' ? '📅' : '📋'
  }

  const getTipoText = (tipo: string) => {
    return tipo === 'cita' ? 'Cita Médica' : 'Examen'
  }

  const exportHistorial = () => {
    const dataToExport = filteredHistorial.map(item => ({
      Fecha: formatDate(item.fecha),
      Tipo: getTipoText(item.tipo),
      Mascota: item.paciente_nombre,
      Descripción: item.descripcion,
      Estado: getStatusText(item.estado),
      Resultado: item.resultado || '',
      Observaciones: item.observaciones || ''
    }))

    const csvContent = [
      Object.keys(dataToExport[0] || {}).join(','),
      ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `historial_medico_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getResumenPorMascota = () => {
    const resumen: { [key: string]: { citas: number, examenes: number, ultimaActividad: string } } = {}
    
    historial.forEach(item => {
      if (!resumen[item.paciente_nombre]) {
        resumen[item.paciente_nombre] = {
          citas: 0,
          examenes: 0,
          ultimaActividad: item.fecha
        }
      }
      
      if (item.tipo === 'cita') {
        resumen[item.paciente_nombre].citas++
      } else {
        resumen[item.paciente_nombre].examenes++
      }
      
      // Actualizar última actividad si es más reciente
      if (new Date(item.fecha) > new Date(resumen[item.paciente_nombre].ultimaActividad)) {
        resumen[item.paciente_nombre].ultimaActividad = item.fecha
      }
    })
    
    return resumen
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
        <div style={{ fontSize: 24, color: '#6b7280' }}>Cargando historial médico...</div>
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
            📄 Historial Médico
          </h2>
          <h3 style={{ fontSize: 18, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>
            Historial Médico Completo
          </h3>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>
            Accede a todo el historial médico de tus mascotas en un solo lugar
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 24,
        background: '#f8fafc',
        borderRadius: 8,
        padding: 4
      }}>
        {[
          { key: 'timeline', label: 'Línea de Tiempo' },
          { key: 'summary', label: 'Resumen por Mascota' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === tab.key ? '#ffffff' : 'transparent',
              color: activeTab === tab.key ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 600 : 500,
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.key ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtros y Búsqueda */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar en historial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: 14,
                background: 'white'
              }}
            />
            <span style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: 16
            }}>
              🔍
            </span>
          </div>
        </div>

        <select
          value={selectedPaciente}
          onChange={(e) => setSelectedPaciente(Number(e.target.value))}
          style={{
            padding: '12px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 14,
            background: 'white',
            minWidth: '150px'
          }}
        >
          <option value={0}>Todas las mascotas</option>
          {pacientes.map((paciente) => (
            <option key={paciente.id_paciente} value={paciente.id_paciente}>
              {paciente.nombre}
            </option>
          ))}
        </select>

        <select
          value={selectedTipo}
          onChange={(e) => setSelectedTipo(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 14,
            background: 'white',
            minWidth: '120px'
          }}
        >
          <option value="todos">Todos los tipos</option>
          <option value="cita">Citas</option>
          <option value="examen">Exámenes</option>
        </select>

        <button
          onClick={exportHistorial}
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 16px',
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
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <span style={{ fontSize: 16 }}>📥</span>
          Exportar
        </button>
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'timeline' ? (
        <div>
          {filteredHistorial.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ 
                fontSize: 64, 
                marginBottom: 24, 
                opacity: 0.7,
                color: '#2563eb'
              }}>
                📄
              </div>
              <h3 style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#374151',
                marginBottom: 16
              }}>
                No se encontraron registros
              </h3>
              <p style={{
                fontSize: 16,
                color: '#2563eb',
                lineHeight: 1.6,
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Aún no tienes historial médico. Los registros aparecerán aquí después de las citas y exámenes.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredHistorial.map((item, index) => (
                <div
                  key={`${item.tipo}-${item.id}`}
                  style={{
                    padding: '20px',
                    background: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    borderLeft: '4px solid #2563eb'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20 }}>{getTipoIcon(item.tipo)}</span>
                      <div>
                        <div style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: '#1f2937',
                          marginBottom: 4
                        }}>
                          {item.descripcion}
                        </div>
                        <div style={{
                          fontSize: 14,
                          color: '#6b7280'
                        }}>
                          {item.paciente_nombre} • {formatDate(item.fecha)}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: getStatusColor(item.estado).bg,
                      color: getStatusColor(item.estado).color
                    }}>
                      {getStatusText(item.estado)}
                    </span>
                  </div>
                  
                  {item.resultado && (
                    <div style={{
                      fontSize: 14,
                      color: '#059669',
                      marginBottom: 8,
                      padding: '8px 12px',
                      background: '#f0fdf4',
                      borderRadius: 6,
                      border: '1px solid #bbf7d0'
                    }}>
                      <strong>Resultado:</strong> {item.resultado}
                    </div>
                  )}
                  
                  {item.observaciones && (
                    <div style={{
                      fontSize: 14,
                      color: '#6b7280',
                      fontStyle: 'italic',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: 6,
                      border: '1px solid #e2e8f0'
                    }}>
                      {item.observaciones}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {Object.keys(getResumenPorMascota()).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ 
                fontSize: 64, 
                marginBottom: 24, 
                opacity: 0.7,
                color: '#2563eb'
              }}>
                📊
              </div>
              <h3 style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#374151',
                marginBottom: 16
              }}>
                No hay datos para mostrar
              </h3>
              <p style={{
                fontSize: 16,
                color: '#2563eb',
                lineHeight: 1.6,
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                El resumen aparecerá cuando tengas citas y exámenes registrados.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {Object.entries(getResumenPorMascota()).map(([mascota, datos]) => (
                <div
                  key={mascota}
                  style={{
                    padding: '20px',
                    background: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16
                  }}>
                    <h3 style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#1f2937',
                      margin: 0
                    }}>
                      🐾 {mascota}
                    </h3>
                    <div style={{
                      fontSize: 14,
                      color: '#6b7280'
                    }}>
                      Última actividad: {formatDate(datos.ultimaActividad)}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: 16
                  }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '12px',
                      background: '#dbeafe',
                      borderRadius: 8,
                      border: '1px solid #bfdbfe'
                    }}>
                      <div style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#1e40af',
                        marginBottom: 4
                      }}>
                        {datos.citas}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: '#1e40af',
                        fontWeight: 500
                      }}>
                        Citas
                      </div>
                    </div>
                    
                    <div style={{
                      textAlign: 'center',
                      padding: '12px',
                      background: '#fef3c7',
                      borderRadius: 8,
                      border: '1px solid #fde68a'
                    }}>
                      <div style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#92400e',
                        marginBottom: 4
                      }}>
                        {datos.examenes}
                      </div>
                      <div style={{
                        fontSize: 12,
                        color: '#92400e',
                        fontWeight: 500
                      }}>
                        Exámenes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
