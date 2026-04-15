const { Booking, Room, User } = require('../models')
const { Op } = require('sequelize')
const { createError } = require('../utils/helpers/errorHelper')
const { LOG_ACTIONS, ROOM_STATES, BOOKING_STATUS, PAYMENT_STATUS } = require('../utils/constants')
const { receptionist: receptionistMessages } = require('../utils/messages')
const logger = require('../utils/logger')


const getTodayCheckIns = async () => {  // Obtener todas las reservas confirmadas ordenadas por fecha más próxima
    try {
        const today = new Date().toISOString().split('T')[0]

        const checkIns = await Booking.findAll({
            where: {
                status: BOOKING_STATUS.CONFIRMED,
                checkOutDate: {
                    [Op.gte]: today  // Mayor o igual que hoy (excluye las pasadas)
                }
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'lastName', 'email', 'phone', 'photo']
                },
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'name', 'type', 'capacity', 'price', 'roomStateId']
                }
            ],
            order: [['checkInDate', 'ASC'], ['createdAt', 'ASC']]
        })

        // Formatear los datos para el frontend
        return checkIns.map(booking => ({
            id: `CHK-${booking.id}-${new Date().getFullYear()}`,
            bookingId: booking.id,
            guestName: `${booking.user.name} ${booking.user.lastName}`,
            guestEmail: booking.user.email,
            guestPhone: booking.user.phone || 'No especificado',
            guestPhoto: booking.user.photo ? `http://localhost:3000${booking.user.photo}` : null,
            roomNumber: booking.room.name,
            roomType: booking.room.type,
            checkInDate: booking.checkInDate,
            checkInTime: '15:00', // Hora estándar de check-in
            checkOutDate: booking.checkOutDate,
            guests: booking.guests,
            status: booking.status === BOOKING_STATUS.CONFIRMED ? 'confirmed' : 'pending',
            totalPrice: parseFloat(booking.totalPrice),
            paymentStatus: booking.paymentStatus,
            confirmationCode: booking.confirmationCode,
            roomState: booking.room.roomStateId,
            createdAt: booking.createdAt,
            canCheckIn: booking.checkInDate === today // Solo se puede hacer check-in si es hoy
        }))

    } catch (error) {
        throw createError(receptionistMessages.errors.checkInFailed, 500)
    }
}

const getTodayCheckOuts = async () => {   // Obtener todas las reservas para check-out del día
    try {
        const today = new Date().toISOString().split('T')[0]

        const checkOuts = await Booking.findAll({
            where: {
                status: BOOKING_STATUS.IN_PROGRESS,
                checkOutDate: {
                    [Op.gte]: today  // Mayor o igual que hoy (incluye futuros)
                }
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'lastName', 'email', 'phone', 'photo']
                },
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'name', 'type', 'capacity', 'price', 'roomStateId']
                }
            ],
            order: [['checkOutDate', 'ASC'], ['createdAt', 'ASC']]
        })

        // Calcular montos (esto podría venir de una tabla de pagos o servicios adicionales)
        return checkOuts.map(booking => {
            const paidAmount = booking.paymentStatus === PAYMENT_STATUS.PAID ?
                parseFloat(booking.totalPrice) :
                parseFloat(booking.totalPrice) * 0.7 // Simulación de 70% pagado

            const pendingAmount = parseFloat(booking.totalPrice) - paidAmount

            return {
                id: `CHKOUT-${booking.id}-${new Date().getFullYear()}`,
                bookingId: booking.id,
                guestName: `${booking.user.name} ${booking.user.lastName}`,
                guestEmail: booking.user.email,
                guestPhone: booking.user.phone || 'No especificado',
                guestPhoto: booking.user.photo ? `http://localhost:3000${booking.user.photo}` : null,
                roomNumber: booking.room.name,
                roomType: booking.room.type,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                checkOutTime: '12:00', // Hora estándar de check-out
                guests: booking.guests,
                status: booking.status, // Usa el estado real de la reserva (BOOKING_STATUS.IN_PROGRESS)
                totalAmount: parseFloat(booking.totalPrice),
                paidAmount: paidAmount,
                pendingAmount: pendingAmount,
                paymentStatus: booking.paymentStatus,
                confirmationCode: booking.confirmationCode,
                roomState: booking.room.roomStateId,
                createdAt: booking.createdAt,
                canCheckOut: booking.checkOutDate >= today // Se puede hacer check-out desde hoy hasta la fecha de check-out
            }
        })

    } catch (error) {
        throw createError(receptionistMessages.errors.checkOutFailed, 500)
    }
}

const processCheckIn = async (bookingId, userId) => {  // Procesar check-in
    try {
        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'name', 'roomStateId']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        })

        if (!booking) throw createError(receptionistMessages.errors.bookingNotFound, 404)
        if (booking.status !== BOOKING_STATUS.CONFIRMED && booking.status !== BOOKING_STATUS.PENDING) throw createError(receptionistMessages.errors.invalidBookingStatus, 400)

        await booking.update({ status: BOOKING_STATUS.IN_PROGRESS, paymentStatus: PAYMENT_STATUS.PAID })  // Actualizar estado de la reserva a checked_in
        await booking.room.update({ roomStateId: ROOM_STATES.OCCUPIED })  // Actualizar estado de la habitación a ocupada

        await logger(
            userId,
            LOG_ACTIONS.BOOKING_UPDATED.message,
            `Check-in procesado: Reserva ${booking.confirmationCode} - Habitación ${booking.room.name}`,
            LOG_ACTIONS.BOOKING_UPDATED.criticity
        )

        return {
            success: true,
            message: 'Check-in procesado correctamente',
            bookingId: booking.id,
            confirmationCode: booking.confirmationCode,
            roomNumber: booking.room.name,
            guestName: `${booking.user.name} ${booking.user.lastName || ''}`
        }

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.CHECKIN_FAILED.message,
            `Error en el check-in de la reserva ${bookingId}: ${error.message}`,
            LOG_ACTIONS.CHECKIN_FAILED.criticity
        )

        throw error
    }
}

const processCheckOut = async (bookingId, checkoutData, userId) => {   // Procesar check-out
    try {
        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'name', 'roomStateId']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        })

        if (!booking) throw createError(receptionistMessages.errors.bookingNotFound, 404)
        if (booking.status !== BOOKING_STATUS.IN_PROGRESS) throw createError(receptionistMessages.errors.invalidBookingStatus, 400)


         
        await booking.update({ status: BOOKING_STATUS.COMPLETED, paymentStatus: PAYMENT_STATUS.PAID })   // Actualizar estado de la reserva a checked_out
        await booking.room.update({ roomStateId: ROOM_STATES.CLEANING })  // Actualizar estado de la habitación a limpieza

        // Aquí se podría registrar cargos adicionales si existiera una tabla para ello
        const { notes } = checkoutData

        await logger(
            userId,
            LOG_ACTIONS.BOOKING_UPDATED.message,
            `Check-out procesado: Reserva ${booking.confirmationCode} - Habitación ${booking.room.name}`,
            LOG_ACTIONS.BOOKING_UPDATED.criticity
        )

        return {
            success: true,
            message: 'Check-out procesado correctamente',
            bookingId: booking.id,
            confirmationCode: booking.confirmationCode,
            roomNumber: booking.room.name,
            guestName: `${booking.user.name} ${booking.user.lastName || ''}`,
            notes: notes || ''
        }

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.CHECKOUT_FAILED.message,
            `Error en check-out reserva ${bookingId}: ${error.message}`,
            LOG_ACTIONS.CHECKOUT_FAILED.criticity
        )

        throw error
    }
}

const getDashboardStats = async () => {  // Obtener estadísticas del dashboard del recepcionista
    try {
        const today = new Date().toISOString().split('T')[0]

        const totalRooms = await Room.count()  // Total de habitaciones
        const occupiedRooms = await Room.count({ where: { roomStateId: ROOM_STATES.OCCUPIED } })  // Habitaciones por estado
        const availableRooms = await Room.count({ where: { roomStateId: ROOM_STATES.AVAILABLE } })
        const cleaningRooms = await Room.count({ where: { roomStateId: ROOM_STATES.CLEANING } })
        const outOfServiceRooms = await Room.count({ where: { roomStateId: ROOM_STATES.OUT_OF_SERVICE } })  // Habitaciones fuera de servicio

        // Check-ins de hoy (confirmados y ya procesados)
        const todayCheckins = await Booking.count({
            where: {
                checkInDate: today,
                status: {
                    [Op.in]: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.CONFIRMED]
                }
            }
        })

        // Check-outs de hoy (ya procesados)
        const todayCheckouts = await Booking.count({
            where: {
                checkOutDate: today,
                status: BOOKING_STATUS.COMPLETED
            }
        })

        // Check-ins pendientes de hoy (confirmados pero no procesados)
        const pendingCheckins = await Booking.count({
            where: {
                checkInDate: today,
                status: BOOKING_STATUS.CONFIRMED
            }
        })

        // Check-outs pendientes de hoy (en checked_in)
        const pendingCheckouts = await Booking.count({
            where: {
                checkOutDate: today,
                status: BOOKING_STATUS.IN_PROGRESS
            }
        })

        return {
            totalRooms,
            occupiedRooms,
            availableRooms,
            cleaningRooms,
            outOfServiceRooms,
            todayCheckins,
            todayCheckouts,
            pendingCheckins,
            pendingCheckouts,
            lastUpdate: new Date().toLocaleTimeString()
        }

    } catch (error) {
        throw createError(receptionistMessages.errors.dashboardStatsError, 500)
    }
}

module.exports = {
    getTodayCheckIns,
    getTodayCheckOuts,
    processCheckIn,
    processCheckOut,
    getDashboardStats
}