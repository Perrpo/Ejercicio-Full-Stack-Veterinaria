import { Request, Response } from 'express';
import { CitaService } from '../../application/services/CitaService';
import { GestorTransicionCita } from '../../application/services/GestorTransicionCita';
import { Veterinario } from '../../domain/entities/Veterinario';

/**
 * CitaController - Controlador para gestionar citas
 * Cumple con arquitectura limpia - solo orquesta llamadas a servicios
 * No contiene lógica de negocio, solo manejo de HTTP
 */
export class CitaController {
  constructor(
    private citaService: CitaService,
    private gestorTransicion: GestorTransicionCita,
  ) {}

  async crear(req: Request, res: Response) {
    try {
      const { mascotaId, veterinarioId, fecha, observaciones } = req.body;

      if (!mascotaId || !veterinarioId || !fecha) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      // En una app real, buscarías el veterinario del repositorio
      const veterinario = new Veterinario(veterinarioId, 'Dr. Veterinario', 'General');

      const cita = await this.citaService.crearCita(
        mascotaId,
        veterinario,
        new Date(fecha),
        observaciones,
      );

      res.status(201).json({
        mensaje: 'Cita creada exitosamente',
        cita: {
          id: cita.id,
          fecha: cita.obtenerFecha(),
          mascota: cita.obtenerMascota().nombre,
          estado: cita.obtenerEstado(),
        },
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async agregarServicio(req: Request, res: Response) {
    try {
      const { citaId } = req.params;
      const { servicio } = req.body;

      if (!servicio) {
        return res.status(400).json({ error: 'Servicio requerido' });
      }

      await this.citaService.agregarServicio(citaId, servicio);

      res.json({ mensaje: 'Servicio agregado a la cita' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async confirmar(req: Request, res: Response) {
    try {
      const { citaId } = req.params;

      await this.gestorTransicion.confirmarCita(citaId);

      res.json({ mensaje: 'Cita confirmada exitosamente' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async cancelar(req: Request, res: Response) {
    try {
      const { citaId } = req.params;

      await this.gestorTransicion.cancelarCita(citaId);

      res.json({ mensaje: 'Cita cancelada exitosamente' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async finalizar(req: Request, res: Response) {
    try {
      const { citaId } = req.params;

      await this.gestorTransicion.finalizarCita(citaId);

      res.json({ mensaje: 'Cita finalizada exitosamente' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async obtenerTotal(req: Request, res: Response) {
    try {
      const { citaId } = req.params;

      const total = await this.citaService.obtenerTotal(citaId);

      res.json({ total });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const { mascotaId, clienteId } = req.query;

      let citas;
      if (mascotaId) {
        citas = await this.citaService.obtenerCitasPorMascota(mascotaId as string);
      } else if (clienteId) {
        citas = await this.citaService.obtenerCitasPorCliente(clienteId as string);
      } else {
        return res.status(400).json({ error: 'Debe proporcionar mascotaId o clienteId' });
      }

      res.json(citas);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
