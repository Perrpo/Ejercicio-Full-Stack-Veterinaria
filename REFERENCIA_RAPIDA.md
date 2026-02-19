# 📊 Referencia Rápida - Estructura por Capas

## Árbol de Carpetas Completo

```
backend/src/
│
├── 🏛️  DOMAIN/                          [CAPA DE DOMINIO - PURA]
│   │
│   ├── enums/
│   │   └── index.ts
│   │       ├── EstadoCita
│   │       ├── EstadoPago
│   │       └── MetodoPago
│   │
│   ├── entities/
│   │   └── index.ts
│   │       ├── Cliente
│   │       ├── Mascota
│   │       ├── Veterinario
│   │       ├── Cita
│   │       └── Pago
│   │
│   ├── services-domain/
│   │   ├── servicios.ts
│   │   │   ├── IServicio (interface)
│   │   │   ├── Radiografia
│   │   │   ├── Vacunacion
│   │   │   ├── Consulta
│   │   │   ├── Peluqueria
│   │   │   ├── AnalisisSangre
│   │   │   ├── CirugiaMenor
│   │   │   ├── LimpiezaDental
│   │   │   └── Urgencias
│   │   ├── pagos.ts
│   │   │   ├── IPago (interface)
│   │   │   ├── PagoTarjeta
│   │   │   ├── PagoEfectivo
│   │   │   └── PagoTransferencia
│   │   └── index.ts
│   │
│   └── index.ts (barrel)
│
├── 🔧 APPLICATION/                      [CAPA DE APLICACIÓN]
│   │
│   ├── repositories/
│   │   └── index.ts
│   │       ├── CitaRepository
│   │       │   ├── save()
│   │       │   ├── findById()
│   │       │   ├── findByCliente()
│   │       │   ├── findByMascota()
│   │       │   ├── findAll()
│   │       │   ├── update()
│   │       │   └── delete()
│   │       ├── MascotaRepository
│   │       └── PagoRepository
│   │
│   ├── services/
│   │   └── index.ts
│   │       ├── CitaService
│   │       │   ├── crearCita()
│   │       │   ├── confirmarCita()
│   │       │   ├── cancelarCita()
│   │       │   ├── finalizarCita()
│   │       │   ├── obtenerCitasPorCliente()
│   │       │   ├── obtenerCitasPorMascota()
│   │       │   ├── obtenerTodasLasCitas()
│   │       │   ├── actualizarCita()
│   │       │   └── eliminarCita()
│   │       └── PagoService
│   │           ├── crearPago()
│   │           ├── confirmarPago()
│   │           ├── rechazarPago()
│   │           ├── obtenerPagosCita()
│   │           ├── obtenerPago()
│   │           ├── obtenerTodosPagos()
│   │           ├── actualizarPago()
│   │           ├── eliminarPago()
│   │           └── verificarCitaPagada()
│   │
│   └── index.ts (barrel)
│
├── 🌐 PRESENTATION/                      [CAPA DE PRESENTACIÓN]
│   │
│   ├── controllers/
│   │   └── index.ts
│   │       ├── CitaController
│   │       │   ├── crearCita()
│   │       │   ├── obtenerCita()
│   │       │   ├── obtenerCitasCliente()
│   │       │   ├── obtenerTodasCitas()
│   │       │   ├── confirmarCita()
│   │       │   ├── cancelarCita()
│   │       │   ├── finalizarCita()
│   │       │   ├── actualizarCita()
│   │       │   └── eliminarCita()
│   │       └── PagoController
│   │           ├── crearPago()
│   │           ├── obtenerPago()
│   │           ├── obtenerPagosCita()
│   │           ├── obtenerTodosPagos()
│   │           ├── confirmarPago()
│   │           ├── rechazarPago()
│   │           ├── actualizarPago()
│   │           └── eliminarPago()
│   │
│   ├── routes/
│   │   └── index.ts
│   │       ├── POST   /citas
│   │       ├── GET    /citas
│   │       ├── GET    /citas/cliente
│   │       ├── GET    /citas/:id
│   │       ├── PUT    /citas/:id
│   │       ├── PUT    /citas/:id/confirmar
│   │       ├── PUT    /citas/:id/cancelar
│   │       ├── PUT    /citas/:id/finalizar
│   │       ├── DELETE /citas/:id
│   │       ├── POST   /pagos
│   │       ├── GET    /pagos
│   │       ├── GET    /pagos/:id
│   │       ├── GET    /pagos/cita/:citaId
│   │       ├── PUT    /pagos/:id
│   │       ├── PUT    /pagos/:id/confirmar
│   │       ├── PUT    /pagos/:id/rechazar
│   │       └── DELETE /pagos/:id
│   │
│   └── index.ts (barrel)
│
├── 📦 SHARED/                            [CAPA COMPARTIDA]
│   │
│   └── types/
│       ├── dtos.ts
│       │   ├── CreateCitaDTO
│       │   ├── CitaResponseDTO
│       │   ├── UpdateCitaDTO
│       │   ├── CreatePagoDTO
│       │   ├── PagoResponseDTO
│       │   ├── UpdatePagoDTO
│       │   ├── CreateClienteDTO
│       │   ├── ClienteResponseDTO
│       │   ├── CreateMascotaDTO
│       │   ├── MascotaResponseDTO
│       │   ├── CreateVeterinarioDTO
│       │   └── VeterinarioResponseDTO
│       ├── interfaces.ts
│       │   ├── ICitaRepository
│       │   ├── IMascotaRepository
│       │   ├── IPagoRepository
│       │   ├── IClienteRepository
│       │   └── IVeterinarioRepository
│       └── index.ts
│
├── 🔌 OTRAS CAPAS
│   ├── db/                          [Base de datos]
│   ├── middlewares/                 [Middlewares]
│   ├── supabase.ts                  [Conexión Supabase]
│   └── server.ts                    [Punto de entrada]
```

---

## 🔀 Cómo Fluyen los Datos

### Crear una Cita

```
Cliente (HTTP)
    ↓
POST /citas { id_usuario, id_paciente, ... }
    ↓
[PRESENTATION] CitaController.crearCita()
    ↓ validar campos básicos
    ↓
[APPLICATION] CitaService.crearCita()
    ↓ validar mascota, usuario, fecha
    ↓
[APPLICATION] CitaRepository.save()
    ↓ INSERT a Supabase
    ↓
[DOMAIN] Entidad Cita
    ↓ estado = Pendiente
    ↓
HTTP Response 201 { id_cita, estado, ... }
```

### Confirmar una Cita

```
Cliente (HTTP)
    ↓
PUT /citas/42/confirmar
    ↓
[PRESENTATION] CitaController.confirmarCita()
    ↓
[APPLICATION] CitaService.confirmarCita()
    ↓ validar estado = Pendiente
    ↓
[APPLICATION] CitaRepository.findById()
    ↓ GET de Supabase
    ↓
[DOMAIN] Cita.confirmar()
    ↓ cambiar estado a Confirmada
    ↓
[APPLICATION] CitaRepository.update()
    ↓ UPDATE en Supabase
    ↓
HTTP Response 200 { id_cita, estado: Confirmada, ... }
```

---

## 📋 Tabla de Responsabilidades

| Capa | Responsabilidad | No Depende De |
|------|-----------------|---------------|
| **Domain** | Entidades, lógica pura, enums | Nada (solo de sí misma) |
| **Application** | Servicios, repositorios, orquestación | Framework, HTTP |
| **Presentation** | Controllers, routes, HTTP | Nada de lo anterior depende de esto |
| **Shared** | Types, DTOs, interfaces | Específico de una capa |

---

## 🔗 Imports Correctos

### ✅ CORRECTO

```typescript
// En Controller
import { CitaService } from '../../application'
import { CreateCitaDTO } from '../../shared/types'

// En Service
import { CitaRepository } from '../repositories'
import { EstadoCita } from '../../domain'

// En Repository
import { EstadoCita } from '../../domain'
import { supabaseAdmin } from '../../supabase'
```

### ❌ INCORRECTO

```typescript
// Domain NO tiene que importar de Application
import { CitaService } from '../../application'  // ❌

// Application NO tiene que importar de Presentation
import { CitaController } from '../../presentation'  // ❌

// Controllers importan cierta información de abajo OK
// pero NO de arriba
```

---

## 📌 Puntos Clave

1. **Domain es el corazón** - Contiene la lógica de negocio pura
2. **No hay framework en Domain** - Work/Supabase/Express no aparecen en Domain
3. **Application orquesta** - Conecta Domain con el mundo externo
4. **Presentation habla HTTP** - Controllers reciben req/res
5. **Shared es reutilizable** - DTOs y interfaces disponibles a todas las capas

---

## 🎯 Dónde Agregar Código Nuevo

### Nuevo tipo de servicio veterinario
→ `domain/services-domain/servicios.ts`

### Nueva validación de cita
→ `domain/entities/index.ts` (método en Cita)

### Nuevo paso de pagos
→ `application/services/index.ts` (PagoService)

### Nuevo endpoint HTTP
→ `presentation/routes/index.ts` + `presentation/controllers/index.ts`

### Nuevo DTO para API
→ `shared/types/dtos.ts`

### Optimización de BD
→ `application/repositories/index.ts`

---

**¡Tu arquitectura está limpia y escalable! 🚀**
