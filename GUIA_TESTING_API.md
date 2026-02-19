# 🚀 Guía para Probar las APIs

## 📋 Requisitos Previos

1. Node.js instalado (v16 o superior)
2. Cuenta de Supabase configurada
3. Cliente REST (Thunder Client, Postman, o cURL)

## ⚙️ Configuración Inicial

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
PORT=4000
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio
```

### 3. Ejecutar el servidor

```bash
npm run dev
```

El servidor estará corriendo en: **http://localhost:4000**

## 🧪 Probar los Endpoints

### Health Check

```bash
GET http://localhost:4000/health
```

### 📅 CITAS - Endpoints Disponibles

#### 1. Crear una cita
```bash
POST http://localhost:4000/api/citas
Content-Type: application/json

{
  "id_usuario": "uuid-del-cliente",
  "id_paciente": 1,
  "id_servicio": 1,
  "fecha_cita": "2026-02-20T10:00:00",
  "motivo": "Consulta general"
}
```

#### 2. Obtener todas las citas
```bash
GET http://localhost:4000/api/citas
```

#### 3. Obtener una cita específica
```bash
GET http://localhost:4000/api/citas/1
```

#### 4. Obtener citas de un cliente
```bash
GET http://localhost:4000/api/citas/cliente
# Requiere autenticación con token
```

#### 5. Actualizar una cita
```bash
PUT http://localhost:4000/api/citas/1
Content-Type: application/json

{
  "fecha_cita": "2026-02-21T15:00:00",
  "motivo": "Consulta actualizada"
}
```

#### 6. Confirmar una cita
```bash
PUT http://localhost:4000/api/citas/1/confirmar
```

#### 7. Cancelar una cita
```bash
PUT http://localhost:4000/api/citas/1/cancelar
```

#### 8. Finalizar una cita
```bash
PUT http://localhost:4000/api/citas/1/finalizar
```

#### 9. Eliminar una cita
```bash
DELETE http://localhost:4000/api/citas/1
```

### 💰 PAGOS - Endpoints Disponibles

#### 1. Crear un pago
```bash
POST http://localhost:4000/api/pagos
Content-Type: application/json

{
  "id_cita": 1,
  "metodo_pago": "tarjeta",
  "monto": 150.50
}
```

#### 2. Obtener todos los pagos
```bash
GET http://localhost:4000/api/pagos
```

#### 3. Obtener un pago específico
```bash
GET http://localhost:4000/api/pagos/1
```

#### 4. Obtener pagos de una cita
```bash
GET http://localhost:4000/api/pagos/cita/1
```

#### 5. Actualizar un pago
```bash
PUT http://localhost:4000/api/pagos/1
Content-Type: application/json

{
  "monto": 200.00
}
```

#### 6. Confirmar un pago
```bash
PUT http://localhost:4000/api/pagos/1/confirmar
```

#### 7. Rechazar un pago
```bash
PUT http://localhost:4000/api/pagos/1/rechazar
```

#### 8. Eliminar un pago
```bash
DELETE http://localhost:4000/api/pagos/1
```

## 🔧 Usando Thunder Client (VS Code)

1. Instala la extensión **Thunder Client** en VS Code
2. Crea una nueva colección llamada "Veterinaria API"
3. Crea las peticiones copiando los ejemplos de arriba
4. Guarda las variables de entorno en Thunder Client:
   - `baseUrl`: http://localhost:4000

## 🔧 Usando cURL

### Ejemplo: Crear una cita

```bash
curl -X POST http://localhost:4000/api/citas \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": "abc-123",
    "id_paciente": 1,
    "id_servicio": 1,
    "fecha_cita": "2026-02-20T10:00:00",
    "motivo": "Consulta general"
  }'
```

### Ejemplo: Obtener todas las citas

```bash
curl http://localhost:4000/api/citas
```

## 📊 Estados Disponibles

### Estados de Citas
- `pendiente`
- `confirmada`
- `cancelada`
- `finalizada`

### Estados de Pagos
- `pendiente`
- `pagado`
- `rechazado`

### Métodos de Pago
- `efectivo`
- `tarjeta`
- `transferencia`

## 🐛 Solución de Problemas

### Error: Cannot find module
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Cannot connect to database
- Verifica que las credenciales de Supabase sean correctas
- Asegúrate de que tu IP esté autorizada en Supabase

### Error 404: Not found
- Verifica que el servidor esté corriendo
- Usa el prefijo `/api` en todas las rutas

## 📝 Notas

- Todos los endpoints bajo `/api` son parte de la arquitectura por capas
- Las respuestas son en formato JSON
- Los códigos de estado HTTP siguen estándares REST:
  - 200: OK
  - 201: Created
  - 204: No Content
  - 400: Bad Request
  - 404: Not Found
  - 500: Internal Server Error
