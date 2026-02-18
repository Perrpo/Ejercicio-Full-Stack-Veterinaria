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
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.veterinaria.com',
        description: 'Servidor de producción'
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
      },
      {
        name: 'Clientes',
        description: 'Gestión de clientes'
      },
      {
        name: 'Mascotas',
        description: 'Gestión de mascotas'
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
              type: 'integer',
              description: 'ID del cliente'
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
              type: 'integer',
              description: 'ID del cliente',
              example: 1
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
              enum: ['pendiente', 'pagado', 'fallido'],
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
        },
        Cliente: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'UUID único del cliente'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del cliente'
            },
            apellido: {
              type: 'string',
              description: 'Apellido del cliente'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del cliente'
            },
            telefono: {
              type: 'string',
              description: 'Teléfono del cliente'
            },
            direccion: {
              type: 'string',
              description: 'Dirección del cliente'
            }
          }
        },
        CreateClienteDTO: {
          type: 'object',
          required: ['nombre', 'apellido', 'email'],
          properties: {
            nombre: {
              type: 'string',
              example: 'Juan'
            },
            apellido: {
              type: 'string',
              example: 'Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@email.com'
            },
            telefono: {
              type: 'string',
              example: '+1234567890'
            },
            direccion: {
              type: 'string',
              example: 'Calle Principal #123'
            }
          }
        },
        Mascota: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la mascota'
            },
            idCliente: {
              type: 'integer',
              description: 'ID del cliente dueño'
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la mascota'
            },
            especie: {
              type: 'string',
              description: 'Especie de la mascota'
            },
            raza: {
              type: 'string',
              description: 'Raza de la mascota'
            },
            edad: {
              type: 'integer',
              description: 'Edad en años'
            },
            peso: {
              type: 'number',
              format: 'float',
              description: 'Peso en kg'
            }
          }
        },
        CreateMascotaDTO: {
          type: 'object',
          required: ['nombre', 'especie'],
          properties: {
            idCliente: {
              type: 'integer',
              description: 'ID del cliente dueño',
              example: 1
            },
            nombre: {
              type: 'string',
              example: 'Firulais'
            },
            especie: {
              type: 'string',
              example: 'Perro'
            },
            raza: {
              type: 'string',
              example: 'Labrador'
            },
            edad: {
              type: 'integer',
              example: 3
            },
            peso: {
              type: 'number',
              format: 'float',
              example: 25.5
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Autenticación mediante token JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/presentation/routes/*.ts', './src/server.ts']
}

export const swaggerSpec = swaggerJsdoc(options)
