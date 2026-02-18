/**
 * IServicio - Interfaz que define un servicio veterinario
 * Cumple con ISP (Interface Segregation Principle)
 */
export interface IServicio {
  id?: string;
  nombre: string;
  obtenerPrecio(): number;
  obtenerDuracion(): number;
}
