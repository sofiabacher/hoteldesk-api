const Booking = require('../models/Booking')
const Room = require('../models/Room')
const User = require('../models/User')
const logger = require('../utils/logger')

const { BOOKING_STATUS, PAYMENT_STATUS, ROOM_STATES, LOG_ACTIONS } = require('../utils/constants')
const { payment: paymentMessages, update: updateMessages } = require('../utils/messages')
const { createError } = require('../utils/helpers/errorHelper')
const { sendPaymentConfirmationEmail } = require('./mailService/senders')

const processPayment = async (bookingId, userId) => {
    try {
        const booking = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'name', 'type', 'price']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'lastName', 'email']
                }
            ]
        })

        if (!booking) { throw createError(404, paymentMessages.errors.bookingNotFound) }
        if (booking.userId !== userId) { throw createError(403, paymentMessages.errors.unauthorizedAccess) }

        if (booking.status !== BOOKING_STATUS.PENDING) {
            if (booking.paymentStatus === PAYMENT_STATUS.PAID) { throw createError(400, paymentMessages.errors.bookingAlreadyPaid) }
            if (booking.status === BOOKING_STATUS.CANCELLED) { throw createError(400, paymentMessages.errors.bookingCancelled) }
            
            throw createError(400, paymentMessages.errors.invalidBookingStatus)
        }

        await booking.update({
            status: BOOKING_STATUS.CONFIRMED,
            paymentStatus: PAYMENT_STATUS.PAID
        })

        await booking.room.update({
            roomStateId: ROOM_STATES.OCCUPIED
        })

        await logger(
            userId,
            LOG_ACTIONS.PAYMENT_PROCESSED.message,
            `Pago de reserva ${booking.confirmationCode} - Habitación ${booking.room.name} - Monto: $${booking.totalPrice}`,
            LOG_ACTIONS.PAYMENT_PROCESSED.criticity
        )

        try {
            await sendPaymentConfirmationEmail(booking.user.email, {
                userId: booking.user.id,
                userName: `${booking.user.name} ${booking.user.lastName}`,
                confirmationCode: booking.confirmationCode,
                roomName: booking.room.name,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                guests: booking.guests,
                totalPrice: booking.totalPrice
            })

        } catch (emailError) {
            throw createError(paymentMessages.errors.emailFailed, 500)
        }

        return {
            success: true,
            message: paymentMessages.success,
            data: {
                booking: {
                    id: booking.id,
                    confirmationCode: booking.confirmationCode,
                    status: booking.status,
                    paymentStatus: booking.paymentStatus,
                    room: {
                        id: booking.room.id,
                        name: booking.room.name,
                        type: booking.room.type
                    },
                    totalPrice: booking.totalPrice,
                    paymentDate: booking.updatedAt
                }
            }
        }

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.PAYMENT_FAILED.message,
            `Error al pagar la reserva ${booking.confirmationCode} - Monto: $${booking.totalPrice}`,
            LOG_ACTIONS.PAYMENT_FAILED.criticity
        )

        throw error
    }
}

const getPaymentDetails = async (bookingId, userId) => {
    const booking = await Booking.findByPk(bookingId, {
        include: [
            {
                model: Room,
                as: 'room',
                attributes: ['id', 'name', 'type', 'price', 'size', 'beds']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastName', 'email']
            }
        ]
    })

    if (!booking) { throw createError(404, paymentMessages.errors.bookingNotFound) }
    if (booking.userId !== userId) { throw createError(403, paymentMessages.errors.unauthorizedAccess) }

    return {
        success: true,
        data: {
            booking: {
                id: booking.id,
                confirmationCode: booking.confirmationCode,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                guests: booking.guests,
                totalPrice: booking.totalPrice,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                room: booking.room,
                user: {
                    id: booking.user.id,
                    name: booking.user.name,
                    lastName: booking.user.lastName,
                    email: booking.user.email
                }
            }
        }
    }
}

module.exports = {
    processPayment,
    getPaymentDetails
}