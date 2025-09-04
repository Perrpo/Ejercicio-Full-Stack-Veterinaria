## VetCare - Sistema de Gestión Veterinaria

Sistema completo de gestión veterinaria con frontend y backend integrados. Aplicación full-stack que permite a los clientes gestionar el cuidado de sus mascotas de manera integral.

### Tecnologías
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: MySQL
- **Autenticación**: JWT
- **Enrutamiento**: `react-router-dom`
- **Estilos**: CSS utilitario con variables de color personalizadas

### Funcionalidades Principales

#### 🏠 **Dashboard del Cliente**
- **Inicio**: Resumen general con estadísticas de mascotas, citas, exámenes y pagos
- **Gestión de Mascotas**: Registro, edición y eliminación de mascotas
- **Reserva de Citas**: Agendamiento de citas médicas con servicios disponibles
- **Exámenes Médicos**: Solicitud y seguimiento de exámenes veterinarios
- **Historial Médico**: Vista cronológica y resumen por mascota de todo el historial
- **Gestión de Pagos**: Seguimiento de pagos con estados y exportación
- **Perfil de Usuario**: Edición de información personal y datos de contacto

#### 🔐 **Sistema de Autenticación**
- **Login**: Autenticación segura con JWT
- **Registro**: Creación de cuentas de cliente
- **Protección de rutas**: Acceso controlado a funcionalidades
- **Gestión de sesiones**: Persistencia de sesión de usuario

#### 🎨 **Diseño y UX**
- **Landing Page**: Página de inicio con información de servicios
- **Interfaz moderna**: Diseño limpio con paleta de colores cálida
- **Responsive**: Adaptable a diferentes dispositivos
- **Navegación intuitiva**: Menú lateral con iconos descriptivos

### Requisitos
- Node.js 18+ (recomendado 20+)
- MySQL 8.0+

### Cómo ejecutar

#### Backend
```bash
cd backend
npm install
npm start
```
El servidor se ejecutará en `http://localhost:3000`

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación se ejecutará en `http://localhost:5173`

### Configuración de Base de Datos
1. Crear base de datos MySQL llamada `vetcare`
2. Ejecutar el archivo `backend/src/db/migrations.sql` para crear las tablas
3. Ejecutar `backend/src/db/seed.sql` para datos iniciales
4. Configurar variables de entorno en el backend

### Estructura del Proyecto
```
├── backend/
│   ├── src/
│   │   ├── db/              # Migraciones y configuración de BD
│   │   ├── routes/          # Rutas de API (auth, client, admin)
│   │   └── server.ts        # Servidor principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── context/         # Contexto de autenticación
│   │   └── api/             # Cliente API
│   └── package.json
└── README.md
```

### Características Técnicas

#### Backend
- **API RESTful**: Endpoints para todas las operaciones CRUD
- **Autenticación JWT**: Tokens seguros para sesiones
- **Validación de datos**: Esquemas de validación con Zod
- **Base de datos relacional**: Estructura normalizada con MySQL
- **Middleware de seguridad**: Protección de rutas y validación de usuarios

#### Frontend
- **Componentes modulares**: Arquitectura limpia y reutilizable
- **Estado global**: Context API para autenticación
- **Formularios controlados**: Validación en tiempo real
- **Interfaz responsiva**: Adaptable a móviles y desktop
- **Navegación protegida**: Rutas privadas con autenticación

### Funcionalidades por Módulo

#### 🐾 **Gestión de Mascotas**
- Registro de mascotas con información completa
- Edición y eliminación de mascotas
- Validación de datos y manejo de errores

#### 📅 **Sistema de Citas**
- Agendamiento de citas con servicios disponibles
- Selección de mascota y fecha/hora
- Estados de citas (pendiente, confirmada, completada)

#### 📋 **Exámenes Médicos**
- Solicitud de exámenes por tipo
- Seguimiento de estados (pendiente, en proceso, completado)
- Resultados y observaciones médicas

#### 📄 **Historial Médico**
- Vista cronológica de citas y exámenes
- Resumen por mascota con estadísticas
- Filtros y búsqueda avanzada
- Exportación de datos a CSV

#### 💳 **Gestión de Pagos**
- Seguimiento de pagos por estado
- Resumen financiero con totales
- Historial completo de transacciones
- Métodos de pago múltiples

#### 👤 **Perfil de Usuario**
- Edición de información personal
- Gestión de datos de contacto
- Información de cuenta y seguridad

### Desarrollo y Contribución

#### Scripts Disponibles
```bash
# Frontend
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Previsualización del build
npm run lint         # Linting del código

# Backend
npm start            # Servidor de producción
npm run dev          # Servidor de desarrollo con hot reload
```

#### Estructura de Base de Datos
- **usuarios**: Información de clientes y administradores
- **pacientes**: Mascotas registradas por usuario
- **servicios**: Servicios veterinarios disponibles
- **citas**: Agendamiento de citas médicas
- **examenes**: Solicitudes y resultados de exámenes
- **pagos**: Transacciones y estados de pago

### Características de Seguridad
- **Autenticación JWT**: Tokens seguros con expiración
- **Validación de entrada**: Sanitización de datos en frontend y backend
- **Protección de rutas**: Middleware de autenticación
- **CORS configurado**: Políticas de seguridad para API
- **Encriptación de contraseñas**: Hash seguro con bcrypt

### Estado del Proyecto
✅ **Completado**:
- Sistema de autenticación completo
- Dashboard del cliente con todas las funcionalidades
- Gestión integral de mascotas, citas, exámenes y pagos
- Interfaz de usuario moderna y responsiva
- API RESTful con validación completa
- Base de datos estructurada y optimizada

🚀 **Listo para producción** con todas las funcionalidades principales implementadas.


