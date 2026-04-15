/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bookings
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `checkInDate` date NOT NULL,
  `checkOutDate` date NOT NULL,
  `guests` int(11) NOT NULL DEFAULT 1,
  `totalPrice` decimal(10, 2) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `paymentStatus` varchar(20) NOT NULL DEFAULT 'pending',
  `confirmationCode` varchar(20) NOT NULL,
  `dvh` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `confirmationCode` (`confirmationCode`),
  KEY `userId` (`userId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: integrity
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `integrity` (
  `tableName` varchar(50) NOT NULL,
  `dvv` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tableName`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: logs
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `criticity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: permissions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `dvh` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 69 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: role_permissions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `role_permissions` (
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  `dvh` int(11) DEFAULT NULL,
  PRIMARY KEY (`roleId`, `permissionId`),
  UNIQUE KEY `role_permissions_permissionId_roleId_unique` (`roleId`, `permissionId`),
  KEY `permissionId` (`permissionId`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: roles
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `dvh` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: rooms
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `capacity` int(11) NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `size` varchar(20) DEFAULT NULL,
  `beds` varchar(100) DEFAULT NULL,
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `images` varchar(255) DEFAULT NULL,
  `roomStateId` int(11) NOT NULL DEFAULT 1,
  `dvh` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 25 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: sequelizemeta
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_unicode_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: user_permissions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user_permissions` (
  `userId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  `dvh` int(11) DEFAULT NULL,
  PRIMARY KEY (`userId`, `permissionId`),
  UNIQUE KEY `user_permissions_permissionId_userId_unique` (`userId`, `permissionId`),
  KEY `permissionId` (`permissionId`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: user_roles
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user_roles` (
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  `dvh` int(11) DEFAULT NULL,
  PRIMARY KEY (`userId`, `roleId`),
  UNIQUE KEY `user_roles_roleId_userId_unique` (`userId`, `roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `dni` varchar(15) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `userStateId` int(11) NOT NULL DEFAULT 1,
  `failedAttempts` int(11) NOT NULL DEFAULT 0,
  `dvh` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bookings
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: integrity
# ------------------------------------------------------------

INSERT INTO
  `integrity` (`tableName`, `dvv`)
VALUES
  ('bookings', 0),('permissions', 0),('roles', 0),('role_permissions', 0),('rooms', 0),('users', 5),('user_permissions', 0),('user_roles', 7);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: logs
# ------------------------------------------------------------

INSERT INTO
  `logs` (
    `id`,
    `userId`,
    `action`,
    `details`,
    `criticity`,
    `createdAt`
  )
VALUES
  (
    2,
    1,
    'Registro exitoso',
    'Cuenta creada y está pendiente de activación para usuario ID: 1 - Email: bacher.sofiaet36@gmail.com',
    1,
    '2025-12-02 07:50:13'
  ),(
    3,
    1,
    'Correo de activación enviado',
    'Se ha enviado un correo con el enlace de activación a bacher.sofiaet36@gmail.com',
    2,
    '2025-12-02 07:50:17'
  ),(
    4,
    1,
    'Registro exitoso',
    'Usuario activado: ID 1 - Email bacher.sofiaet36@gmail.com',
    2,
    '2025-12-02 07:53:44'
  ),(
    5,
    1,
    'Inicio de sesión exitoso',
    'Inicio de sesión exitoso para usuario ID 1 - Email: bacher.sofiaet36@gmail.com',
    1,
    '2025-12-02 07:54:08'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: permissions
# ------------------------------------------------------------

INSERT INTO
  `permissions` (
    `id`,
    `name`,
    `description`,
    `module`,
    `action`,
    `dvh`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'auth.login',
    'Permite iniciar sesión',
    'auth',
    'login',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    2,
    'auth.register',
    'Permite registrar un nuevo usuario',
    'auth',
    'register',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    3,
    'auth.activateAccount',
    'Permite activar una cuenta',
    'auth',
    'activate',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    4,
    'auth.resendActivation',
    'Permite reenviar el correo de activación',
    'auth',
    'resend',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    5,
    'auth.recoverPassword',
    'Permite iniciar la recuperación de contraseña',
    'auth',
    'recover',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    6,
    'auth.resetPassword',
    'Permite restablecer la contraseña',
    'auth',
    'reset',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    7,
    'auth.validateResetToken',
    'Permite validar el token de restablecimiento',
    'auth',
    'validateToken',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    8,
    'auth.logout',
    'Permite cerrar sesión',
    'auth',
    'logout',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    9,
    'booking.rooms.search',
    'Permite buscar habitaciones disponibles según fechas y huéspedes',
    'booking',
    'rooms.search',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    10,
    'booking.rooms.view',
    'Permite obtener información detallada de una habitación por ID',
    'booking',
    'rooms.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    11,
    'booking.list.my',
    'Permite obtener todas las reservas del usuario autenticado',
    'booking',
    'list.my',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    12,
    'booking.view',
    'Permite obtener detalles completos de una reserva específica',
    'booking',
    'view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    13,
    'booking.create',
    'Permite crear una nueva reserva validando disponibilidad, fechas y capacidad',
    'booking',
    'create',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    14,
    'booking.receipt.download',
    'Permite descargar comprobante de pago (solo reservas pagadas)',
    'booking',
    'receipt.download',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    15,
    'booking.cancel',
    'Permite cancelar una reserva del usuario',
    'booking',
    'cancel',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    16,
    'booking.list.all',
    'Permite ver todas las reservas del sistema (solo administrador)',
    'booking',
    'list.all',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    17,
    'payment.process',
    'Permite procesar el pago de una reserva',
    'payment',
    'process',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    18,
    'payment.info',
    'Permite obtener información del pago de una reserva',
    'payment',
    'info',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    19,
    'room.list',
    'Permite obtener todas las habitaciones disponibles',
    'room',
    'list',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    20,
    'room.view',
    'Permite obtener detalles de una habitación',
    'room',
    'view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    21,
    'room.status.update',
    'Permite actualizar el estado de limpieza de una habitación',
    'room',
    'status.update',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    22,
    'user.profile.view',
    'Permite obtener los datos del usuario autenticado',
    'user',
    'profile.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    23,
    'user.profile.update',
    'Permite modificar nombre, apellido, teléfono, DNI, fecha de nacimiento, foto',
    'user',
    'profile.update',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    24,
    'user.password.change',
    'Permite modificar la contraseña',
    'user',
    'password.change',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    25,
    'user.role.switch',
    'Permite seleccionar el rol activo',
    'user',
    'role.switch',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    26,
    'user.avatar.upload',
    'Permite cambiar la foto del usuario',
    'user',
    'avatar.upload',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    27,
    'admin.users.manage',
    'Permite gestionar usuarios del sistema (listar, modificar estado, eliminar)',
    'admin',
    'users.manage',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    28,
    'admin.users.view',
    'Permite ver la lista de usuarios del sistema',
    'admin',
    'users.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    29,
    'admin.users.edit',
    'Permite modificar el estado de los usuarios (bloquear, desbloquear)',
    'admin',
    'users.edit',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    30,
    'admin.users.delete',
    'Permite eliminar usuarios del sistema',
    'admin',
    'users.delete',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    31,
    'admin.reports.view',
    'Permite ver y generar reportes del sistema',
    'admin',
    'reports.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    32,
    'admin.rooms',
    'Permite gestionar habitaciones del sistema (crear, modificar, eliminar, listar)',
    'admin',
    'rooms.manage',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    33,
    'admin.rooms.create',
    'Permite crear nuevas habitaciones',
    'admin',
    'rooms.create',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    34,
    'admin.rooms.edit',
    'Permite modificar información de habitaciones',
    'admin',
    'rooms.edit',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    35,
    'admin.rooms.delete',
    'Permite eliminar habitaciones',
    'admin',
    'rooms.delete',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    36,
    'admin.rooms.list',
    'Permite ver la lista de habitaciones para administración',
    'admin',
    'rooms.list',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    37,
    'admin.logs',
    'Permite ver logs de actividades del sistema',
    'admin',
    'logs.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    38,
    'admin.roles.view',
    'Permite ver la lista de roles del sistema',
    'admin',
    'roles.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    39,
    'admin.roles.create',
    'Permite crear nuevos roles personalizados',
    'admin',
    'roles.create',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    40,
    'admin.roles.edit',
    'Permite modificar roles personalizados y asignar roles a usuarios',
    'admin',
    'roles.edit',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    41,
    'admin.roles.delete',
    'Permite eliminar roles personalizados',
    'admin',
    'roles.delete',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    42,
    'admin.rooms.view',
    'Permite ver la lista de habitaciones para administración',
    'admin',
    'rooms.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    43,
    'admin.bitacora.view',
    'Permite ver la bitácora de actividades del sistema',
    'admin',
    'bitacora.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    44,
    'permissions.manage',
    'Permite gestionar completamente los permisos del sistema (crear, editar, eliminar, asignar, quitar)',
    'admin',
    'permissions.manage',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    45,
    'permissions.view',
    'Permite ver la lista de permisos del sistema',
    'admin',
    'permissions.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    46,
    'permissions.create',
    'Permite crear nuevos permisos en el sistema',
    'admin',
    'permissions.create',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    47,
    'permissions.edit',
    'Permite editar permisos existentes',
    'admin',
    'permissions.edit',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    48,
    'permissions.delete',
    'Permite eliminar permisos del sistema',
    'admin',
    'permissions.delete',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    49,
    'permissions.assign',
    'Permite asignar permisos a roles y usuarios',
    'admin',
    'permissions.assign',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    50,
    'permissions.remove',
    'Permite quitar permisos de roles y usuarios',
    'admin',
    'permissions.remove',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    51,
    'admin.bitacora.download',
    'Permite descargar los registros de bitácora en formato CSV',
    'admin',
    'bitacora.download',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    52,
    'admin.backup.manual',
    'Permite realizar backups manuales de la base de datos',
    'admin',
    'backup.manual',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    53,
    'admin.backup.view',
    'Permite ver la lista de backups realizados',
    'admin',
    'backup.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    54,
    'admin.backup.download',
    'Permite descargar archivos de backup',
    'admin',
    'backup.download',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    55,
    'cleaning.rooms.view',
    'Permite ver las habitaciones en limpieza',
    'cleaning',
    'view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    56,
    'cleaning.rooms.update',
    'Permite marcar habitaciones como disponibles',
    'cleaning',
    'update',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    57,
    'receptionist.dashboard.view',
    'Ver panel principal del recepcionista',
    'receptionist',
    'dashboard.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    58,
    'receptionist.checkin.view',
    'Ver lista de check-ins pendientes',
    'receptionist',
    'checkin.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    59,
    'receptionist.checkin.process',
    'Procesar check-in de huéspedes',
    'receptionist',
    'checkin.process',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    60,
    'receptionist.checkin.details',
    'Ver detalles de reserva para check-in',
    'receptionist',
    'checkin.details',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    61,
    'receptionist.checkout.view',
    'Ver lista de check-outs pendientes',
    'receptionist',
    'checkout.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    62,
    'receptionist.checkout.process',
    'Procesar check-out de huéspedes',
    'receptionist',
    'checkout.process',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    63,
    'receptionist.checkout.details',
    'Ver detalles de reserva para check-out',
    'receptionist',
    'checkout.details',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    64,
    'receptionist.checkout.payment',
    'Gestionar pagos de check-out',
    'receptionist',
    'checkout.payment',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    65,
    'receptionist.rooms.view',
    'Ver estado de habitaciones',
    'receptionist',
    'rooms.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    66,
    'receptionist.rooms.updateStatus',
    'Actualizar estado de habitaciones',
    'receptionist',
    'rooms.updateStatus',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    67,
    'receptionist.stats.view',
    'Ver estadísticas del día',
    'receptionist',
    'stats.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  ),(
    68,
    'receptionist.summary.view',
    'Ver resumen de actividades',
    'receptionist',
    'summary.view',
    NULL,
    '2025-12-02 07:45:16',
    '2025-12-02 07:45:16'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: role_permissions
# ------------------------------------------------------------

INSERT INTO
  `role_permissions` (`roleId`, `permissionId`, `dvh`)
VALUES
  (1, 1, NULL),(1, 2, NULL),(1, 3, NULL),(1, 4, NULL),(1, 5, NULL),(1, 6, NULL),(1, 7, NULL),(1, 8, NULL),(1, 9, NULL),(1, 10, NULL),(1, 11, NULL),(1, 12, NULL),(1, 13, NULL),(1, 14, NULL),(1, 15, NULL),(1, 17, NULL),(1, 18, NULL),(2, 1, NULL),(2, 8, NULL),(2, 9, NULL),(2, 10, NULL),(2, 16, NULL),(3, 1, NULL),(3, 8, NULL),(3, 9, NULL),(3, 10, NULL),(3, 12, NULL),(4, 1, NULL),(4, 8, NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: roles
# ------------------------------------------------------------

INSERT INTO
  `roles` (
    `id`,
    `name`,
    `description`,
    `dvh`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'guest',
    'Usuario básico con acciones sobre reservas y visualización ',
    NULL,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    2,
    'admin',
    'Administrador del sistema con permisos de gestiones',
    NULL,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    3,
    'recepcionist',
    'Recepcionista encargado del check-in y check-out',
    NULL,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    4,
    'cleaning',
    'Personal de limpieza responsable del mantenimiento y estado de habitaciones',
    NULL,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: rooms
# ------------------------------------------------------------

INSERT INTO
  `rooms` (
    `id`,
    `name`,
    `description`,
    `type`,
    `capacity`,
    `price`,
    `size`,
    `beds`,
    `amenities`,
    `images`,
    `roomStateId`,
    `dvh`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'Estándar 101',
    'Habitación económica perfecta para viajeros individuales o parejas',
    'Estandar',
    2,
    89.00,
    '22m²',
    '1 cama doble',
    '[\"wifi\",\"tv\",\"ac\"]',
    '/uploads/rooms/estandar/101.jpg',
    1,
    0,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    2,
    'Estándar 102',
    'Cómoda habitación con vistas al jardín',
    'Estandar',
    2,
    89.00,
    '22m²',
    '1 cama doble',
    '[\"wifi\",\"tv\",\"ac\"]',
    '/uploads/rooms/estandar/102.jpg',
    1,
    -1,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    3,
    'Estándar 103',
    'Ideal para estancias cortas',
    'Estandar',
    1,
    69.00,
    '18m²',
    '1 cama individual',
    '[\"wifi\",\"tv\",\"ac\"]',
    '/uploads/rooms/estandar/103.jpg',
    1,
    3,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    4,
    'Estándar 104',
    'Habitación con acceso fácil al hall principal',
    'Estandar',
    2,
    89.00,
    '22m²',
    '1 cama doble',
    '[\"wifi\",\"tv\",\"ac\"]',
    '/uploads/rooms/estandar/104.jpg',
    1,
    -3,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    5,
    'Estándar 105',
    'Espaciosa habitación para tres personas',
    'Estandar',
    3,
    99.00,
    '25m²',
    '1 cama doble + 1 individual',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\"]',
    '/uploads/rooms/estandar/105.jpg',
    1,
    5,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    6,
    'Estándar 106',
    'Económica y funcional',
    'Estandar',
    2,
    89.00,
    '22m²',
    '1 cama doble',
    '[\"wifi\",\"tv\",\"ac\"]',
    '/uploads/rooms/estandar/106.jpg',
    1,
    6,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    7,
    'Deluxe 201 - Vista Parcial al Mar',
    'Confort premium con vistas parciales al océano',
    'Deluxe',
    2,
    129.00,
    '32m²',
    '1 cama queen',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"premium-furniture\",\"coffee-machine\"]',
    '/uploads/rooms/deluxe/201.jpg',
    1,
    6,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    8,
    'Deluxe 202 - Vista Jardín',
    'Elegante habitación con vistas a los jardines tropicales',
    'Deluxe',
    2,
    129.00,
    '32m²',
    '1 cama queen',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"premium-furniture\",\"coffee-machine\"]',
    '/uploads/rooms/deluxe/202.jpg',
    1,
    3,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    9,
    'Deluxe 203',
    'Lujo y comodidad en el corazón del hotel',
    'Deluxe',
    3,
    149.00,
    '35m²',
    '1 cama king + sofá cama',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"premium-furniture\",\"coffee-machine\",\"balcony\"]',
    '/uploads/rooms/deluxe/203.jpg',
    1,
    -1,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    10,
    'Deluxe 204 - Esquina',
    'Habitación de esquina con más espacio y luz natural',
    'Deluxe',
    2,
    139.00,
    '34m²',
    '1 cama queen',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"premium-furniture\",\"coffee-machine\"]',
    '/uploads/rooms/deluxe/204.jpg',
    1,
    5,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    11,
    'Deluxe 205 - Familiar',
    'Perfecta para familias pequeñas',
    'Deluxe',
    4,
    179.00,
    '40m²',
    '2 camas queen',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"premium-furniture\",\"coffee-machine\",\"extra-beds\"]',
    '/uploads/rooms/deluxe/205.jpg',
    1,
    2,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    12,
    'Deluxe 206 - Romántica',
    'Diseñada para parejas con detalles románticos',
    'Deluxe',
    2,
    159.00,
    '33m²',
    '1 cama king',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"premium-furniture\",\"coffee-machine\",\"jacuzzi\"]',
    '/uploads/rooms/deluxe/206.jpg',
    1,
    1,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    13,
    'Executive Suite 301',
    'Espacio de trabajo integrado con vistas panorámicas',
    'Ejecutiva',
    3,
    189.00,
    '45m²',
    '1 cama king + sofá cama',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"work-desk\",\"balcony\",\"coffee-machine\"]',
    '/uploads/rooms/ejecutiva/301.jpg',
    1,
    4,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    14,
    'Executive Suite 302 - Business',
    'Área de trabajo completa con impresora',
    'Ejecutiva',
    2,
    199.00,
    '48m²',
    '1 cama king',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"work-desk\",\"printer\",\"balcony\",\"meeting-area\"]',
    '/uploads/rooms/ejecutiva/302.jpg',
    1,
    -1,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    15,
    'Executive Suite 303',
    'Lujo ejecutivo con sala de reuniones privada',
    'Ejecutiva',
    4,
    229.00,
    '55m²',
    '1 cama king + 2 individuales',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"work-desk\",\"meeting-area\",\"balcony\",\"coffee-machine\"]',
    '/uploads/rooms/ejecutiva/303.jpg',
    1,
    6,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    16,
    'Executive Suite 304 - Alta Tecnología',
    'Equipada con última tecnología para negocios',
    'Ejecutiva',
    3,
    219.00,
    '50m²',
    '1 cama king + sofá cama',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"work-desk\",\"smart-board\",\"video-conference\",\"balcony\"]',
    '/uploads/rooms/ejecutiva/304.jpg',
    1,
    -3,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    17,
    'Executive Suite 305',
    'Suite premium con acceso a lounge ejecutivo',
    'Ejecutiva',
    2,
    239.00,
    '52m²',
    '1 cama king',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"work-desk\",\"lounge-access\",\"balcony\",\"coffee-machine\"]',
    '/uploads/rooms/ejecutiva/305.jpg',
    1,
    0,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    18,
    'Family Room 401',
    'Diseñada para familias con niños pequeños',
    'Familiar',
    4,
    169.00,
    '50m²',
    '2 camas dobles',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"extra-beds\",\"kid-friendly\",\"game-console\"]',
    '/uploads/rooms/familiar/401.jpg',
    1,
    3,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    19,
    'Family Room 402 - Grande',
    'Amplio espacio para familias numerosas',
    'Familiar',
    5,
    199.00,
    '60m²',
    '1 king + 2 dobles',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"extra-beds\",\"kid-friendly\",\"game-console\",\"dining-area\"]',
    '/uploads/rooms/familiar/402.jpg',
    1,
    5,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    20,
    'Family Room 403 - Con Balcón',
    'Balcon amplio con zona de juegos infantil',
    'Familiar',
    6,
    229.00,
    '65m²',
    '2 king + 2 individuales',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"extra-beds\",\"kid-friendly\",\"game-console\",\"balcony\",\"play-area\"]',
    '/uploads/rooms/familiar/403.jpg',
    1,
    1,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    21,
    'Family Room 404 - Suite Familiar',
    'Dos dormitorios independientes para mayor privacidad',
    'Familiar',
    4,
    249.00,
    '70m²',
    '2 dormitorios (1 king + 2 dobles)',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"extra-beds\",\"kid-friendly\",\"game-console\",\"separate-living\",\"kitchenette\"]',
    '/uploads/rooms/familiar/404.jpg',
    1,
    2,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    22,
    'Presidential Suite 501 - Panorámica',
    'La máxima experiencia de lujo con vistas de 360°',
    'Presidencial',
    4,
    399.00,
    '85m²',
    '1 cama king + 2 individuales',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"jacuzzi\",\"balcony\",\"living-room\",\"dining-area\",\"butler-service\"]',
    '/uploads/rooms/presidencial/501.jpg',
    1,
    3,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    23,
    'Presidential Suite 502 - Penthouse',
    'Penthouse de dos niveles con terraza privada',
    'Presidencial',
    6,
    599.00,
    '120m²',
    '2 king + 2 queen',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"jacuzzi\",\"balcony\",\"living-room\",\"dining-area\",\"butler-service\",\"private-terrace\",\"kitchenette\"]',
    '/uploads/rooms/presidencial/502.jpg',
    1,
    -3,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  ),(
    24,
    'Presidential Suite 503 - Imperial',
    'La joya de la corona del hotel',
    'Presidencial',
    6,
    799.00,
    '150m²',
    '2 king + 4 individuales',
    '[\"wifi\",\"tv\",\"ac\",\"minibar\",\"jacuzzi\",\"balcony\",\"living-room\",\"dining-area\",\"butler-service\",\"private-terrace\",\"kitchenette\",\"private-elevator\",\"spa-bathroom\"]',
    '/uploads/rooms/presidencial/503.jpg',
    1,
    4,
    '2025-12-02 07:45:15',
    '2025-12-02 07:45:15'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: sequelizemeta
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user_permissions
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user_roles
# ------------------------------------------------------------

INSERT INTO
  `user_roles` (`userId`, `roleId`, `dvh`)
VALUES
  (1, 1, 2),(1, 2, NULL);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `id`,
    `name`,
    `lastName`,
    `email`,
    `password`,
    `phone`,
    `dni`,
    `birthdate`,
    `photo`,
    `userStateId`,
    `failedAttempts`,
    `dvh`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'Soffia',
    'Bacher',
    'bacher.sofiaet36@gmail.com',
    '$2b$10$QRI8Y4Z/hK78h7ebLpIhUubuYSes1XtBkksLdxWiv5h8h19KvDrTa',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    0,
    3,
    '2025-12-02 07:50:12',
    '2025-12-02 07:53:44'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
