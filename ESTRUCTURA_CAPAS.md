# 🏗️ Estructura de Capas - Arquitectura Limpia

La arquitectura está organizada en **3 capas** bien definidas:

```
┌─────────────────────────────────────────┐
│     PRESENTATION LAYER                  │
│  ├─ controllers/   (HTTP Handlers)      │
│  └─ routes/        (Endpoints)          │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│     APPLICATION LAYER                   │
│  ├─ repositories/ (Data Access)         │
│  └─ services/     (Business Logic)      │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│     DOMAIN LAYER                        │
│  ├─ entities/         (Entidades)       │
│  ├─ enums/            (Enumeraciones)   │
│  └─ services-domain/  (Servicios Puro)  │
│     ├─ servicios.ts   (IServicio)       │
│     └─ pagos.ts       (IPago)           │
└─────────────────────────────────────────┘
           ▲
           │
   SHARED LAYER
   └─ shared/types/
      ├─ dtos.ts       (Contratos de API)
      └─ interfaces.ts (Contratos de Repos)
```

---

## 📁 Estructura de Carpetas

```
backend/src/
│
├── domain/                          # ⭐ Capa de Dominio (Entidades Puras)
│   ├── enums/
│   │   └── index.ts                # EstadoCita, EstadoPago, MetodoPago
│   ├── entities/
│   │   └── index.ts                # Cliente, Mascota, Veterinario, Cita, Pago
│   ├── services-domain/
│   │   ├── servicios.ts            # IServicio + 8 implementaciones
│   │   ├── pagos.ts                # IPago + 3 implementaciones
│   │   └── index.ts                # Exports
│   └── index.ts                    # Barrel export
│
├── application/                     # 🔧 Capa de Aplicación (Lógica de Negocio)
│   ├── repositories/
│   │   └── index.ts                # CitaRepository, MascotaRepository, PagoRepository
│   ├── services/
│   │   └── index.ts                # CitaService, PagoService
│   └── index.ts                    # Barrel export
│
├── presentation/                    # 🌐 Capa de Presentación (HTTP)
│   ├── controllers/
│   │   └── index.ts                # CitaController, PagoController
│   ├── routes/
│   │   └── index.ts                # Endpoints
│   └── index.ts                    # Barrel export
│
├── shared/                          # 📦 Capa Compartida
│   └── types/
│       ├── dtos.ts                 # DTOs (Request/Response)
│       ├── interfaces.ts           # Interfaces de Repositorios
│       └── index.ts                # Exports
│
└── server.ts                        # Punto de Entrada
```

---

## 🔄 Flujo de Datos

### Ejemplo: Crear una Cita

```
1️⃣  HTTP Request
   POST /citas
   { id_usuario, id_paciente, id_servicio, fecha_cita }

         ▼

2️⃣  PRESENTATION Layer (Controller)
   CitaController.crearCita()
   ├─ Extraer datos del request
   ├─ Validar campos básicos
   └─ Llamar al service

         ▼

3️⃣  APPLICATION Layer (Service)
   CitaService.crearCita()
   ├─ Validar mascota existe
   ├─ Validar pertenencia al usuario
   ├─ Validar fecha futura
   └─ Llamar al repositorio

         ▼

4️⃣  APPLICATION Layer (Repository)
   CitaRepository.save()
   ├─ Mapear DTO a objeto BD
   ├─ Ejecutar INSERT en Supabase
   └─ Retornar resultado

         ▼

5️⃣  DOMAIN Layer (Entity)
   Entidad Cita creada
   ├─ Estado = Pendiente
   └─ Lista de métodos disponibles (confirmar, cancelar, etc)

         ▼

6️⃣  HTTP Response
   201 Created
   { id_cita, estado, fecha_cita, ... }
```

---

## 🎯 Responsabilidades de Cada Capa

### DOMAIN LAYER (Dominio Puro)
**Sin dependencias externas, sin conocimiento de HTTP o BD**

- ✅ Entidades con lógica de negocio
- ✅ Enumeraciones para estados
- ✅ Interfaces puras (IServicio, IPago)
- ✅ Métodos: confirmar(), cancelar(), calcularTotal()

**Ejemplo:**
```typescript
export class Cita {
  estado: EstadoCita
  servicios: IServicio[]
  
  confirmar(): void {
    if (this.estado === EstadoCita.Pendiente) {
      this.estado = EstadoCita.Confirmada
    }
  }
  
  calcularTotal(): number {
    return this.servicios.reduce((sum, s) => sum + s.calcularPrecio(), 0)
  }
}
```

### APPLICATION LAYER (Lógica de Aplicación)
**Orquesta el dominio con fuentes de datos**

**Repositorios:**
- Acceso a BD (Supabase)
- Query CRUD
- Retornan objetos del dominio

**Servicios:**
- Lógica transaccional
- Validaciones complejas
- Orquestación de repositorios
- Transiciones de estado

**Ejemplo:**
```typescript
export class CitaService {
  async confirmarCita(id: number) {
    const cita = await this.citaRepository.findById(id)
    
    // Validar estado
    if (cita.estado !== EstadoCita.Pendiente) {
      throw new Error('Solo se confirman citas pendientes')
    }
    
    // Cambiar estado
    cita.confirmar()
    
    // Persistir
    return await this.citaRepository.update(id, cita)
  }
}
```

### PRESENTATION LAYER (HTTP)
**Interfaz con el cliente (Request/Response)**

**Controllers:**
- Reciben Request HTTP
- Extraen parámetros
- Llaman a services
- Retornan Response con status code

**Routes:**
- Mapean URL → Controller
- Aplican middlewares (auth, validación)

**Ejemplo:**
```typescript
export class CitaController {
  async confirmarCita(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await this.citaService.confirmarCita(parseInt(id))
      res.json(result)  // 200 OK
    } catch (error: any) {
      res.status(400).json({ error: error.message })  // 400 Bad Request
    }
  }
}
```

### SHARED LAYER (Compartido)
**Tipos y contratos reutilizables**

- **DTOs**: Estructuras para HTTP (CreateCitaDTO, CitaResponseDTO)
- **Interfaces**: Contratos de repositorios (ICitaRepository)

---

## 📊 Dependencias Directas

```
PRESENTATION → APPLICATION → DOMAIN
    ↑             ↑            ↑
    └─────────────┴────────────┘
         (importa desde)
         
         SHARED (tipos compartidos)
```

**Regla:** Cada capa solo importa de capas **por debajo** de ella.

- ✅ Presentation importa de Application
- ✅ Application importa de Domain
- ✅ Todos importan de Shared
- ❌ Domain NO importa de Presentation
- ❌ Application NO importa de Presentation

---

## 🚀 Imports Limpios

Cada capa tiene un **barrel export** (index.ts) para imports simples:

```typescript
// ❌ Evitar
import { CitaService } from '../../../application/services/citas.service'
import { CitaController } from '../../../presentation/controllers/citas.controller'

// ✅ Hacer
import { CitaService } from '@app/application'
import { CitaController } from '@app/presentation'
```

---

## 📝 Donde Agregar Nuevo Código

### Nuevo Servicio Veterinario
→ `domain/services-domain/servicios.ts`

### Nueva Lógica de Negocio
→ `application/services/`

### Nuevo Endpoint HTTP
→ `presentation/routes/` + `presentation/controllers/`

### Nueva Validación de Datos
→ `shared/types/dtos.ts`

### Manejo de Base de Datos
→ `application/repositories/`

---

## ✅ Ventajas de esta Estructura

1. **Separación de Responsabilidades** - Cada capa tiene un propósito claro
2. **Testing Fácil** - Cada capa se puede testear independientemente
3. **Mantenibilidad** - Código organizado y predecible
4. **Escalabilidad** - Fácil agregar nuevas funcionalidades
5. **Independencia de Frameworks** - Domain no depende de Express/Supabase
6. **Reutilización** - Shared types reutilizables

---

## 🔗 Integración en server.ts

```typescript
import { router } from './presentation'

app.use('/api', router)  // Todas las rutas bajo /api/citas, /api/pagos
```

---

**Versión**: 1.0  
**Patrón**: Clean Architecture (3 Capas)  
**Fecha**: 2025-02-17
