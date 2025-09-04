import React, { useState } from 'react'

interface AddPetModalProps {
  onClose: () => void
  onAdd: (petData: {
    nombre: string
    especie: string
    raza: string
    edad: number
    peso: number
  }) => void
}

export default function AddPetModal({ onClose, onAdd }: AddPetModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    peso: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const especies = [
    'Perro', 'Gato', 'Ave', 'Reptil', 'Roedor', 'Conejo', 'Hurón', 'Otro'
  ]

  const razasComunes = {
    'Perro': ['Labrador', 'Golden Retriever', 'Pastor Alemán', 'Bulldog', 'Chihuahua', 'Poodle', 'Beagle', 'Rottweiler', 'Otro'],
    'Gato': ['Persa', 'Siamés', 'Maine Coon', 'Ragdoll', 'British Shorthair', 'Sphynx', 'Bengalí', 'Otro'],
    'Ave': ['Canario', 'Perico', 'Cacatúa', 'Loro', 'Agapornis', 'Otro'],
    'Reptil': ['Iguana', 'Gecko', 'Tortuga', 'Serpiente', 'Otro'],
    'Roedor': ['Hamster', 'Cobayo', 'Rata', 'Jerbo', 'Otro'],
    'Conejo': ['Holandés', 'Angora', 'Lop', 'Rex', 'Otro'],
    'Hurón': ['Hurón', 'Otro'],
    'Otro': ['Otro']
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.especie) {
      newErrors.especie = 'Debes seleccionar una especie'
    }

    if (!formData.raza.trim()) {
      newErrors.raza = 'La raza es obligatoria'
    }

    if (!formData.edad.trim()) {
      newErrors.edad = 'La edad es obligatoria'
    } else {
      const edad = parseFloat(formData.edad)
      if (isNaN(edad) || edad < 0 || edad > 30) {
        newErrors.edad = 'La edad debe ser un número entre 0 y 30'
      }
    }

    if (!formData.peso.trim()) {
      newErrors.peso = 'El peso es obligatorio'
    } else {
      const peso = parseFloat(formData.peso)
      if (isNaN(peso) || peso < 0.1 || peso > 200) {
        newErrors.peso = 'El peso debe ser un número entre 0.1 y 200 kg'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onAdd({
        nombre: formData.nombre.trim(),
        especie: formData.especie,
        raza: formData.raza.trim(),
        edad: parseFloat(formData.edad),
        peso: parseFloat(formData.peso)
      })
    } catch (error) {
      console.error('Error adding pet:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEspecieChange = (especie: string) => {
    setFormData(prev => ({ 
      ...prev, 
      especie,
      raza: '' // Reset raza when especie changes
    }))
    setErrors(prev => ({ ...prev, especie: '', raza: '' }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agregar Nueva Mascota</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="pet-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Mascota *</label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Luna, Max, Rocky..."
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="especie">Especie *</label>
            <select
              id="especie"
              value={formData.especie}
              onChange={(e) => handleEspecieChange(e.target.value)}
              className={errors.especie ? 'error' : ''}
            >
              <option value="">Selecciona una especie</option>
              {especies.map(especie => (
                <option key={especie} value={especie}>{especie}</option>
              ))}
            </select>
            {errors.especie && <span className="error-text">{errors.especie}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="raza">Raza *</label>
            <select
              id="raza"
              value={formData.raza}
              onChange={(e) => handleInputChange('raza', e.target.value)}
              className={errors.raza ? 'error' : ''}
              disabled={!formData.especie}
            >
              <option value="">Selecciona una raza</option>
              {formData.especie && razasComunes[formData.especie as keyof typeof razasComunes]?.map(raza => (
                <option key={raza} value={raza}>{raza}</option>
              ))}
            </select>
            {errors.raza && <span className="error-text">{errors.raza}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edad">Edad (años) *</label>
              <input
                type="text"
                id="edad"
                value={formData.edad}
                onChange={(e) => handleInputChange('edad', e.target.value)}
                placeholder="0.5"
                className={errors.edad ? 'error' : ''}
              />
              {errors.edad && <span className="error-text">{errors.edad}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="peso">Peso (kg) *</label>
              <input
                type="text"
                id="peso"
                value={formData.peso}
                onChange={(e) => handleInputChange('peso', e.target.value)}
                placeholder="5.2"
                className={errors.peso ? 'error' : ''}
              />
              {errors.peso && <span className="error-text">{errors.peso}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Agregando...' : 'Agregar Mascota'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease-out;
        }

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

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 0 24px;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .modal-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 20px;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .pet-form {
          padding: 0 24px 24px 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-weight: 500;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .error-text {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-secondary {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .modal-content {
            margin: 20px;
            max-height: calc(100vh - 40px);
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
