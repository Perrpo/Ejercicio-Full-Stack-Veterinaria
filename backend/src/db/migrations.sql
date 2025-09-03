CREATE DATABASE IF NOT EXISTS vetcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vetcare;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  rol ENUM('cliente','veterinario','admin') NOT NULL DEFAULT 'cliente',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pacientes (
  id_paciente INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raza VARCHAR(100) NOT NULL,
  edad INT NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS servicios (
  id_servicio INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS citas (
  id_cita INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_paciente INT NOT NULL,
  id_servicio INT NOT NULL,
  fecha_cita DATETIME NOT NULL,
  estado ENUM('pendiente','confirmada','completada','cancelada') NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_paciente) REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
  FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pagos (
  id_pago INT PRIMARY KEY AUTO_INCREMENT,
  id_cita INT NOT NULL,
  metodo_pago ENUM('tarjeta_credito','efectivo','transferencia') NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente','pagado','fallido') NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (id_cita) REFERENCES citas(id_cita) ON DELETE CASCADE
);


