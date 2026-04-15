// Niveles de criticidad para eventos de bitácora
const CRITICITY = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
}

// Acciones registrables en la bitácora
const LOG_ACTIONS = {
  LOGIN_SUCCESS: { message: 'Inicio de sesión exitoso', criticity: CRITICITY.LOW },
  LOGIN_FAIL: { message: 'Inicio de sesión fallido', criticity: CRITICITY.MEDIUM },
 
  USER_BLOCKED: { message: 'Usuario bloqueado', criticity: CRITICITY.HIGH },
  USER_UPDATE: { message: 'Actualización de datos de usuario', criticity: CRITICITY.MEDIUM},
  UPDATE_ERROR: { message: 'Error al actualizar datos de usuario', criticity: CRITICITY.HIGH},

  REGISTER_SUCCESS: { message: 'Registro exitoso', criticity: CRITICITY.LOW },
  ACCOUNT_ACTIVATION: { message: 'Correo de activación enviado', criticity: CRITICITY.MEDIUM},
 
  MAIL_ERROR: { message: 'Error en el envío de correo', criticity: CRITICITY.HIGH },
  ACCESS_DENIED: { message: 'Acceso denegado', criticity: CRITICITY.MEDIUM}, 
  ROLE_SWITCH: { message: 'Cambio de rol activo', criticity: CRITICITY.MEDIUM},
  LOGOUT: { message: 'Cierre de sesión', criticity: CRITICITY.LOW},

  PASSWORD_RECOVERY: { message: 'Recuperación de contraseña', criticity: CRITICITY.MEDIUM},
  PASSWORD_CHANGE: { message: 'Cambio de contraseña', criticity: CRITICITY.MEDIUM },
 
  BOOKING_CREATED: { message: 'Reserva creada', criticity: CRITICITY.MEDIUM },
  BOOKING_FAILED: { message: 'Error al crear reserva', criticity: CRITICITY.MEDIUM },
  BOOKING_CANCELLED: { message: 'Reserva cancelada', criticity: CRITICITY.MEDIUM },
  BOOKING_CANCELLATION_FAILED: { message: 'Error al cancelar reserva', criticity: CRITICITY.MEDIUM },
  BOOKING_AUTO_CANCELLED: { message: 'Reserva cancelada automáticamente', criticity: CRITICITY.MEDIUM },
  BOOKING_UPDATED: { message: 'Reserva actualizada', criticity:  CRITICITY.MEDIUM },

  PAYMENT_PROCESSED: { message: 'Pago procesado', criticity: CRITICITY.HIGH },
  PAYMENT_FAILED: { message: 'Error al pagar reserva', criticity: CRITICITY.HIGH },
  PAYMENT_EMAIL_SENT: { message: 'Correo de pago enviado', criticity: CRITICITY.MEDIUM },
 
  ROOM_CREATED: { message: 'Habitación creada', criticity: CRITICITY.MEDIUM },
  ROOM_CREATED_FAILED: { message: 'Error al crear habitación' , criticity: CRITICITY.MEDIUM },
  ROOM_UPDATED: { message: 'Habitación actualizada', criticity: CRITICITY.MEDIUM },
  ROOM_UPDATED_FAILED: { message: 'Error al actualizar habitación', criticity: CRITICITY.MEDIUM },
  ROOM_STATE_CHANGED: { message: 'Cambio de estado de habitación', criticity: CRITICITY.MEDIUM },
 
  USER_STATUS_UPDATED: { message: 'Cambio de estado de usuario', criticity: CRITICITY.HIGH },
  USER_STATUS_UPDATE_FAILED: { message: 'Error al cambiar estado de usuario', criticity: CRITICITY.CRITICAL },

  ROLE_CREATED: { message: 'Rol creado', criticity: CRITICITY.MEDIUM },
  ROLE_CREATE_FAILED: { message: 'Error al crear rol', criticity: CRITICITY.HIGH },
  ROLE_UPDATED: { message: 'Rol actualizado', criticity: CRITICITY.MEDIUM },
  ROLE_UPDATE_FAILED: { message: 'Error al actualizar rol', criticity: CRITICITY.MEDIUM },
  ROLE_DELETED: { message: 'Rol eliminado', criticity: CRITICITY.HIGH },
  ROLE_DELETE_FAILED: { message: 'Error al eliminar rol', criticity: CRITICITY.HIGH },
  ROLE_ASSIGNED: { message: 'Rol asignado a usuario', criticity: CRITICITY.MEDIUM },
  ROLE_ASSIGN_FAILED: { message: 'Error al asignar rol', criticity: CRITICITY.HIGH },
  ROLE_REMOVED: { message: 'Rol eliminado de usuario', criticity: CRITICITY.MEDIUM },
  ROLE_REMOVE_FAILED: { message: 'Error al eliminar rol de usuario', criticity: CRITICITY.HIGH },

  PERMISSION_CREATED: { message: 'Permiso creado', criticity: CRITICITY.MEDIUM },
  PERMISSION_CREATE_FAILED: { message: 'Error al crear permiso', criticity: CRITICITY.HIGH },
  PERMISSION_UPDATED: { message: 'Permiso actualizado', criticity: CRITICITY.MEDIUM },
  PERMISSION_UPDATE_FAILED: { message: 'Error al actualizar permiso', criticity: CRITICITY.HIGH },
  PERMISSION_DELETED: { message: 'Permiso eliminado', criticity: CRITICITY.HIGH },
  PERMISSION_DELETE_FAILED: { message: 'Error al eliminar permiso', criticity: CRITICITY.HIGH },
  PERMISSION_ASSIGNED: { message: 'Permiso asignado', criticity: CRITICITY.MEDIUM },
  PERMISSION_ASSIGN_FAILED: { message: 'Error al asignar permiso', criticity: CRITICITY.HIGH },

  CHECKIN_FAILED: { message: 'Error en el check-in', criticity: CRITICITY.HIGH },
  CHECKOUT_FAILED: { message: 'Error en el check-out', criticity: CRITICITY.HIGH },

  CLEANING_SUCCESS: { message: 'Error en el check-in', criticity: CRITICITY.HIGH },
  CHECKOUT_FAILED: { message: 'Error en el check-out', criticity: CRITICITY.HIGH }
}

// Máximo de intentos fallidos antes de bloquear al usuario
const LOGIN_MAX_ATTEMPTS = 5

// Estados posibles del usuario
const USER_STATES = {
  ACTIVE: 1,
  INACTIVE: 2,
  BLOCKED: 3,
  DELETED: 4
}

// Etiquetas legibles para mostrar el estado del usuario
const USER_STATE_LABELS = {
  [USER_STATES.ACTIVE]: 'Activo',
  [USER_STATES.INACTIVE]: 'Inactivo',
  [USER_STATES.BLOCKED]: 'Bloqueado',
  [USER_STATES.DELETED]: 'Eliminado'
}

// Estados posibles de reserva
const BOOKING_STATUS = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Finalizada',
  IN_PROGRESS: 'En curso' 
}

// Estados posibles de pago
const PAYMENT_STATUS = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  REFUNDED: 'Reembolsado',
  FAILED: 'Fallido'
}

// Estados posibles de habitación
const ROOM_STATES = {
  AVAILABLE: 1,      // Disponible
  OCCUPIED: 2,       // Ocupada
  MAINTENANCE: 3,    // En mantenimiento
  CLEANING: 4,       // En limpieza
  OUT_OF_SERVICE: 5  // Fuera de servicio
}

const ROOM_TYPES = {
  STANDARD: 'Estandar',
  DELUXE: 'Deluxe',
  EXECUTIVE: 'Ejecutiva',
  FAMILY: 'Familiar',
  PRESIDENTIAL: 'Presidencial'
}

// Etiquetas legibles para mostrar el estado de habitación
const ROOM_STATE_LABELS = {
  [ROOM_STATES.AVAILABLE]: 'Disponible',
  [ROOM_STATES.OCCUPIED]: 'Ocupada',
  [ROOM_STATES.MAINTENANCE]: 'En mantenimiento',
  [ROOM_STATES.CLEANING]: 'En limpieza',
  [ROOM_STATES.OUT_OF_SERVICE]: 'Fuera de servicio'
}



module.exports = {
  CRITICITY, LOG_ACTIONS,
  LOGIN_MAX_ATTEMPTS,
  USER_STATES, USER_STATE_LABELS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  ROOM_STATES, ROOM_STATE_LABELS, ROOM_TYPES
}
