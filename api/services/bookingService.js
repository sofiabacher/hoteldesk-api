const Room = require('../models/Room')
const User = require('../models/User')
const Booking = require('../models/Booking')
const logger = require('../utils/logger')

const { createError } = require('../utils/helpers/errorHelper')
const { Op } = require('sequelize')   //Trae los operadores para hacer consulta complejas a la BD
const { sendCancellationEmail } = require('./mailService/senders')
const { booking: bookingMessages, room: roomMessages, login: loginMessages } = require('../utils/messages')
const { BOOKING_STATUS, PAYMENT_STATUS, LOG_ACTIONS, ROOM_STATES } = require('../utils/constants')


const generateConfirmationCode = () => {   //Genera código de reserva único
    return `HTL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 3).toUpperCase()}`
}

const calculateBookingTotal = (checkInDate, checkOutDate, pricePerNight) => {
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))

    return {
        nights,
        totalPrice: pricePerNight * nights
    }
}

const checkRoomAvailability = async (roomId, checkInDate, checkOutDate) => {  //Verifica disponiblidad de la hbitación por fechas
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
        throw createError(400, bookingMessages.invalidDates)
    }

    const whereClause = {   //WhereClause --> define condiciones q deben tener los registros
        roomId,
        status: { [Op.in]: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED] },
        [Op.and]: [
            { checkInDate: { [Op.lt]: checkOutDate } },   //Reserva existente empieza antes del checkout solicitado (<)
            { checkOutDate: { [Op.gt]: checkInDate } }   //Reserva existente termina después del checkin solicitado (>) 
        ]
    } //Para detectar si existe alguna reserva en esa habitación en esas fechas

    const existingBooking = await Booking.findAll({ where: whereClause })  //Busca reserva con esas condiciones, si cumple NO esta libre
    return existingBooking.length === 0
}

const getAvailableRooms = async (checkInDate, checkOutDate, guests = 1) => {  //Busca habitaciones disponibles
    const rooms = await Room.findAll({
        where: {
            roomStateId: ROOM_STATES.AVAILABLE,  //Solo habitaciones con estado "Disponible"
            capacity: { [Op.gte]: guests }   //capacity >= guests
        },
        order: [['price', 'ASC']]   //Ordena por precio más bajo
    })

    const availableRooms = []  //Guardar las habitaciones disponibles
    for (const room of rooms) {
        const isAvailable = await checkRoomAvailability(room.id, checkInDate, checkOutDate)

        if (isAvailable) {
            availableRooms.push(room)   //Agrega habitación al final del array
        }
    }

    return availableRooms
}

const createBooking = async (userId, bookingData) => {
    const { roomId, checkInDate, checkOutDate, guests } = bookingData

    try {
        const user = await User.findByPk(userId)
        if (!user) { throw createError(loginMessages.errors.notFound, 404) }

        const room = await Room.findByPk(roomId)
        if (!room) { throw createError(roomMessages.errors.notFound, 404) }
        if (room.capacity < guests) { throw createError(bookingMessages.errors.insufficientCapacity, 400) }

        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (checkIn < today) { throw createError(bookingMessages.errors.pastDates, 400) }
        if (checkIn >= checkOut) { throw createError(bookingMessages.errors.checkInAfterCheckOut, 400) }

        const isAvailable = await checkRoomAvailability(roomId, checkInDate, checkOutDate)
        if (!isAvailable) { throw createError(bookingMessages.errors.datesUnavailable, 409) }

        const { nights, totalPrice } = calculateBookingTotal(checkInDate, checkOutDate, room.price)
        const confirmationCode = generateConfirmationCode()

        const newBooking = await Booking.create({
            userId,
            roomId,
            checkInDate,
            checkOutDate,
            guests,
            totalPrice,
            status: BOOKING_STATUS.PENDING,
            paymentStatus: PAYMENT_STATUS.PENDING,
            confirmationCode
        })

        await Promise.all[(
            room.update({ roomStateId: 2 }),

            logger(
                userId,
                LOG_ACTIONS.BOOKING_CREATED.message,
                `Reserva: ${confirmationCode} - Habitación ${room.name} ocupada - ${nights} noches - Total: $${totalPrice}`,
                LOG_ACTIONS.BOOKING_CREATED.criticity
            )
        )]

        return {
            success: true,
            booking: {
                id: newBooking.id,
                confirmationCode: newBooking.confirmationCode,
                room: {
                    id: room.id,
                    name: room.name,
                    type: room.type,
                    capacity: room.capacity,
                    price: room.price
                },
                checkInDate: newBooking.checkInDate,
                checkOutDate: newBooking.checkOutDate,
                guests: newBooking.guests,
                nights,
                totalPrice: newBooking.totalPrice,
                status: newBooking.status,
                paymentStatus: newBooking.paymentStatus,
                createdAt: newBooking.createdAt
            }
        }

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.BOOKING_FAILED.message,
            `Error al crear reserva del usuario ${userId}: ${error.message}`,
            LOG_ACTIONS.BOOKING_FAILED.criticity
        )

        throw error
    }
}

const getBookingById = async (bookingId, userId = null) => {   //Obtener reserva por ID
    const booking = await Booking.findByPk(bookingId, {
        include: [
            {
                model: Room,
                as: 'room',
                attributes: ['id', 'name', 'type', 'capacity', 'price', 'size', 'beds', 'images']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastName', 'email']
            }
        ]
    })

    if (!booking) { throw createError(bookingMessages.errors.bookingNotFound, 404) }

    if (userId && booking.userId !== userId) {  //Comprueba que la reserva le corresponda al userId enviado
        throw createError(bookingMessages.errors.unauthorizedAccess, 403)
    }

    return booking
}

const getUserBookings = async (userId, status = null) => {    //Obtener todas las reservas y se puede filtar pot "estado"
    const whereClause = { userId }
    if (status) { whereClause.status = status }  //Agrega el estado a la conuslta si se envio

    const bookings = await Booking.findAll({
        where: whereClause,
        include: [
            {
                model: Room,
                as: 'room',
                attributes: ['id', 'name', 'type', 'capacity', 'price', 'images']
            }
        ],
        order: [['createdAt', 'DESC']]
    })

    return bookings
}

const cancelUnpaidBookings = async () => {
    try {
        const cutoffTime = new Date()
        cutoffTime.setHours(cutoffTime.getHours() - 24)   //Fecha actual menos 24 horas

        const unpaidBookings = await Booking.findAll({   //Buscar todas las reservas pendientes de pago creadas hace más de 24 horas
            where: {
                status: BOOKING_STATUS.PENDING,
                paymentStatus: PAYMENT_STATUS.PENDING,
                createdAt: {
                    [Op.lt]: cutoffTime
                }
            },
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'name', 'roomStateId', 'price']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'lastName', 'email']
                }
            ]
        })

        if (unpaidBookings.length === 0) {
            return {
                success: true,
                message: 'No se encontraron reservas para cancelar automáticamente',
                cancelledBookings: []
            }
        }

        for (const booking of unpaidBookings) {  // Cancelar todas las reservas encontradas
            booking.status = BOOKING_STATUS.CANCELLED
            booking.paymentStatus = PAYMENT_STATUS.FAILED

            if (booking.room.roomStateId === ROOM_STATES.OCCUPIED) {   //Actuliza la habitación a disponible si estaba ocupada
                await booking.room.update({ roomStateId: ROOM_STATES.AVAILABLE })
            }

            await Promise.all([
                booking.save(),

                sendCancellationEmail(booking.user.email, {
                    userName: `${booking.user.name} ${booking.user.lastName}`,
                    confirmationCode: booking.confirmationCode,
                    roomName: booking.room.name,
                    checkInDate: booking.checkInDate,
                    checkOutDate: booking.checkOutDate,
                    guests: booking.guests,
                    totalPrice: booking.totalPrice,
                    userId: booking.user.id,
                    isAutomaticCancellation: true
                }),

                logger(
                    booking.userId,
                    LOG_ACTIONS.BOOKING_AUTO_CANCELLED.message,
                    `Reserva: ${booking.confirmationCode} cancelada automáticamente por falta de pago - Habitación: ${booking.room.name} - Monto: $${booking.totalPrice}`,
                    LOG_ACTIONS.BOOKING_AUTO_CANCELLED.criticity
                )
            ])
        }

        return {
            success: true,
            message: `Se cancelaron automáticamente ${unpaidBookings.length} reservas por falta de pago`,
            totalCancelled: unpaidBookings.length
        }

    } catch (error) {
        await logger(
            'Sistema',
            LOG_ACTIONS.BOOKING_CANCELLATION_FAILED.message,
            `Error al cancelar automáticamente reservas pendientes de pago: ${error.message}`,
            LOG_ACTIONS.BOOKING_CANCELLATION_FAILED.criticity
        )

        throw error
    }
}

const cancelBooking = async (bookingId, userId) => {
    try {
        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'name', 'roomStateId', 'price']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'lastName', 'email']
                }
            ]
        })

        if (!booking) { throw createError(bookingMessages.errors.bookingNotFound, 404) }
        if (booking.userId !== userId) { throw createError(bookingMessages.errors.unauthorizedAccess, 403) }

        if (booking.status === BOOKING_STATUS.CANCELLED) {
            throw createError(bookingMessages.errors.cancelledBooking, 400)
        }

        if (booking.status === BOOKING_STATUS.COMPLETED) {
            throw createError(bookingMessages.errors.cannotUpdateCompleted, 400)
        }

        if (booking.status === BOOKING_STATUS.IN_PROGRESS) {
            throw createError(bookingMessages.errors.cannotUpdateInProgress, 400)
        }

        const previousStatus = booking.status
        const previousRoomState = booking.room.roomStateId

        booking.status = BOOKING_STATUS.CANCELLED

        let roomUpdatePromise = Promise.resolve()
        if (previousRoomState === ROOM_STATES.OCCUPIED) {   //Actualiza la habitación a disponible si estaba ocupada
            roomUpdatePromise = booking.room.update({ roomStateId: ROOM_STATES.AVAILABLE })
        }

        const emailPromise = sendCancellationEmail(booking.user.email, {
            userName: `${booking.user.name} ${booking.user.lastName}`,
            confirmationCode: booking.confirmationCode,
            roomName: booking.room.name,
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
            guests: booking.guests,
            totalPrice: booking.totalPrice,
            userId: userId
        })

        await Promise.all([
            booking.save(),
            roomUpdatePromise,
            emailPromise,

            logger(
                userId,
                LOG_ACTIONS.BOOKING_CANCELLED.message,
                `Reserva: ${booking.confirmationCode} - Estado anterior: ${previousStatus} - Pago: ${booking.paymentStatus} - Habitación: ${booking.room.name}`,
                LOG_ACTIONS.BOOKING_CANCELLED.criticity
            )
        ])

        return {
            success: true,
            message: bookingMessages.bookingCancelled,
            data: {
                booking: {
                    id: booking.id,
                    confirmationCode: booking.confirmationCode,
                    status: booking.status,
                    paymentStatus: booking.paymentStatus,
                    updatedAt: booking.updatedAt
                }
            }
        }

    } catch (error) {
        await logger(
            userId || 'anonymous',
            LOG_ACTIONS.BOOKING_CANCELLATION_FAILED.message,
            `Error al cancelar la reserva ${booking.confirmationCode}: ${error.message}`,
            LOG_ACTIONS.BOOKING_CANCELLATION_FAILED.criticity
        )

        throw error
    }
}

module.exports = {
    generateConfirmationCode,
    getAvailableRooms,
    createBooking,
    getBookingById,
    getUserBookings,
    cancelBooking,
    cancelUnpaidBookings
}