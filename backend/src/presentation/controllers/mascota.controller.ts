/**
 * PRESENTATION LAYER - Mascota Controller
 * Controlador para gestión de Mascotas
 */

import { Request, Response } from 'express'
import { MascotaRepository } from '../../application/repositories'

export class MascotaController {
  private mascotaRepository: MascotaRepository

  constructor() {
    this.mascotaRepository = new MascotaRepository()
  }

  async obtenerTodasMascotas(req: Request, res: Response) {
    try {
      const mascotas = await this.mascotaRepository.findAll()
      res.json(mascotas)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mascotas' })
    }
  }

  async crearMascota(req: Request, res: Response) {
    try {
      const mascota = await this.mascotaRepository.save(req.body)
      res.status(201).json(mascota)
    } catch (error) {
      res.status(400).json({ error: 'Error al crear mascota' })
    }
  }

  async obtenerMascota(req: Request, res: Response) {
    try {
      const { id } = req.params
      const mascota = await this.mascotaRepository.findById(Number(id))
      
      if (!mascota) {
        return res.status(404).json({ error: 'Mascota no encontrada' })
      }
      
      res.json(mascota)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mascota' })
    }
  }

  async obtenerMascotasCliente(req: Request, res: Response) {
    try {
      const { clienteId } = req.params
      const mascotas = await this.mascotaRepository.findByCliente(String(clienteId))
      res.json(mascotas)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mascotas del cliente' })
    }
  }

  async actualizarMascota(req: Request, res: Response) {
    try {
      const { id } = req.params
      const mascota = await this.mascotaRepository.update(Number(id), req.body)
      res.json(mascota)
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar mascota' })
    }
  }

  async eliminarMascota(req: Request, res: Response) {
    try {
      const { id } = req.params
      await this.mascotaRepository.delete(Number(id))
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar mascota' })
    }
  }
}
