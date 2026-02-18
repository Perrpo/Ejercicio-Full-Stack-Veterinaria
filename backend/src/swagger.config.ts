/**
 * Configuración de Swagger
 */

import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Veterinaria - Arquitectura por Capas',
      version: '1.0.0',
      description: 'API REST para gestión de clínica veterinaria con arquitectura en capas (Domain, Application, Presentation, Shared)',
      contact: {
        name: 'Soporte API',
        email: 'soporte@veterinaria.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Verificación de salud del servidor'
      },
      {
        name: 'Citas',
        description: 'Gestión de citas veterinarias'
      },
      {
        name: 'Pagos',
        description: 'Gestión de pagos de servicios'
      }
    ],
    components: {
      schemas: {
        Cita: {
          type: 'object',
          properties: {
            id_cita: {
              type: 'integer',
              description: 'ID único de la cita'
            },
            id_usuario: {
              type: 'string',
              description: 'UUID del cliente'
            },
            id_paciente: {
              type: 'integer',
              description: 'ID de la mascota'
            },
            id_servicio: {
              type: 'integer',
              description: 'ID del servicio veterinario'
            },
            fecha_cita: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de la cita'
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'confirmada', 'cancelada', 'finalizada'],
              description: 'Estado actual de la cita'
            },
            motivo: {
              type: 'string',
              description: 'Motivo de la consulta'
            }
          }
        },
        CreateCitaDTO: {
          type: 'object',
          required: ['id_paciente', 'id_servicio', 'fecha_cita'],
          properties: {
            id_usuario: {
              type: 'string',
              description: 'UUID del cliente'
            },
            id_paciente: {
              type: 'integer',
              description: 'ID de la mascota'
            },
            id_servicio: {
              type: 'integer',
              description: 'ID del servicio'
            },
            fecha_cita: {
              type: 'string',
              format: 'date-time',
              example: '2026-02-20T10:00:00'
            },
            motivo: {
              type: 'string',
              example: 'Consulta general'
            }
          }
        },
        Pago: {
          type: 'object',
          properties: {
            id_pago: {
              type: 'integer',
              description: 'ID único del pago'
            },
            id_cita: {
              type: 'integer',
              description: 'ID de la cita asociada'
            },
            metodo_pago: {
              type: 'string',
              enum: ['efectivo', 'tarjeta', 'transferencia'],
              description: 'Método de pago utilizado'
            },
            monto: {
              type: 'number',
              format: 'float',
              description: 'Monto del pago'
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'pagado', 'rechazado'],
              description: 'Estado del pago'
            },
            fecha_pago: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha del pago'
            }
          }
        },
        CreatePagoDTO: {
          type: 'object',
          required: ['id_cita', 'metodo_pago', 'monto'],
          properties: {
            id_cita: {
              type: 'integer',
              description: 'ID de la cita'
            },
            metodo_pago: {
              type: 'string',
              enum: ['efectivo', 'tarjeta', 'transferencia'],
              example: 'tarjeta'
            },
            monto: {
              type: 'number',
              format: 'float',
              example: 150.50
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        }
      }
    }
  },
  apis: ['./src/presentation/routes/*.ts', './src/server.ts']
}

export const swaggerSpec = swaggerJsdoc(options)
