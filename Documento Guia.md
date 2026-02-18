# VetCare - Sistema de Gestión Veterinaria Completo

Sistema full-stack de gestión veterinaria que permite a los clientes gestionar integralmente el cuidado de sus mascotas. Aplicación completa con frontend moderno, backend robusto y base de datos relacional.

## Tecnologías Implementadas

### Frontend
- **React 19** + **TypeScript** + **Vite** - Framework moderno con tipado estático
- **React Router DOM** - Enrutamiento dinámico y protección de rutas
- **Context API** - Gestión de estado global para autenticación
- **CSS Utilitario** - Estilos personalizados con variables de color
- **PostCSS** - Procesamiento de estilos optimizado

### Backend
- **Node.js** + **Express** + **TypeScript** - Servidor robusto y escalable
- **MySQL** - Base de datos relacional con estructura normalizada
- **JWT** - Autenticación segura con tokens
- **Zod** - Validación de esquemas de datos
- **bcrypt** - Encriptación segura de contraseñas

## Funcionalidades Principales Implementadas

### 🏠 Dashboard del Cliente
**Interfaz principal con navegación intuitiva y resumen completo**

- **Página de Inicio**: 
  - Tarjetas de resumen con estadísticas en tiempo real
  - Contadores de mascotas, citas próximas, exámenes recientes y pagos pendientes
  - Acciones rápidas para navegación directa
  - Notificaciones y recordatorios

- **Navegación Lateral**:
  - Menú con iconos descriptivos y estados activos
  - Indicador visual de sección actual
  - Diseño responsivo y accesible

### 🐾 Gestión de Mascotas
**Sistema completo de registro y administración de mascotas**

- **Registro de Mascotas**:
  - Formulario con campos: nombre, especie, raza, edad, peso
  - Validación en tiempo real de datos
  - Modal interactivo con animaciones

- **Lista de Mascotas**:
  - Vista en tarjetas con información completa
  - Botones de edición y eliminación
  - Estados vacíos con mensajes instructivos

- **Funcionalidades**:
  - Edición de información de mascotas existentes
  - Eliminación con confirmación
  - Validación de datos y manejo de errores

### 📅 Sistema de Citas
**Agendamiento completo de citas médicas**

- **Reserva de Citas**:
  - Selección de mascota desde lista desplegable
  - Calendario de servicios disponibles
  - Selección de fecha y hora
  - Información de precios y duración

- **Gestión de Citas**:
  - Estados: pendiente, confirmada, completada, cancelada
  - Vista de citas próximas en dashboard
  - Historial completo de citas

- **Servicios Disponibles**:
  - Consulta general, vacunación, cirugía, emergencia
  - Precios dinámicos y duración estimada
  - Descripción detallada de cada servicio

### 📋 Exámenes Médicos
**Solicitud y seguimiento de exámenes veterinarios**

- **Solicitud de Exámenes**:
  - Modal con formulario completo
  - Selección de mascota y tipo de examen
  - Campo de observaciones opcional
  - Validación de campos obligatorios

- **Tipos de Examen Disponibles**:
  - Análisis de Sangre, Radiografía, Ecografía
  - Análisis de Orina, Heces, Biopsia
  - Endoscopia, Electrocardiograma
  - Análisis de Piel, Plumas, Otro

- **Seguimiento de Estados**:
  - Pendiente, En Proceso, Completado
  - Colores distintivos para cada estado
  - Resultados y observaciones médicas

### 📄 Historial Médico
**Vista integral del historial médico de todas las mascotas**

- **Pestañas de Visualización**:
  - **Línea de Tiempo**: Vista cronológica de citas y exámenes
  - **Resumen por Mascota**: Estadísticas consolidadas por mascota

- **Filtros y Búsqueda**:
  - Búsqueda en tiempo real por descripción o mascota
  - Filtro por mascota específica
  - Filtro por tipo (citas o exámenes)
  - Filtros combinados para búsquedas precisas

- **Funcionalidades Avanzadas**:
  - Exportación de datos a CSV
  - Información detallada de cada registro
  - Estados visuales con colores distintivos

### 💳 Gestión de Pagos
**Seguimiento completo de transacciones y pagos**

- **Resumen Financiero**:
  - **Total Pagado**: Suma de pagos completados (verde)
  - **Pendiente**: Pagos en proceso (amarillo)
  - **Total General**: Suma total de transacciones (naranja)

- **Historial de Pagos**:
  - Lista completa de transacciones
  - Información detallada: servicio, mascota, fecha, método
  - Estados: pagado, pendiente, fallido
  - Montos en formato de moneda colombiana

- **Métodos de Pago**:
  - Efectivo, Tarjeta de Crédito, Tarjeta de Débito
  - Transferencia bancaria
  - Seguimiento de pagos fallidos con mensajes de ayuda

### 👤 Perfil de Usuario
**Gestión completa de información personal**

- **Información Personal**:
  - Nombre completo, teléfono, dirección
  - Correo electrónico (no editable por seguridad)
  - Contacto de emergencia
  - Diseño en dos columnas organizadas

- **Información de Cuenta**:
  - ID de usuario único
  - Fecha de registro
  - Última conexión
  - Datos de seguridad

- **Edición de Perfil**:
  - Modal con formulario completo
  - Validación de campos obligatorios
  - Actualización en tiempo real
  - Estados de carga y confirmación

## Sistema de Autenticación

### 🔐 Autenticación Segura
**Sistema completo de login y registro**

- **Login**:
  - Autenticación con email y contraseña
  - Tokens JWT seguros con expiración
  - Persistencia de sesión
  - Redirección automática al dashboard

- **Registro**:
  - Formulario con validación completa
  - Campos: nombre, apellido, email, teléfono, contraseña
  - Validación de email único
  - Encriptación segura de contraseñas

- **Protección de Rutas**:
  - Middleware de autenticación
  - Redirección automática para usuarios no autenticados
  - Context global de autenticación

## Diseño y Experiencia de Usuario

### 🎨 Interfaz Moderna
**Diseño limpio y profesional con paleta de colores cálida**

- **Paleta de Colores**:
  - Naranja/terracota como color principal
  - Verde esmeralda para acentos
  - Degradados suaves y fondos orgánicos
  - Colores de estado: verde (éxito), amarillo (pendiente), rojo (error)

- **Componentes Visuales**:
  - Tarjetas con bordes redondeados y sombras sutiles
  - Iconos descriptivos para cada sección
  - Botones con efectos hover y transiciones
  - Modales con animaciones de entrada

- **Responsive Design**:
  - Adaptable a móviles, tablets y desktop
  - Grid system flexible
  - Navegación optimizada para touch

### 🚀 Experiencia de Usuario
**Interfaz intuitiva y fácil de usar**

- **Navegación**:
  - Menú lateral con estados activos
  - Breadcrumbs y indicadores de ubicación
  - Acciones rápidas en dashboard

- **Feedback Visual**:
  - Estados de carga con indicadores
  - Mensajes de éxito y error
  - Confirmaciones para acciones destructivas
  - Tooltips y ayudas contextuales

## Arquitectura Técnica

### 🏗️ Estructura Completa del Proyecto
```
Ejercicio Full Stack Veterinaria/
├── 📁 backend/                          # Servidor Node.js + Express
│   ├── 📁 node_modules/                 # Dependencias del backend
│   ├── 📁 src/                          # Código fuente del backend
│   │   ├── 📁 db/                       # Configuración de base de datos
│   │   │   ├── 📄 init.ts               # Inicialización de conexión MySQL
│   │   │   ├── 📄 migrations.sql        # Estructura completa de tablas
│   │   │   ├── 📄 seed.sql              # Datos iniciales y servicios
│   │   │   ├── 📄 setAdminPassword.ts   # Configuración de admin
│   │   │   └── 📄 update_prices.sql     # Actualización de precios
│   │   ├── 📁 routes/                   # Rutas de API RESTful
│   │   │   ├── 📄 auth.ts               # Autenticación (login/register)
│   │   │   ├── 📄 client.ts             # Endpoints del cliente
│   │   │   └── 📄 admin.ts              # Panel de administración
│   │   └── 📄 server.ts                 # Servidor principal Express
│   ├── 📄 check-table-structure.js      # Verificación de estructura BD
│   ├── 📄 test-db.js                    # Pruebas de conexión BD
│   ├── 📄 test-simple.js                # Pruebas básicas
│   ├── 📄 package.json                  # Dependencias y scripts backend
│   ├── 📄 package-lock.json             # Lock de versiones
│   └── 📄 tsconfig.json                 # Configuración TypeScript
├── 📁 frontend/                         # Aplicación React + Vite
│   ├── 📁 node_modules/                 # Dependencias del frontend
│   ├── 📁 public/                       # Archivos estáticos
│   │   ├── 📁 images/                   # Recursos gráficos
│   │   │   ├── 🖼️ gato-hero.png         # Imagen principal del hero
│   │   │   ├── 🖼️ logo-mark.svg         # Logo de la marca
│   │   │   ├── 🖼️ logo-pawtech.svg      # Logo completo
│   │   │   ├── 🖼️ line-cat.svg          # Ilustración de gato
│   │   │   ├── 🖼️ line-dog.svg          # Ilustración de perro
│   │   │   ├── 🖼️ icon-*.svg            # Iconos de navegación
│   │   │   └── 🖼️ i-*.svg               # Iconos de interfaz
│   │   └── 📄 vite.svg                  # Logo de Vite
│   ├── 📁 src/                          # Código fuente del frontend
│   │   ├── 📁 api/                      # Cliente API
│   │   │   └── 📄 client.ts             # Configuración y métodos API
│   │   ├── 📁 assets/                   # Recursos de la aplicación
│   │   │   └── 📄 react.svg             # Logo de React
│   │   ├── 📁 components/               # Componentes reutilizables
│   │   │   ├── 📄 AddPetModal.tsx       # Modal para agregar mascotas
│   │   │   ├── 📄 AppointmentBooking.tsx # Reserva de citas médicas
│   │   │   ├── 📄 Benefits.tsx          # Sección de beneficios
│   │   │   ├── 📄 CTA.tsx               # Call to action
│   │   │   ├── 📄 ExamsManagement.tsx   # Gestión de exámenes
│   │   │   ├── 📄 Hero.tsx              # Sección principal landing
│   │   │   ├── 📄 MedicalHistory.tsx    # Historial médico completo
│   │   │   ├── 📄 Navbar.tsx            # Barra de navegación
│   │   │   ├── 📄 PaymentsManagement.tsx # Gestión de pagos
│   │   │   ├── 📄 PetsManagement.tsx    # Gestión de mascotas
│   │   │   ├── 📄 ProfileManagement.tsx # Gestión de perfil usuario
│   │   │   └── 📄 Services.tsx          # Sección de servicios
│   │   ├── 📁 context/                  # Contexto global React
│   │   │   └── 📄 AuthContext.tsx       # Contexto de autenticación
│   │   ├── 📁 pages/                    # Páginas principales
│   │   │   ├── 📄 Admin.tsx             # Panel de administración
│   │   │   ├── 📄 Dashboard.tsx         # Dashboard principal cliente
│   │   │   ├── 📄 Landing.tsx           # Página de inicio
│   │   │   ├── 📄 Login.tsx             # Página de login
│   │   │   └── 📄 Register.tsx          # Página de registro
│   │   ├── 📄 App.css                   # Estilos globales
│   │   ├── 📄 App.tsx                   # Componente principal
│   │   ├── 📄 index.css                 # Estilos base y variables
│   │   ├── 📄 main.tsx                  # Punto de entrada React
│   │   └── 📄 vite-env.d.ts             # Tipos de Vite
│   ├── 📄 eslint.config.js              # Configuración ESLint
│   ├── 📄 index.html                    # HTML principal
│   ├── 📄 package.json                  # Dependencias y scripts frontend
│   ├── 📄 package-lock.json             # Lock de versiones
│   ├── 📄 postcss.config.js             # Configuración PostCSS
│   ├── 📄 README.md                     # Documentación frontend
│   ├── 📄 tsconfig.app.json             # Config TypeScript app
│   ├── 📄 tsconfig.json                 # Config TypeScript base
│   ├── 📄 tsconfig.node.json            # Config TypeScript Node
│   └── 📄 vite.config.ts                # Configuración Vite
├── 📄 Documento Guia.md                 # Documentación técnica completa
├── 📄 Documento Guia.docx               # Documento guía original
├── 📄 README.md                         # Documentación principal
└── 📄 temp_fix.sql                      # Script temporal de corrección
```

### 📋 Descripción Detallada de Archivos

#### 🔧 Backend (Node.js + Express + TypeScript)
- **`server.ts`**: Servidor principal con middleware, rutas y configuración
- **`db/init.ts`**: Configuración de conexión MySQL con pool de conexiones
- **`db/migrations.sql`**: Estructura completa de base de datos (usuarios, pacientes, servicios, citas, examenes, pagos)
- **`db/seed.sql`**: Datos iniciales, servicios veterinarios y configuración
- **`routes/auth.ts`**: Endpoints de autenticación (login, register, JWT)
- **`routes/client.ts`**: API completa para cliente (dashboard, mascotas, citas, examenes, pagos, perfil)
- **`routes/admin.ts`**: Panel de administración y gestión del sistema

#### ⚛️ Frontend (React + TypeScript + Vite)
- **`App.tsx`**: Componente raíz con routing y contexto global
- **`main.tsx`**: Punto de entrada con React 19 y StrictMode
- **`pages/Dashboard.tsx`**: Dashboard principal con navegación y renderizado condicional
- **`pages/Login.tsx`**: Autenticación con diseño glassmorphism
- **`pages/Register.tsx`**: Registro de usuarios con validación
- **`pages/Landing.tsx`**: Página de inicio con hero, servicios y CTA
- **`context/AuthContext.tsx`**: Gestión global de autenticación y estado de usuario

#### 🧩 Componentes Principales
- **`PetsManagement.tsx`**: CRUD completo de mascotas con modales
- **`AppointmentBooking.tsx`**: Sistema de reserva de citas con calendario
- **`ExamsManagement.tsx`**: Solicitud y seguimiento de exámenes médicos
- **`MedicalHistory.tsx`**: Historial médico con pestañas y filtros
- **`PaymentsManagement.tsx`**: Gestión de pagos con resumen financiero
- **`ProfileManagement.tsx`**: Edición de perfil de usuario
- **`AddPetModal.tsx`**: Modal reutilizable para agregar mascotas

#### 🎨 Recursos y Estilos
- **`public/images/`**: Iconos SVG vectoriales, logos corporativos, ilustraciones y assets gráficos optimizados
- **`index.css`**: Variables CSS custom properties, utilidades atómicas y estilos base del sistema de diseño
- **`App.css`**: Estilos específicos de componentes con metodología BEM y CSS modules
- **Configuraciones**: ESLint con reglas estrictas, PostCSS con autoprefixer, TypeScript con strict mode, Vite con optimizaciones de build

#### 📊 Base de Datos (MySQL)
- **`usuarios`**: Entidad principal con roles, autenticación y metadatos de sesión
- **`pacientes`**: Registro de mascotas con información médica y propietario
- **`servicios`**: Catálogo de servicios veterinarios con precios dinámicos y duración
- **`citas`**: Agendamiento con estados de workflow y auditoría temporal
- **`examenes`**: Solicitudes médicas con resultados estructurados y observaciones
- **`pagos`**: Transacciones financieras con métodos de pago y estados de procesamiento

### 🗄️ Arquitectura de Base de Datos
**Diseño relacional normalizado con optimizaciones de rendimiento**

- **usuarios**: Entidad central con roles RBAC, autenticación multi-factor y auditoría de sesiones
- **pacientes**: Registro médico completo con historial clínico y relaciones de propiedad
- **servicios**: Catálogo dinámico con precios escalables, duración estimada y categorización
- **citas**: Sistema de agendamiento con estados de workflow, conflictos de horario y notificaciones
- **examenes**: Laboratorio médico con resultados estructurados, archivos adjuntos y seguimiento
- **pagos**: Procesamiento financiero con múltiples gateways, reconciliación y reportes fiscales

### 🔒 Framework de Seguridad
**Implementación de seguridad en capas con monitoreo avanzado**

- **Autenticación JWT**: Tokens con refresh automático, blacklisting y rotación de claves
- **Validación de Datos**: Sanitización XSS, inyección SQL y validación de esquemas Zod
- **Protección de Rutas**: Middleware de autorización granular con roles y permisos
- **CORS Configurado**: Políticas de origen específicas con whitelist de dominios
- **Encriptación**: Hash bcrypt con salt personalizado y cifrado AES-256 para datos sensibles
- **Rate Limiting**: Protección contra ataques DDoS y brute force con Redis
- **Auditoría**: Logging completo de acciones críticas con trazabilidad de usuario

## Instalación y Configuración

### Requisitos del Sistema
- **Node.js** 18+ (recomendado 20+) con soporte para ES modules
- **MySQL** 8.0+ con motor InnoDB y soporte para JSON
- **npm** 9+ o **yarn** 3+ para gestión de paquetes con workspaces
- **Git** 2.30+ para control de versiones
- **Redis** 6+ (opcional) para cache y rate limiting

### Configuración del Backend
```bash
cd backend
npm install --production=false
npm run build
npm start
```
Servidor disponible en `http://localhost:3000` con hot reload en desarrollo

### Configuración del Frontend
```bash
cd frontend
npm install --production=false
npm run dev
```
Aplicación disponible en `http://localhost:5173` con HMR y source maps

### Configuración de Base de Datos
1. **Crear base de datos**: `CREATE DATABASE vetcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
2. **Ejecutar migraciones**: `mysql -u root -p vetcare < backend/src/db/migrations.sql`
3. **Cargar datos iniciales**: `mysql -u root -p vetcare < backend/src/db/seed.sql`
4. **Configurar variables de entorno**: Crear `.env` con credenciales y configuraciones
5. **Optimizar índices**: Ejecutar `backend/src/db/update_prices.sql` para índices de rendimiento

## Scripts de Desarrollo

### Frontend
```bash
npm run dev          # Servidor de desarrollo con hot reload
npm run build        # Build optimizado para producción
npm run preview      # Previsualización del build
npm run lint         # Análisis de código
```

### Backend
```bash
npm start            # Servidor de producción
npm run dev          # Servidor de desarrollo con hot reload
npm run build        # Compilación TypeScript
```

## Estado del Proyecto

### ✅ Funcionalidades Completadas
- **Sistema de autenticación completo** con JWT
- **Dashboard del cliente** con todas las secciones
- **Gestión integral de mascotas** (CRUD completo)
- **Sistema de citas** con agendamiento y seguimiento
- **Exámenes médicos** con solicitud y estados
- **Historial médico** con filtros y exportación
- **Gestión de pagos** con resumen financiero
- **Perfil de usuario** con edición completa
- **Interfaz responsiva** y moderna
- **API RESTful** con validación completa
- **Base de datos** estructurada y optimizada

### 🚀 Listo para Producción
El sistema está completamente funcional y listo para ser desplegado en un entorno de producción. Todas las funcionalidades principales han sido implementadas, probadas y optimizadas.

### 🔮 Posibles Mejoras Futuras
- **Panel de administración** para veterinarios
- **Sistema de notificaciones** por email/SMS
- **Integración con pasarelas de pago** reales
- **App móvil** nativa
- **Sistema de reportes** avanzados
- **Integración con laboratorios** externos

## Conclusión

VetCare representa un sistema completo y moderno de gestión veterinaria que combina una interfaz de usuario intuitiva con un backend robusto y seguro. La aplicación está diseñada para facilitar la gestión integral del cuidado de mascotas, desde el registro inicial hasta el seguimiento de tratamientos y pagos.

El sistema demuestra las mejores prácticas en desarrollo full-stack, incluyendo arquitectura modular, seguridad robusta, y una experiencia de usuario excepcional. Está listo para ser utilizado en un entorno de producción real.
