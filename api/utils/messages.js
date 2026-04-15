
module.exports = {
    validation: {
        emailRequired: 'Debe completar el campo de correo electrónico',
        emailInvalid: 'Formato de correo inválido. Verifique los datos ingresados',

        passwordRequired: 'Debe completar el campo de contraseña',
        passwordLength: 'La contraseña debe tener al menos 8 caracteres',
        passwordInvalid: 'Formato de contraseña inválido. Verifique los datos ingresados',
        confirmPasswordRequired: "Debe confirmar la contraseña",
        passwordMismatch: "Las contraseñas no coinciden. Verifique los datos ingresados",

        nameRequired: 'Debe completar el campo de nombre',
        lastNameRequired: 'Debe completar el campo de apellido',

        phoneLength: 'El teléfono debe tener al menos 6 caracteres',
        dateFormatInvalid: 'Formato de fecha inválido (AAAA-MM-DD)',
        dniLength: 'El DNI debe tener entre 7 y 10 dígitos',
        photoInvalid: 'El formato de la foto es inválido',
        tokenRequired: 'Token requerido',

        roleRequired: 'Debe seleccionar un rol',
        roleInvalid: 'El ID de rol debe ser un número entero',

        idRoomRequired: 'El ID de la habitación es requerido',
        idNotNegative: 'El ID debe ser un número entero positivo',
        idBookingRequired: 'El ID de la reserva es requerido',

        checkInRequired: 'La fecha de check-in es requerida',
        checkOutRequired: 'La fecha de check-out es requerida',

        guestRequired: 'El número de huéspedes es requerido',

        userStateInvalid: 'El estado del usuario debe ser un número entre 1 y 4',
        actionInvalid: 'La acción debe ser block, unblock o delete',
        userIdInvalid: 'El ID de usuario debe ser un número entero positivo',
        searchTermInvalid: 'El término de búsqueda debe tener entre 2 y 100 caracteres',
        searchTypeInvalid: 'El tipo de búsqueda debe ser name, email o all',
    },

    login: {
        success: 'Inicio de sesión exitoso',
        errors: {
            notFound: 'Usuario no encontrado',
            inactive: 'Usuario inhabilitado',
            blocked: 'Usuario bloqueado por superar ',
            wrongPassword: 'Contraseña incorrecta'
        }
    },

    register: {
        success: 'Registro exitoso',
        pendingActivation: 'Cuenta creada y está pendiente de activación',
        activationEmailSent: 'Se ha enviado un correo con el enlace de activación',
        activationResent: 'Se ha enviado un nuevo enlace de activación a tu correo',
        activationLogResent: 'Reenvío de enlace de activación',
        register: 'Registro de usuario',
        errors: {
            duplicatedEmail: 'El correo ingresado ya está registrado',
            creationFailed: 'Error al procesar el registro. Intente nuevamente más tarde',
            activationMailFailed: 'Error al enviar el correo de activación',
        }
    },

    recovery: {
        success: 'Contraseña restablecida',
        recoveryEmailSent: 'Se ha enviado un correo con el enlace de recuperación',
        recoveryResent: 'Se ha enviado un nuevo enlace de recuperación a tu correo',
        errors: {
            recoveryMailFailed: 'Error al enviar el correo de recuperación',
            differentsPassword: 'Las contraseñas no coinciden'
        }
    },

    auth: {
        errors: {
            tokenRequired: 'Se requiere token de autenticación',
            userNotFound: 'Usuario no encontrado',
            accessDenied: 'Acceso denegado. No tienes los permisos necesarios'
        }
    },

    token: {
        invalidOrExpiredToken: 'El enlace es inválido o ha expirado',
        success: 'Token válido',
        noAuthorizationToken: 'No hay token de autorización'
    },

    update: {
        success: 'Datos de usuario actualizados correctamente',
        userProfileFetched: 'Perfil de usuario obtenido correctamente',
        passwordUpdated: 'Contraseña actualizada correctamente',
        updateEmailSent: 'Se ha enviado un correo de notificación',
        roleSwitched: 'Rol cambiado exitosamente',
        errors: {
            updatePasswordMailFailed: 'Error al enviar el correo de notificación',
            updateFailed: 'Error al actualizar los datos de usuario. Intente nuevamente más tarde',
            invalidRole: 'El rol seleccionado no existe o no pertence al usuario'
        }
    },

    avatar: {
        success: 'Imagen subida exitosamente',
        errors:{
            noFileUpload: 'No se ha cargado ninguna imagen'
        }
    },

    log: {
        accessDenied: 'Acceso denegado registrado',
        logout: 'Cierre de sesión registrado correctamente',
        booking: 'Fallo de reserva registrado correctamente'
    },

    admin: {
        dashboard:'Estadísticas del dashboard obtenidas correctamente',
        users: {
            success: {
                fetched: 'Usuarios obtenidos correctamente',
                statusUpdated: 'Estado de usuario actualizado correctamente',
                deleted: 'Usuario eliminado correctamente',
                blocked: 'Usuario bloqueado correctamente',
                unblocked: 'Usuario desbloqueado correctamente'
            },
            errors: {
                notFound: 'Usuario no encontrado',
                accessDenied: 'Acceso denegado. Solo administradores pueden gestionar usuarios',
                invalidStatus: 'Estado de usuario inválido',
                cannotDeleteAdmin: 'No se puede eliminar un usuario administrador',
                lastAdmin: 'No se puede eliminar o bloquear al último administrador del sistema'
            }
        },
        reports: {
            success: {
                generated: 'Reporte generado exitosamente'
            },
            errors: {
                invalidType: 'Tipo de reporte inválido',
                notFound: 'No se encontraron datos para el reporte especificado'
            }
        }
    },

    booking: {
        success: 'Reserva creada exitosamente',
        roomsFetched: 'Habitaciones obtenidas correctamente',
        bookingFetched: 'Reserva obtenida correctamente',
        bookingsFetched: 'Reservas obtenidas correctamente',
        bookingCancelled: 'Reserva cancelada exitosamente',
        bookingUpdated: 'Reserva actualizada exitosamente',
        confirmationCode: 'Código de confirmación',
        availableRooms: 'Habitaciones disponibles',
        emailCancelledSent: 'Correo de cancelación enviado',
        noRoomsAvailable: 'No hay habitaciones disponibles para las fechas seleccionadas',
        invalidDates: 'Las fechas seleccionadas no son válidas',
        checkInAfterCheckOut: 'La fecha de check-in debe ser anterior a la de check-out',
        pastDates: 'No se pueden hacer reservas para fechas pasadas',
        errors: {
            roomNotFound: 'Habitación no encontrada',
            bookingNotFound: 'Reserva no encontrada',
            datesUnavailable: 'La habitación no está disponible para las fechas seleccionadas',
            insufficientCapacity: 'La habitación no tiene capacidad suficiente para el número de huéspedes',
            invalidGuests: 'Número de huéspedes inválido',
            creationFailed: 'Error al crear la reserva. Intente nuevamente más tarde',
            cancellationFailed: 'Error al cancelar la reserva. Intente nuevamente más tarde',
            updateFailed: 'Error al actualizar la reserva. Intente nuevamente más tarde',
            unauthorizedAccess: 'No tiene permisos para acceder a esta reserva',
            cannotCancelConfirmed: 'No se puede cancelar una reserva confirmada',
            cannotUpdateCompleted: 'No se puede cancelar una reserva completada',
            cannotUpdateInProgress: 'No se puede cancelar una reserva que está en curso',
            cancelledBooking: 'La reserva ya está cancelada',
            emailCancelled: 'Error al enviar email de cancelación'
        }
    },

    room: {
        success: 'Información de habitación obtenida correctamente',
        created: 'Habitación creada exitosamente',
        updated: 'Habitación actualizada exitosamente',
        deleted: 'Habitación eliminada exitosamente',
        fetchingRooms: 'Habitaciones obtenidas correctamente',
        roomsFetched: 'Habitaciones obtenidas correctamente',
        errors: {
            notFound: 'Habitación no encontrada',
            invalidType: 'Tipo de habitación inválido',
            nameRequired: 'El nombre de la habitación es obligatorio',
            typeRequired: 'El tipo de habitación es obligatorio',
            capacityRequired: 'La capacidad es obligatoria',
            capacityMax: 'La capacidad no puede ser mayor a 6 personas',
            priceRequired: 'El precio es obligatorio',
            pricePositive: 'El precio debe ser mayor a 0',
            stateRequired: 'El estado de la habitación es obligatorio',
            imageRequired: 'La imagen de la habitación es obligatoria',
            invalidCapacity: 'La capacidad debe ser un número válido',
            invalidPrice: 'El precio debe ser un número válido',
            invalidState: 'El estado de la habitación es inválido',
            imageInvalid: 'La URL de la imagen no es válida',
            fetchingRooms: 'Error al buscar habitaciones',
            fetchingRoomsDetails: 'Error al buscar el detalle de la habitación',
            creationFailed: 'Error al crear la habitación',
            updateFailed: 'Error al actualizar la habitación',
            deletionFailed: 'Error al eliminar la habitación',
            hasReservations: 'No se puede eliminar la habitación porque tiene reservas asociadas',
            invalidImageFormat: 'Formato de imagen inválido. Solo se permiten JPEG, JPG o PNG',
            imageSizeExceeded: 'La imagen no puede ser mayor a 5MB',
            imageUploadFailed: 'Error al subir la imagen'
        }
    },

    payment: {
        success: 'Pago procesado exitosamente',
        pending: 'Pago pendiente de procesamiento',
        confirmed: 'Pago confirmado',
        failed: 'El pago no pudo ser procesado',
        emailSent: 'Se ha enviado un correo de confirmación de pago',
        paymentConfirmationEmailSent: 'Se ha enviado el correo de confirmación de pago',
        errors: {
            bookingNotFound: 'Reserva no encontrada',
            bookingAlreadyPaid: 'Esta reserva ya ha sido pagada',
            bookingCancelled: 'No se puede pagar una reserva cancelada',
            invalidBookingStatus: 'El estado de la reserva no permite el pago',
            invalidAmount: 'Monto de pago inválido',
            paymentFailed: 'Error al procesar el pago',
            emailFailed: 'Error al enviar correo de confirmación',
            paymentConfirmationEmailFailed: 'Error al enviar correo de confirmación de pago',
            unauthorizedAccess: 'No tiene permisos para acceder a esta reserva'
        }
    },

    integrity: {
        reportSuccess: 'Reporte de integridad generado con éxito',
        repairDVV: 'Todos los DVV fueron recalculados',
        errors: {
            invalidtableName: 'Nombre de la tabla inválido'
        }
    },

    roles: {
        success: {
            created: 'Rol creado exitosamente',
            updated: 'Rol actualizado exitosamente',
            deleted: 'Rol eliminado exitosamente',
            assigned: 'Rol asignado exitosamente',
            removed: 'Rol eliminado del usuario exitosamente'
        },
        errors: {
            notFound: 'Rol no encontrado',
            duplicateName: 'Ya existe un rol con ese nombre',
            systemRoleModification: 'No se puede modificar un rol del sistema',
            systemRoleDeletion: 'No se puede eliminar un rol del sistema',
            systemRoleCreation: 'No se puede crear un rol con nombre de rol del sistema',
            hasUsers: 'No se puede eliminar un rol con usuarios asignados',
            userNotFound: 'Usuario no encontrado',
            userAlreadyHasRole: 'El usuario ya tiene este rol asignado',
            userDoesNotHaveRole: 'El usuario no tiene este rol asignado',
            fetching: 'Error al obtener los roles',
            creationFailed: 'Error al crear el rol',
            updateFailed: 'Error al actualizar el rol',
            deletionFailed: 'Error al eliminar el rol',
            assignFailed: 'Error al asignar el rol al usuario',
            removeFailed: 'Error al eliminar el rol del usuario',
            permissionAssignment: 'Error al asignar permisos al rol'
        }
    },

    permissions: {
        success: {
            created: 'Permiso creado exitosamente',
            updated: 'Permiso actualizado exitosamente',
            deleted: 'Permiso eliminado exitosamente',
            assigned: 'Permiso asignado exitosamente',
            removed: 'Permiso eliminado exitosamente'
        },
        errors: {
            notFound: 'Permiso no encontrado',
            duplicateName: 'Ya existe un permiso con ese nombre',
            systemPermissionModification: 'No se puede modificar un permiso del sistema',
            systemPermissionDeletion: 'No se puede eliminar un permiso del sistema',
            systemPermissionCreation: 'No se puede crear un permiso con nombre de permiso del sistema',
            hasRoles: 'No se puede eliminar un permiso con roles asignados',
            hasUsers: 'No se puede eliminar un permiso con usuarios asignados',
            roleNotFound: 'Rol no encontrado',
            userNotFound: 'Usuario no encontrado',
            roleAlreadyHasPermission: 'El rol ya tiene este permiso asignado',
            roleDoesNotHavePermission: 'El rol no tiene este permiso asignado',
            userAlreadyHasPermission: 'El usuario ya tiene este permiso asignado directamente',
            userDoesNotHavePermission: 'El usuario no tiene este permiso asignado directamente',
            fetching: 'Error al obtener los permisos',
            creationFailed: 'Error al crear el permiso',
            updateFailed: 'Error al actualizar el permiso',
            deletionFailed: 'Error al eliminar el permiso',
            assignFailed: 'Error al asignar el permiso',
            removeFailed: 'Error al eliminar el permiso',
            fetchingAvailableRoles: 'Error al obtener los roles disponibles',
            fetchingAvailableUsers: 'Error al obtener los usuarios disponibles'
        }
    },

    receptionist: {
        checkInsFetched: 'Check-ins del día obtenidos correctamente',
        checkOutsFetched: 'Check-outs del día obtenidos correctamente',
        checkInProcessed: 'Check-in procesado exitosamente',
        checkOutProcessed: 'Check-out procesado exitosamente',
        dashboardStatsFetched: 'Estadísticas del dashboard obtenidas correctamente',
        summaryFetched: 'Resumen del recepcionista obtenido correctamente',
        errors: {
            bookingNotFound: 'Reserva no encontrada',
            invalidBookingStatus: 'La reserva no está en un estado válido para esta operación',
            checkInFailed: 'Error al procesar el check-in',
            checkOutFailed: 'Error al procesar el check-out',
            roomNotAvailable: 'La habitación no está disponible',
            unauthorizedAccess: 'Acceso denegado. Se requiere rol de recepcionista',
            invalidPaymentMethod: 'Método de pago inválido',
            dashboardStatsError: 'Error al obtener las estadísticas del dashboard',
            summaryError: 'Error al obtener el resumen del recepcionista'
        }
    },

    cleaning: {
        success: {
            roomAvailable: 'Habitación marcada como disponible correctamente',
            roomsLoaded: 'Habitaciones en limpieza cargadas correctamente'
        },
        errors: {
            roomsLoadingFailed: 'Error al cargar habitaciones en limpieza',
            roomNotFound: 'Habitación no encontrada',
            roomNotInCleaning: 'La habitación no está en estado de limpieza',
            unauthorizedAccess: 'Acceso denegado. Se requiere rol de personal de limpieza'
        }
    }

}