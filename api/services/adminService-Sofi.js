const Role = require('../models/Role')
const User = require('../models/User')
const Booking = require('../models/Booking')
const Room = require('../models/Room')
const UserRole = require('../models/UserRole')
const logger = require('../utils/logger')

const { USER_STATES, USER_STATE_LABELS, LOG_ACTIONS, BOOKING_STATUS, ROOM_STATES } = require('../utils/constants')
const { createError } = require('../utils/helpers/errorHelper')
const { admin: adminMessages } = require('../utils/messages')
const { Op } = require('sequelize')


const getAllUsers = async (filters = {}) => {   //Devuelve una lista paginada de usuarios
    const { page = 1, limit = 10, status = null, search = null, searchType = 'all' } = filters
    const offset = (page - 1) * limit   //Lo que saltea para paginar

    let whereClause = {}  //Construir la whereClause
    if (status !== null && status !== '') { whereClause.userStateId = parseInt(status) }    //Filtra por el estado del usuario

    if (search) {
        const searchCondition = {}

        if (searchType === 'name') {    //Busca por nombre
            searchCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } }
            ]

        } else if (searchType === 'email') {  //Busca por email
            searchCondition.email = { [Op.like]: `%${search}%` }

        } else {
            searchCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ]
        }

        whereClause = { ...whereClause, ...searchCondition }
    }

    const { count, rows: users } = await User.findAndCountAll({   //Busca los usuarios y los cuenta
        where: whereClause,
        include: [
            {
                model: Role,
                as: 'Roles',
                through: { attributes: [] },
                attributes: ['name']
            }
        ],
        attributes: { exclude: ['password', 'dvh'] },
        order: [['createdAt', 'DESC']],   //Ordena por lo más nuevos
        limit: parseInt(limit),
        offset: offset  //Aplica paginación real
    })

    const totalPages = Math.ceil(count / limit)   //Calcula la cantidad de páginas

    return {
        users,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalUsers: count,
            perPage: parseInt(limit)
        }
    }
}

const getUsersByStatus = async (statusId) => {   //Devuelve todos los usuarios con un mismo estado
    if (!Object.values(USER_STATES).includes(parseInt(statusId))) {
        throw createError(adminMessages.users.errors.invalidStatus, 400)
    }

    const users = await User.findAll({
        where: { userStateId: statusId },
        include: [
            {
                model: Role,
                as: 'Roles',
                through: { attributes: [] },
                attributes: ['name']
            }
        ],
        attributes: { exclude: ['password', 'dvh'] },
        order: [['createdAt', 'DESC']]
    })

    return { users }
}

const searchUsersBy = async (searchTerm, searchType = 'all') => {  //Busca usuario por nombre, apellido, email o todo
    if (!searchTerm || searchTerm.trim().length < 2) {
        throw createError('El término de búsqueda debe tener al menos 2 caracteres', 400)
    }

    let searchCondition = {}

    if (searchType === 'name') {
        searchCondition[Op.or] = [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { lastName: { [Op.like]: `%${searchTerm}%` } }
        ]

    } else if (searchType === 'email') {
        searchCondition.email = { [Op.like]: `%${searchTerm}%` }

    } else {
        searchCondition[Op.or] = [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { lastName: { [Op.like]: `%${searchTerm}%` } },
            { email: { [Op.like]: `%${searchTerm}%` } }
        ]
    }

    const users = await User.findAll({
        where: searchCondition,
        include: [
            {
                model: Role,
                as: 'Roles',
                through: { attributes: [] },
                attributes: ['name']
            }
        ],
        attributes: { exclude: ['password', 'dvh'] },
        order: [['createdAt', 'DESC']]
    })

    return { users }
}

const getFirstAdminId = async () => {
    const firstAdmin = await User.findOne({
        include: [{
            model: Role,
            as: 'Roles',
            where: { name: 'admin' },
            through: { attributes: [] }
        }],
        order: [['createdAt', 'ASC']]
    })

    return firstAdmin ? firstAdmin.id : null
}

const updateUserStatus = async (userId, userStateId, action = null, adminId = null) => {   //Para cambiar el estado de un usuario
    const user = await User.findByPk(userId, {
        include: [
            {
                model: Role,
                as: 'Roles',
                through: { attributes: [] },
                attributes: ['name']
            }
        ]
    })

    if (!user) throw createError(adminMessages.users.errors.notFound, 404)

    const hasAdminRole = user.Roles.some(role => role.name === 'admin')   //Revisa si en su lista de roles tiene admin

    // Obtener ID del primer admin (admin principal)
    const firstAdminId = await getFirstAdminId()

    // Si el admin principal está intentando modificar a otro admin, permitirlo
    if (hasAdminRole && adminId === firstAdminId && userId !== adminId) {
        // El admin principal puede modificar a otros admins
    } else if (hasAdminRole && adminId !== firstAdminId) {
        // Admins secundarios no pueden modificar a otros admins
        await logger(
            adminId,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.message,
            `Intento de ${action} al usuario ID: ${user.id} con rol administrador por admin secundario`,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.criticity
        )

        throw createError('Los administradores secundarios no pueden modificar a otros administradores', 403)
    }

    const adminCount = await User.count({  //Cuenta cuantos usarios tienen rol admin
        include: [{
            model: Role,
            as: 'Roles',
            where: { name: 'admin' },
            through: { attributes: [] }
        }]
    })

    if (action === 'block' || action === 'delete') {  //No permite bloquear ni eliminar a usuario admin
        if (hasAdminRole && adminCount <= 1) {
            await logger(
                adminId,
                LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.message,
                `Intento de ${action} al usuario ID: ${user.id} con rol administrador`,
                LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.criticity
            )

            throw createError(adminMessages.users.errors.lastAdmin, 400)
        }
    }

    const oldStatus = user.userStateId
    let newStatus = userStateId

    if (action === 'block') {
        newStatus = USER_STATES.BLOCKED
    } else if (action === 'unblock') {
        newStatus = USER_STATES.ACTIVE
    } else if (action === 'delete') {
        newStatus = USER_STATES.DELETED
    }

    // Validar que el nuevo estado sea válido
    if (!Object.values(USER_STATES).includes(parseInt(newStatus))) throw createError(adminMessages.users.errors.invalidStatus, 400)

    try {
        await Promise.all([
            user.update({ userStateId: newStatus }),

            logger(
                adminId,
                LOG_ACTIONS.USER_STATUS_UPDATED.message,
                `El usuario ID: ${user.id} cambio de estado a: ${USER_STATE_LABELS[newStatus]}`,
                LOG_ACTIONS.USER_STATUS_UPDATED.criticity
            )
        ])

        return {
            user: {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                userStateId: newStatus,
                oldStatus: oldStatus
            },
            action
        }

    } catch (error) {
        await logger(
            adminId,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.message,
            `Error al cambiar el estado del usuario ID: ${user.id}`,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.criticity
        )

        throw error
    }
}

const deleteUser = async (userId, adminId = null) => {
    const user = await User.findByPk(userId, {
        include: [
            {
                model: Role,
                as: 'Roles',
                through: { attributes: [] },
                attributes: ['name']
            }
        ]
    })

    if (!user) throw createError(adminMessages.users.errors.notFound, 404)

    const hasAdminRole = user.Roles.some(role => role.name === 'admin')

    // Obtener ID del primer admin (admin principal)
    const firstAdminId = await getFirstAdminId()

    // Si el admin principal está intentando eliminar a otro admin, permitirlo
    if (hasAdminRole && adminId === firstAdminId && userId !== adminId) {
        // El admin principal puede eliminar a otros admins
    } else if (hasAdminRole && adminId !== firstAdminId) {
        // Admins secundarios no pueden eliminar a otros admins
        await logger(
            adminId,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.message,
            `Intento de eliminar al usuario ID: ${user.id} con rol administrador por admin secundario`,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.criticity
        )

        throw createError('Los administradores secundarios no pueden eliminar a otros administradores', 403)
    }

    const adminCount = await User.count({
        include: [{
            model: Role,
            as: 'Roles',
            where: { name: 'admin' },
            through: { attributes: [] }
        }]
    })

    if (hasAdminRole && adminCount <= 1) {
        await logger(
            adminId,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.message,
            `Intento de eliminar al usuario ID: ${user.id} con rol administrador`,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.criticity
        )

        throw createError(adminMessages.users.errors.lastAdmin, 400)
    }

    try {
        await user.update({ userStateId: USER_STATES.DELETED })

        await logger(
            adminId,
            LOG_ACTIONS.USER_STATUS_UPDATED.message,
            `El usuario ID: ${user.id} fue eliminado del sistema`,
            LOG_ACTIONS.USER_STATUS_UPDATED.criticity
        )
       
        return { success: true }

    } catch (error) {
        await logger(
            adminId,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.message,
            `Error al eliminar el usuario ID: ${user.id}`,
            LOG_ACTIONS.USER_STATUS_UPDATE_FAILED.criticity
        )

        throw error
    }
}

const getDashboardStats = async () => {
    try {
        // Estadísticas de usuarios
        const totalUsers = await User.count()
        const activeUsers = await User.count({ where: { userStateId: USER_STATES.ACTIVE } })
        const inactiveUsers = await User.count({ where: { userStateId: USER_STATES.INACTIVE } })
        const blockedUsers = await User.count({ where: { userStateId: USER_STATES.BLOCKED } })
        const deletedUsers = await User.count({ where: { userStateId: USER_STATES.DELETED } })

        // Estadísticas por rol
        const adminCount = await User.count({
            include: [{
                model: Role,
                as: 'Roles',
                where: { name: 'admin' },
                through: { attributes: [] }
            }]
        })

        const guestCount = await User.count({
            include: [{
                model: Role,
                as: 'Roles',
                where: { name: 'guest' },
                through: { attributes: [] }
            }]
        })

        const recepcionistCount = await User.count({
            include: [{
                model: Role,
                as: 'Roles',
                where: { name: 'recepcionist' },
                through: { attributes: [] }
            }]
        })

        const cleaningCount = await User.count({
            include: [{
                model: Role,
                as: 'Roles',
                where: { name: 'cleaning' },
                through: { attributes: [] }
            }]
        })

        // Estadísticas de reservas (sumando los estados correspondientes)
        const totalBookings = await Booking.count()
        const pendingBookings = await Booking.count({ where: { status: 'Pendiente' } })
        const confirmedBookings = await Booking.count({ where: { status: 'Confirmada' } })
        const cancelledBookings = await Booking.count({ where: { status: 'Cancelada' } })

        // Estadísticas de habitaciones
        const totalRooms = await Room.count()
        const availableRooms = await Room.count({ where: { roomStateId: 1 } }) // 1 = AVAILABLE
        const occupiedRooms = await Room.count({ where: { roomStateId: 2 } }) // 2 = OCCUPIED
        const maintenanceRooms = await Room.count({ where: { roomStateId: 3 } }) // 3 = MAINTENANCE

        // Usuarios registrados en el último mes
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const newUsersThisMonth = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: thirtyDaysAgo
                }
            }
        })

        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                inactive: inactiveUsers,
                blocked: blockedUsers,
                deleted: deletedUsers,
                newThisMonth: newUsersThisMonth
            },

            roles: {
                admin: adminCount,
                guest: guestCount,
                recepcionist: recepcionistCount,
                cleaning: cleaningCount
            },

            bookings: {
                total: totalBookings,
                pending: pendingBookings,
                confirmed: confirmedBookings,
                cancelled: cancelledBookings
            },

            rooms: {
                total: totalRooms,
                available: availableRooms,
                occupied: occupiedRooms,
                maintenance: maintenanceRooms
            }
        }

    } catch (error) {
        throw error
    }
}

// Función auxiliar usando las constantes existentes
const getRoleDistribution = (users) => {
    const roleCounts = {}

    users.forEach(user => {
        user.Roles.forEach(role => {
            roleCounts[role.name] = (roleCounts[role.name] || 0) + 1
        })
    })

    return roleCounts
}

const generateReport = async (reportType, filters = {}) => {
    const { startDate, endDate, status, userType } = filters

    const validReportTypes = ['users', 'bookings', 'system', 'integrity']
    if (!validReportTypes.includes(reportType)) {
        throw createError(adminMessages.reports.errors.invalidType, 400)
    }

    let dateFilter = {}
    if (startDate && endDate) {  //Parsear fechas si se proporcionan
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999) // Incluir todo el día final

        dateFilter = {
            [Op.between]: [start, end]
        }
    }

    try {
        switch (reportType) {
            case 'users':
                return await generateUsersReport(dateFilter, userType)
            case 'bookings':
                return await generateBookingsReport(dateFilter, status)
            case 'system':
                return await generateSystemReport(dateFilter)
            case 'integrity':
                return await generateIntegrityReport(filters)
            default:
                throw createError(adminMessages.reports.errors.invalidType, 400)
        }
    } catch (error) {
        throw error
    }
}

const generateUsersReport = async (dateFilter, userType) => {
    let whereClause = {}

    if (dateFilter && dateFilter[Op.between]) {
        whereClause.createdAt = dateFilter
    }

    if (userType && userType !== 'all') {
        whereClause['$Roles.name$'] = userType
    }

    const users = await User.findAll({
        where: whereClause,
        include: [
            {
                model: Role,
                as: 'Roles',
                through: { attributes: [] },
                attributes: ['name'],
                ...(userType && userType !== 'all' && { where: { name: userType } })
            }
        ],
        attributes: [
            'id', 'name', 'lastName', 'email', 'userStateId', 'createdAt'
        ],
        order: [['createdAt', 'DESC']],
        limit: 1000  // Limitar a 1000 usuarios para evitar timeout
    })

    const reportData = users.map(user => ({    // Formatear datos para el reporte
        id: user.id,
        name: `${user.name} ${user.lastName}`,
        email: user.email,
        role: user.Roles.map(role => role.name).join(', ') || 'N/A',
        status: USER_STATE_LABELS[user.userStateId],
        registrationDate: new Date(user.createdAt).toLocaleDateString()
    }))

    // Generar métricas adicionales
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.userStateId === 1).length
    const inactiveUsers = users.filter(u => u.userStateId === 2).length
    const blockedUsers = users.filter(u => u.userStateId === 3).length

    return {
        reportData,
        metrics: {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            blocked: blockedUsers,
            byRole: getRoleDistribution(users)
        },
        metadata: {
            generatedAt: new Date().toISOString(),
            reportType: 'users'
        }
    }
}

const generateBookingsReport = async (dateFilter, status) => {
    let whereClause = {}

    if (dateFilter && dateFilter[Op.between]) {
        whereClause.checkInDate = dateFilter
    }

    if (status && status !== 'all') {
        whereClause.status = status
    }

    const bookings = await Booking.findAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['name', 'lastName', 'email']
            },
            {
                model: Room,
                as: 'room',
                attributes: ['name', 'type', 'price']
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: 1000  // Limitar a 1000 reservas para evitar timeout
    })

    const reportData = bookings.map(booking => ({       // Formatear datos para el reporte
        id: booking.id,
        guestName: booking.user ? `${booking.user.name} ${booking.user.lastName}` : 'N/A',
        guestEmail: booking.user?.email || 'N/A',
        room: booking.room?.name || 'N/A',
        roomType: booking.room?.type || 'N/A',
        checkIn: booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A',
        checkOut: booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A',
        status: booking.status,
        total: booking.totalPrice ? `$${booking.totalPrice}` : 'N/A',
        createdAt: new Date(booking.createdAt).toLocaleDateString()
    }))

    // Generar métricas adicionales
    const totalBookings = bookings.length
    const pendingBookings = bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length
    const confirmedBookings = bookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED).length
    const cancelledBookings = bookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length

    const totalRevenue = bookings
        .filter(b => b.status === BOOKING_STATUS.CONFIRMED && b.totalPrice)
        .reduce((sum, b) => sum + parseFloat(b.totalPrice), 0)

    return {
        reportData,
        metrics: {
            total: totalBookings,
            pending: pendingBookings,
            confirmed: confirmedBookings,
            cancelled: cancelledBookings,
            totalRevenue: `$${totalRevenue.toFixed(2)}`,
            averageBookingValue: totalBookings > 0 ? `$${(totalRevenue / totalBookings).toFixed(2)}` : '$0'
        },
        metadata: {
            generatedAt: new Date().toISOString(),
            reportType: 'bookings'
        }
    }
}

const generateSystemReport = async (dateFilter) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [ totalUsers, activeUsers, totalBookings, confirmedBookings, totalRooms, occupiedRooms, availableRooms, recentLogs, newUsersThisMonth ] =
        await Promise.all([
            User.count(),
            User.count({ where: { userStateId: 1 } }),
            Booking.count(),
            Booking.count({ where: { status: BOOKING_STATUS.CONFIRMED } }),
            Room.count(),
            Room.count({ where: { roomStateId: ROOM_STATES.OCCUPIED } }),
            Room.count({ where: { roomStateId: ROOM_STATES.AVAILABLE } }),
            Log.findAll({
                where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
                include: [{
                    model: User,
                    as: 'User',
                    attributes: ['name', 'lastName']
                }],
                order: [['createdAt', 'DESC']],
                limit: 10
            }),
            User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } })
    ])

    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : '0'
    const confirmationRate = totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(1) : '0'

    // Datos para las tarjetas de métricas
    const metricsData = [
        {
            metric: 'Usuarios Activos',
            value: activeUsers,
            change: newUsersThisMonth > 0 ? `+${newUsersThisMonth} este mes` : 'Sin cambios',
            status: newUsersThisMonth > 0 ? 'good' : 'neutral'
        },
        {
            metric: 'Reservas Hoy',
            value: await Booking.count({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            change: confirmationRate > 50 ? `${confirmationRate}% confirmadas` : 'Baja confirmación',
            status: confirmationRate > 50 ? 'good' : 'warning'
        },
        {
            metric: 'Tasa de Ocupación',
            value: `${occupancyRate}%`,
            change: occupancyRate > 70 ? 'Alta ocupación' : 'Ocupación moderada',
            status: occupancyRate > 70 ? 'good' : 'warning'
        },
        {
            metric: 'Ingresos Totales',
            value: `$${(await Booking.sum('totalPrice', {
                where: { status: BOOKING_STATUS.CONFIRMED }
            }) || 0).toFixed(0)}`,
            change: 'Mes actual',
            status: 'good'
        },
        {
            metric: 'Habitaciones Disponibles',
            value: availableRooms,
            change: `${totalRooms - availableRooms} ocupadas`,
            status: availableRooms > totalRooms * 0.3 ? 'good' : 'warning'
        },
        {
            metric: 'Actividad Reciente',
            value: recentLogs.length,
            change: 'Últimas actividades',
            status: 'good'
        }
    ]

    return {
        reportData: metricsData,
        systemInfo: {
            totalUsers,
            activeUsers,
            totalBookings,
            confirmedBookings,
            totalRooms,
            occupiedRooms,
            availableRooms,
            occupancyRate: `${occupancyRate}%`,
            confirmationRate: `${confirmationRate}%`
        },
        recentActivity: recentLogs.map(log => ({
            id: log.id,
            action: log.action,
            user: log.User ? `${log.User.name} ${log.User.lastName}` : 'System',
            timestamp: new Date(log.createdAt).toLocaleString(),
            criticity: log.criticity
        })),
        metadata: {
            generatedAt: new Date().toISOString(),
            reportType: 'system'
        }
    }
}

const generateIntegrityReport = async (filters = {}) => {
    const { generarReporteIntegrity, getTableConfigurations } = require('../utils/integrity')
    const Integrity = require('../models/Integrity')

    try {
        // Obtener el reporte completo de integridad
        const integrityReport = await generarReporteIntegrity()

        // Obtener información adicional de la tabla Integrity
        const integrityRecords = await Integrity.findAll()

        // Obtener configuración de tablas para información detallada
        const { tables } = getTableConfigurations()

        // Enriquecer el reporte con información adicional
        const enrichedDetails = await Promise.all(integrityReport.details.map(async (table) => {
            const tableConfig = tables.find(t => t.name === table.table)
            if (!tableConfig) return table

            try {
                // Contar registros totales y calcular porcentajes
                const totalCount = await tableConfig.Model.count()
                const activeCount = tableConfig.estadoCampo && tableConfig.estadoActivo
                    ? await tableConfig.Model.count({
                        where: { [tableConfig.estadoCampo]: tableConfig.estadoActivo }
                    })
                    : totalCount

                const integrityRecord = integrityRecords.find(r => r.tableName === table.table)

                return {
                    ...table,
                    totalRecords: totalCount,
                    activeRecords: activeCount,
                    integrityPercentage: totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : 'VACÍA',
                    currentDVV: integrityRecord?.dvv || 0,
                    lastVerification: new Date().toISOString(),
                    statusLabel: table.isValid ? '✅ Íntegro' : '❌ Con errores',
                    severity: table.isValid ? 'success' : 'error'
                }
            } catch (error) {
                return {
                    ...table,
                    totalRecords: 0,
                    activeRecords: 0,
                    integrityPercentage: '0',
                    currentDVV: 0,
                    lastVerification: new Date().toISOString(),
                    statusLabel: '❌ Error al verificar',
                    severity: 'error'
                }
            }
        }))

        // Generar métricas principales
        const totalTables = integrityReport.summary.totalTables
        const validTables = integrityReport.summary.validTables
        const invalidTables = integrityReport.summary.invalidTables
        const integrityPercentage = totalTables > 0 ? ((validTables / totalTables) * 100).toFixed(1) : '0'

        // Crear datos para las tarjetas de métricas
        const metricsData = [
            {
                metric: 'Tablas Verificadas',
                value: `${validTables}/${totalTables}`,
                change: `${integrityPercentage}% de integridad`,
                status: integrityPercentage >= 90 ? 'good' : integrityPercentage >= 70 ? 'warning' : 'error'
            },
            {
                metric: 'Estado del Sistema',
                value: integrityReport.summary.status === 'Sistema: OK' ? '✅ OK' : '❌ ERRORES',
                change: `${invalidTables} tablas con errores`,
                status: integrityReport.summary.status === 'Sistema: OK' ? 'good' : 'error'
            },
            {
                metric: 'Tablas Críticas',
                value: enrichedDetails.filter(t => t.severity === 'error').length,
                change: 'Requieren atención',
                status: enrichedDetails.some(t => t.severity === 'error') ? 'error' : 'good'
            },
            {
                metric: 'Última Verificación',
                value: new Date(integrityReport.summary.timestamp).toLocaleDateString(),
                change: 'Fecha del reporte',
                status: 'good'
            }
        ]

        return {
            reportData: metricsData,
            tableDetails: enrichedDetails,
            summary: {
                ...integrityReport.summary,
                integrityPercentage: `${integrityPercentage}%`,
                totalRecords: enrichedDetails.reduce((sum, t) => sum + t.totalRecords, 0),
                criticalTables: enrichedDetails.filter(t => t.severity === 'error').map(t => t.table)
            },
            metadata: {
                generatedAt: new Date().toISOString(),
                reportType: 'integrity',
                filters: filters // Para registrar qué filtros se usaron (aunque actualmente no afecten)
            }
        }

    } catch (error) {
        throw createError(`Error al generar reporte de integridad: ${error.message}`, 500)
    }
}

module.exports = {
    getAllUsers,
    getUsersByStatus,
    searchUsersBy,
    updateUserStatus,
    deleteUser,
    getDashboardStats,
    generateReport,
    getFirstAdminId
}