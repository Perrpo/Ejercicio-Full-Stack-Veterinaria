-- Crear base de datos
CREATE DATABASE IF NOT EXISTS vetcare;
USE vetcare;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  rol ENUM('admin', 'veterinario', 'cliente') NOT NULL DEFAULT 'cliente',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de servicios
CREATE TABLE servicios (
  id_servicio INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio INT NOT NULL,
  duracion INT DEFAULT 60 COMMENT 'duración en minutos'
);

-- Tabla de pacientes
CREATE TABLE pacientes (
  id_paciente INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raza VARCHAR(100),
  edad INT,
  peso DECIMAL(5,2),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla de citas
CREATE TABLE citas (
  id_cita INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_paciente INT NOT NULL,
  id_servicio INT NOT NULL,
  fecha_cita DATETIME NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
  FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE
);

-- Tabla de pagos
CREATE TABLE pagos (
  id_pago INT AUTO_INCREMENT PRIMARY KEY,
  id_cita INT NOT NULL,
  metodo_pago ENUM('efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia') NOT NULL,
  monto INT NOT NULL,
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente', 'pagado', 'fallido') DEFAULT 'pendiente',
  FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
);

-- Tabla de exámenes
CREATE TABLE examenes (
  id_examen INT AUTO_INCREMENT PRIMARY KEY,
  id_paciente INT NOT NULL,
  tipo_examen VARCHAR(150) NOT NULL,
  fecha_examen DATETIME NOT NULL,
  resultado TEXT,
  observaciones TEXT,
  estado ENUM('pendiente', 'en_proceso', 'completado') DEFAULT 'pendiente',
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE
);


