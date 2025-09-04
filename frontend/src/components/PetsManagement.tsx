import React, { useState, useEffect } from 'react'
import { apiFetch } from '../api/client'
import AddPetModal from './AddPetModal'

interface Pet {
  id_paciente: number
  nombre: string
  especie: string
  raza: string
  edad: number
  peso: number
}

interface PetsManagementProps {
  userId: number
}

export default function PetsManagement({ userId }: PetsManagementProps) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar mascotas del usuario
  const loadPets = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/client/mascotas')
      setPets(response)
      setError(null)
    } catch (err) {
      setError('Error al cargar las mascotas')
      console.error('Error loading pets:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPets()
  }, [userId])

  // Agregar nueva mascota
  const handleAddPet = async (petData: Omit<Pet, 'id_paciente'>) => {
    try {
      await apiFetch('/client/mascotas', {
        method: 'POST',
        body: JSON.stringify(petData)
      })
      
      // Recargar la lista de mascotas
      await loadPets()
      setShowAddModal(false)
      
      // Mostrar mensaje de éxito
      alert('Mascota agregada exitosamente')
    } catch (err) {
      console.error('Error adding pet:', err)
      alert('Error al agregar la mascota')
    }
  }

  // Eliminar mascota
  const handleDeletePet = async (petId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      return
    }

    try {
      await apiFetch(`/client/mascotas/${petId}`, {
        method: 'DELETE'
      })
      
      // Recargar la lista
      await loadPets()
      alert('Mascota eliminada exitosamente')
    } catch (err) {
      console.error('Error deleting pet:', err)
      alert('Error al eliminar la mascota')
    }
  }

  if (loading) {
    return (
      <div className="pets-container">
        <div className="pets-header">
          <h2>Mis Mascotas</h2>
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Agregar Mascota
          </button>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando mascotas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pets-container">
      <div className="pets-header">
        <h2>Mis Mascotas</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Agregar Mascota
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={loadPets}>Reintentar</button>
        </div>
      )}

      {pets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🐾</div>
          <h3>No tienes mascotas registradas</h3>
          <p>Agrega tu primera mascota para comenzar a gestionar su cuidado médico.</p>
          <button 
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            Agregar Primera Mascota
          </button>
        </div>
      ) : (
        <div className="pets-grid">
          {pets.map((pet) => (
            <div key={pet.id_paciente} className="pet-card">
              <div className="pet-avatar">
                {pet.especie === 'Perro' ? '🐕' : 
                 pet.especie === 'Gato' ? '🐱' : 
                 pet.especie === 'Ave' ? '🦜' : 
                 pet.especie === 'Reptil' ? '🦎' : 
                 pet.especie === 'Roedor' ? '🐹' : '🐾'}
              </div>
              <div className="pet-info">
                <h3>{pet.nombre}</h3>
                <p className="pet-species">{pet.especie} • {pet.raza}</p>
                <div className="pet-details">
                  <span className="pet-age">{pet.edad} años</span>
                  <span className="pet-weight">{pet.peso} kg</span>
                </div>
              </div>
              <div className="pet-actions">
                <button 
                  className="btn-ghost btn-small"
                  onClick={() => handleDeletePet(pet.id_paciente)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddPetModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPet}
        />
      )}

      <style>{`
        .pets-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .pets-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .pets-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 24px;
          font-weight: 600;
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

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }

        .loading-state {
          text-align: center;
          padding: 48px;
          color: #6b7280;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #f97316;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-message button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 20px;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 16px;
        }

        .pets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .pet-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
        }

        .pet-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-color: #f97316;
        }

        .pet-avatar {
          font-size: 48px;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .pet-info {
          flex: 1;
        }

        .pet-info h3 {
          margin: 0 0 4px 0;
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
        }

        .pet-species {
          margin: 0 0 8px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .pet-details {
          display: flex;
          gap: 16px;
        }

        .pet-age, .pet-weight {
          background: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          color: #374151;
          font-weight: 500;
        }

        .pet-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid #d1d5db;
          color: #6b7280;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-ghost:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .btn-small {
          padding: 4px 8px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .pets-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .pets-grid {
            grid-template-columns: 1fr;
          }

          .pet-card {
            flex-direction: column;
            text-align: center;
          }

          .pet-actions {
            flex-direction: row;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
