-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vetcare
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id_cita` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_paciente` int NOT NULL,
  `id_servicio` int NOT NULL,
  `fecha_cita` datetime NOT NULL,
  `estado` enum('pendiente','confirmada','completada','cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id_cita`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_servicio` (`id_servicio`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE,
  CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (1,2,1,1,'2024-09-15 20:30:00','confirmada'),(2,4,3,2,'2024-09-15 14:00:00','pendiente'),(3,2,2,6,'2024-09-16 09:00:00','completada'),(4,4,4,1,'2024-09-16 11:30:00','confirmada'),(5,2,1,7,'2024-09-14 20:00:00','cancelada'),(6,6,6,8,'2025-09-11 01:30:00','cancelada'),(7,17,7,4,'2025-09-18 15:00:00','completada'),(8,17,7,1,'2025-09-13 00:00:00','cancelada');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examenes`
--

DROP TABLE IF EXISTS `examenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examenes` (
  `id_examen` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `tipo_examen` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_examen` datetime NOT NULL,
  `resultado` text COLLATE utf8mb4_unicode_ci,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('pendiente','en_proceso','completado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id_examen`),
  KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `examenes_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examenes`
--

LOCK TABLES `examenes` WRITE;
/*!40000 ALTER TABLE `examenes` DISABLE KEYS */;
INSERT INTO `examenes` VALUES (1,7,'Análisis de Sangre','2025-09-03 22:44:09',NULL,'Lo pidio el veterinario','pendiente');
/*!40000 ALTER TABLE `examenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `id_paciente` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `especie` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `raza` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `edad` int NOT NULL,
  `peso` decimal(5,2) NOT NULL,
  PRIMARY KEY (`id_paciente`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,2,'Luna','Perro','Golden Retriever',3,28.50),(2,2,'Miau','Gato','Persa',2,4.20),(3,4,'Max','Perro','Pastor Alemán',5,35.00),(4,4,'Coco','Conejo','Holandés',1,1.80),(5,2,'Pipo','Ave','Canario',2,0.25),(6,6,'Oreo','Perro','Chandoso',3,60.02),(7,17,'Pumba','Gato','Otro',1,5.00),(8,5,'Max','Gato','Criollo',2,300.00),(9,18,'Tomas','Gato','Persa',1,5.00);
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_cita` int NOT NULL,
  `metodo_pago` enum('tarjeta_credito','efectivo','transferencia') COLLATE utf8mb4_unicode_ci NOT NULL,
  `monto` int NOT NULL,
  `fecha_pago` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','pagado','fallido') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`id_pago`),
  KEY `id_cita` (`id_cita`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id_cita`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,1,'tarjeta_credito',180000,'2025-09-03 02:27:55','pagado'),(2,2,'efectivo',120000,'2025-09-03 02:27:55','pagado'),(3,3,'transferencia',60000,'2025-09-03 02:27:55','pendiente'),(4,4,'tarjeta_credito',120000,'2025-09-03 02:27:55','pagado'),(5,5,'efectivo',95000,'2025-09-03 02:27:55','pagado'),(6,6,'efectivo',60000,'2025-09-04 00:08:06','pagado'),(7,7,'tarjeta_credito',200000,'2025-09-04 08:53:39','pagado'),(8,7,'efectivo',80000,'2025-09-04 22:53:58','pagado');
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `id_servicio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` int NOT NULL,
  PRIMARY KEY (`id_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Consulta General','Revisión médica general del paciente',180000),(2,'Vacunación','Administración de vacunas',120000),(3,'Cirugía Menor','Procedimientos quirúrgicos menores',300000),(4,'Análisis de Sangre','Extracción y análisis de sangre',200000),(5,'Radiografía','Radiografía digital para diagnóstico',250000),(6,'Limpieza Dental','Limpieza profesional de dientes',220000),(7,'Urgencias','Atención médica urgente',350000),(8,'Peluquería Canina','Servicio de peluquería y estética',160000);
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('cliente','veterinario','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin','Sistema','admin@vetcare.com','$2b$10$FBHsPDmQ0KQLtjKf68NmUOszahnQHrMjWzIPhvGWZgrJgyKG9MxHe','+57 300 000 0000','Oficina Central','admin','2025-09-03 02:27:55'),(2,'María','González','maria.gonzalez@email.com','$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK','+57 300 123 456','Calle Mayor 123, Bogotá','cliente','2025-09-03 02:27:55'),(3,'Carlos','Rodríguez','carlos.rodriguez@veterinaria.com','$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK','+57 300 789 018','Avenida Veterinaria 45, Bogotá','cliente','2025-09-03 02:27:55'),(4,'Ana','López','ana.lopez@email.com','$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK','+57 300 345 678','Plaza Central 8, Bogotá','cliente','2025-09-03 02:27:55'),(5,'Elena','Martín','elena.martin@veterinaria.com','$2a$10$B7o8Jm7M2i7wO8r9qS1pUe6O9wT2yXj3d2u1aQpWq6h8l9d0cN8uK','+57 300 555 444','Consulta 2, Bogotá','veterinario','2025-09-03 02:27:55'),(6,'Nicole','Yuqui','nicole@gmail.com','','3123821739','Mi casa','cliente','2025-09-03 17:55:18'),(17,'Andres','Felipe','andresfelipe@gmail.com','$2b$10$3T/gKkyKteSAkWXA0EP8neOytpPqdx06Ohbkzy95MaCb.1Ca7sydK','3503374876','Al costado de mi vecino','cliente','2025-09-03 20:22:37'),(18,'Jose','Velez','josevelez@gmail.com','$2b$10$jw6tq4ZDD4PNTR/V083skOiXDFIq9KPtNgj2VpffaeWi4RcvfUlEC','3059305930','Al costado de mi vecino','cliente','2025-09-04 17:54:43'),(19,'Andres','Nunez','andres@gmail.com','$2b$10$WfASd1APRDfk85oO8kA0hOEMycnbIZvkB7jRUe5JEcFkelflzQK/S','389271983271','meedellin','cliente','2026-02-14 19:39:56');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-15 15:17:11
