# Arquitectura API REST - Clínica Veterinaria

## Visión General

Esta es una **API REST simple sin DDD**, implementada con **Express.js + TypeScript + Supabase (PostgreSQL)**, siguiendo un patrón de **3 capas:**

```
HTTP Requests
     ↓
[Controllers] ← Manejan HTTP (request/response)
     ↓
[Services] ← Lógica de negocio y orquestación
     ↓
[Repositories] ← Acceso a datos (Supabase)
     ↓
[Database]
```

---

## Estructura de Carpetas

```
backend/src/
├── models/
│   ├── enums.ts              # EstadoCita, EstadoPago, MetodoPago
│   ├── servicios.ts          # IServicio (8 tipos: Radiografia, Vacunacion, etc)
│   ├── pagos.ts              # IPago (3 métodos: Tarjeta, Efectivo, Transferencia)
│   ├── entities.ts           # Entidades: Cliente, Mascota, Veterinario, Cita, Pago
│   ├── dtos.ts               # DTOs para API (CreateCitaDTO, CitaResponseDTO, etc)
│   └── interfaces.ts         # Contratos de repositorios
│
├── repositories/
│   ├── repositories.ts       # Implementaciones Supabase (Cita, Mascota, Pago)
│   └── index.ts              # Exports
│
├── services/
│   ├── services.ts           # CitaService, PagoService (lógica de negocio)
│   └── index.ts              # Exports
│
├── controllers/
│   ├── citas-pagos.controller.ts  # CitaController, PagoController (HTTP handlers)
│   └── index.ts              # Exports
│
├── routes/
│   ├── citas.routes.ts       # Endpoints de citas
│   ├── pagos.routes.ts       # Endpoints de pagos
│   └── index.ts              # Exports centralizados
│
└── server.ts                 # Punto de entrada
```

---

## Capas Explicadas

### 1. **Controllers** (HTTP Layer)
Responsables de:
- Recibir `Request` HTTP
- Extraer parámetros y body
- Validar entrada básica
- Llamar al Service
- Retornar respuesta HTTP con status code

**Ejemplo - CitaController.crearCita():**
```typescript
async crearCita(req: Request, res: Response) {
  const { id_usuario, id_paciente, id_servicio, fecha_cita, motivo } = req.body
  
  // Validación básica
  if (!id_paciente || !id_servicio || !fecha_cita) {
    return res.status(400).json({ error: 'Faltan campos' })
  }
  
  const cita = await this.citaService.crearCita({...})
  res.status(201).json(cita)  // 201 = Created
}
```

### 2. **Services** (Business Logic Layer)
Responsables de:
- Validaciones complejas
- Transiciones de estado
- Orquestación de repositorios
- Cálculos y lógica de negocio
- Lanzar excepciones para casos de error

**Ejemplo - CitaService.confirmarCita():**
```typescript
async confirmarCita(id: number) {
  const cita = await this.citaRepository.findById(id)
  if (!cita) throw new Error('Cita no encontrada')
  
  // Validar que solo se confirmen citas pendientes
  if (cita.estado !== EstadoCita.Pendiente) {
    throw new Error('Solo se pueden confirmar citas pendientes')
  }
  
  return this.citaRepository.update(id, { 
    estado: EstadoCita.Confirmada 
  })
}
```

### 3. **Repositories** (Data Access Layer)
Responsables de:
- Conectar a Supabase
- Ejecutar queries (insert, select, update, delete)
- Mapear resultados de BD a objetos TypeScript
- Retornar datos al Service

**Ejemplo - CitaRepository.save():**
```typescript
async save(data: CreateCitaDTO) {
  const { data: result, error } = await supabaseAdmin
    .from('citas')
    .insert([{
      id_usuario: data.id_usuario,
      id_paciente: data.id_paciente,
      id_servicio: data.id_servicio,
      fecha_cita: data.fecha_cita,
      estado: data.estado
    }])
    .select()
    .single()
  
  if (error) throw error
  return result
}
```

---

## Modelos de Datos

### Entidades Principales

#### **Cliente**
```typescript
{
  id: string,
  nombre: string,
  apellido: string,
  email: string,
  telefono: string,
  direccion: string
}
```

#### **Mascota** 
```typescript
{
  id: number,
  id_usuario: string,
  nombre: string,
  especie: string,
  raza: string,
  edad: number,
  peso: number
}
```

#### **Cita**
```typescript
{
  id: number,
  id_mascota: number,
  id_veterinario: number,
  id_usuario: string,
  fecha_cita: string,
  estado: 'Pendiente' | 'Confirmada' | 'Finalizada' | 'Cancelada',
  motivo: string,
  servicios: IServicio[],
  pagos: Pago[]
}
```

**Estados de Cita:**
- `Pendiente` → Nueva cita
- `Confirmada` → Confirmada por cliente/admin
- `Finalizada` → Completada
- `Cancelada` → Cancelada

#### **Pago**
```typescript
{
  id: number,
  id_cita: number,
  monto: number,
  estado: 'Pendiente' | 'Pagado' | 'Rechazado',
  metodo_pago: 'Efectivo' | 'TarjetaCredito' | 'TarjetaDebito' | 'Transferencia',
  fecha_pago: Date
}
```

**Estados de Pago:**
- `Pendiente` → Pago no procesado
- `Pagado` → Pago confirmado
- `Rechazado` → Pago fallido

---

## API Endpoints

### **Citas**

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/citas` | Crear nueva cita |
| `GET` | `/citas` | Obtener todas (con filtro opcional) |
| `GET` | `/citas/cliente` | Obtener citas del usuario autenticado |
| `GET` | `/citas/:id` | Obtener cita específica |
| `PUT` | `/citas/:id` | Actualizar cita |
| `PUT` | `/citas/:id/confirmar` | Confirmar cita |
| `PUT` | `/citas/:id/cancelar` | Cancelar cita |
| `PUT` | `/citas/:id/finalizar` | Finalizar cita |
| `DELETE` | `/citas/:id` | Eliminar cita |

**POST /citas - Request:**
```json
{
  "id_usuario": "user-123",
  "id_paciente": 5,
  "id_servicio": 1,
  "fecha_cita": "2025-02-15T10:00:00Z",
  "motivo": "Revisión general"
}
```

**POST /citas - Response (201):**
```json
{
  "id": 42,
  "id_usuario": "user-123",
  "id_paciente": 5,
  "id_servicio": 1,
  "fecha_cita": "2025-02-15T10:00:00Z",
  "estado": "Pendiente",
  "motivo": "Revisión general"
}
```

---

### **Pagos**

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/pagos` | Crear nuevo pago |
| `GET` | `/pagos` | Obtener todos los pagos |
| `GET` | `/pagos/:id` | Obtener pago específico |
| `GET` | `/pagos/cita/:citaId` | Obtener pagos de una cita |
| `PUT` | `/pagos/:id` | Actualizar pago |
| `PUT` | `/pagos/:id/confirmar` | Confirmar pago |
| `PUT` | `/pagos/:id/rechazar` | Rechazar pago |
| `DELETE` | `/pagos/:id` | Eliminar pago |

**POST /pagos - Request:**
```json
{
  "id_cita": 42,
  "metodo_pago": "Efectivo",
  "monto": 250
}
```

**POST /pagos - Response (201):**
```json
{
  "id": 1,
  "id_cita": 42,
  "monto": 250,
  "estado": "Pendiente",
  "metodo_pago": "Efectivo",
  "fecha_pago": "2025-02-10T14:30:00Z"
}
```

---

## Servicios Veterinarios

| Servicio | Precio | Duración |
|----------|--------|----------|
| Radiografía | €250 | 30 min |
| Vacunación | €150 | 20 min |
| Consulta | €100 | 30 min |
| Peluquería | €300 | 60 min |
| Análisis Sangre | €200 | 15 min |
| Cirugía Menor | €500 | 90 min |
| Limpieza Dental | €350 | 45 min |
| Urgencias | €600 | 60 min (1.5x precio base) |

---

## Métodos de Pago

1. **Efectivo** - Pago en mano
2. **Tarjeta de Crédito** - Valida 16 dígitos
3. **Tarjeta de Débito** - Valida 16 dígitos
4. **Transferencia Bancaria** - Requiere IBAN

---

## Flujo de Ejemplo: Crear Cita y Pagar

### Paso 1: Crear Cita
```bash
POST /citas HTTP/1.1
Content-Type: application/json

{
  "id_usuario": "user-123",
  "id_paciente": 5,
  "id_servicio": 1,
  "fecha_cita": "2025-02-15T10:00:00Z",
  "motivo": "Revisión"
}

# Response: 201 Created
{
  "id": 42,
  "estado": "Pendiente",
  ...
}
```

### Paso 2: Confirmar Cita
```bash
PUT /citas/42/confirmar HTTP/1.1

# Response: 200 OK
{
  "id": 42,
  "estado": "Confirmada",
  ...
}
```

### Paso 3: Crear Pago
```bash
POST /pagos HTTP/1.1
Content-Type: application/json

{
  "id_cita": 42,
  "metodo_pago": "Efectivo",
  "monto": 250
}

# Response: 201 Created
{
  "id": 1,
  "id_cita": 42,
  "estado": "Pendiente",
  ...
}
```

### Paso 4: Confirmar Pago
```bash
PUT /pagos/1/confirmar HTTP/1.1

# Response: 200 OK
{
  "id": 1,
  "estado": "Pagado",
  ...
}
```

---

## Validaciones Clave

### En Services:

✅ **Cita:**
- Mascota existe
- Mascota pertenece al usuario
- Fecha es futura
- Solo se confirman citas en estado Pendiente
- Solo se cancela citas que no están Finalizadas

✅ **Pago:**
- Cita existe
- Monto > 0
- Solo se confirman pagos Pendientes

---

## Códigos HTTP Esperados

| Código | Significado | Ejemplo |
|--------|------------|---------|
| `200` | OK - Éxito | GET /citas/42 |
| `201` | Created - Recurso creado | POST /citas |
| `204` | No Content - Eliminación exitosa | DELETE /citas/42 |
| `400` | Bad Request - Error del cliente | POST /citas (campos faltantes) |
| `404` | Not Found - Recurso no existe | GET /citas/999 |
| `500` | Server Error - Error del servidor | Excepción no capturada |

---

## Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js v4+
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL (Supabase)
- **ORM/Query:** Supabase Client SDK
- **Validación:** DTOs + TypeScript types

---

## Próximos Pasos

1. **Middlewares de Autenticación** - JWT token validation
2. **Manejo de Errores** - Error middleware robusto
3. **Logging** - Morgan/Winston para logs
4. **Testing** - Jest para unit tests
5. **Documentación API** - Swagger/OpenAPI

---

**Versión:** 1.0  
**Fecha:** 2025-02-10  
**Patrón:** REST API Simple (sin DDD)
