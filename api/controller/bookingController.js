const { getAvailableRooms, createBooking, getBookingById, getUserBookings, cancelBooking, updateBooking, cancelUnpaidBookings } = require('../services/bookingService')
const { booking: bookingMessages } = require('../utils/messages')
const Room = require('../models/Room')

const searchAvailableRooms = async (req, res, next) => {
    const { checkInDate, checkOutDate, guests } = req.query
    const numGuests = guests ? parseInt(guests) : 1   //Cantidad mínima de huéspedes por defecto

    try {
        const availableRooms = await getAvailableRooms(checkInDate, checkOutDate, numGuests)

        res.status(200).json({
            success: true,
            message: bookingMessages.roomsFetched,
            data: {
                rooms: availableRooms.map(room => ({
                    id: room.id,
                    name: room.name,
                    description: room.description,
                    type: room.type,
                    capacity: room.capacity,
                    price: room.price,
                    size: room.size,
                    beds: room.beds,
                    amenities: room.amenities,
                    images: room.images,
                    available: room.available
                })),

                total: availableRooms.length
            }
        })

    } catch (error) {
        next(error)
    }
}

const getRoomById = async (req, res, next) => {
    const { roomId } = req.params

    try {
        const room = await Room.findByPk(roomId)
        if (!room) {
            return res.status(404).json({
                success: false,
                message: bookingMessages.errors.roomNotFound
            })
        }

        res.status(200).json({
            success: true,
            message: bookingMessages.room.success,
            data: {
                room: {
                    id: room.id,
                    name: room.name,
                    description: room.description,
                    type: room.type,
                    capacity: room.capacity,
                    price: room.price,
                    size: room.size,
                    beds: room.beds,
                    amenities: room.amenities,
                    images: room.images,
                    available: room.available
                }
            }
        })

    } catch (error) {
        next(error)
    }
}

const createNewBooking = async (req, res, next) => {
    const userId = req.user.id
    const { roomId, checkInDate, checkOutDate, guests } = req.body

    try {
        const bookingData = { roomId, checkInDate, checkOutDate, guests }
        const result = await createBooking(userId, bookingData)

        res.status(201).json({
            success: true,
            message: bookingMessages.success,
            data: result.booking
        })

    } catch (error) {
        next(error)
    }
}

const getUserBookingsList = async (req, res, next) => {
    const userId = req.user.id
    const { status } = req.query

    try {
        const bookings = await getUserBookings(userId, status)

        res.status(200).json({
            success: true,
            message: bookingMessages.bookingsFetched,
            data: {
                bookings: bookings.map(booking => ({
                    id: booking.id,
                    confirmationCode: booking.confirmationCode,
                    room: booking.room,
                    checkInDate: booking.checkInDate,
                    checkOutDate: booking.checkOutDate,
                    guests: booking.guests,
                    totalPrice: booking.totalPrice,
                    status: booking.status,
                    paymentStatus: booking.paymentStatus,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
                })),

                total: bookings.length
            }
        })

    } catch (error) {
        next(error)
    }
}

const getBookingDetails = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        const booking = await getBookingById(id, userId)

        res.status(200).json({
            success: true,
            message: bookingMessages.bookingFetched,
            data: {
                booking: {
                    id: booking.id,
                    confirmationCode: booking.confirmationCode,
                    user: booking.user,
                    room: booking.room,
                    checkInDate: booking.checkInDate,
                    checkOutDate: booking.checkOutDate,
                    guests: booking.guests,
                    totalPrice: booking.totalPrice,
                    status: booking.status,
                    paymentStatus: booking.paymentStatus,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
                }
            }
        })

    } catch (error) {
        next(error)
    }
}

const cancelUserBooking = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        const result = await cancelBooking(id, userId)

        res.status(200).json({
            success: true,
            message: result.message,
            data: {
                booking: {
                    id: result.data.booking.id,
                    confirmationCode: result.data.booking.confirmationCode,
                    status: result.data.booking.status,
                    updatedAt: result.data.booking.updatedAt
                }
            }
        })

    } catch (error) {
        next(error)
    }
}

const downloadReceipt = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id

    try {
        const booking = await getBookingById(id, userId)

        if (booking.paymentStatus !== 'Pagado') {
            return res.status(400).json({
                success: false,
                message: 'El comprobante solo está disponible para reservas pagadas'
            })
        }

        const receiptContent = 
        `     
        =======================================
            COMPROBANTE DE PAGO - HOTELDESK
        =======================================

        CÓDIGO DE RESERVA: ${booking.confirmationCode}
        ESTADO: ${booking.status} - ${booking.paymentStatus}
        FECHA: ${new Date(booking.createdAt).toLocaleDateString('es-ES')}

        DETALLES DEL HUESPED:
        ------------------------------------
        Nombre: ${booking.user.name} ${booking.user.lastName || ''}
        Email: ${booking.user.email}
 
        DETALLES DE LA RESERVA:
        ------------------------------------
        Habitación: ${booking.room.name}
        Tipo: ${booking.room.type}
        Capacidad: ${booking.room.capacity} personas

        Check-in: ${new Date(booking.checkInDate).toLocaleDateString('es-ES')}
        Check-out: ${new Date(booking.checkOutDate).toLocaleDateString('es-ES')}
        Huéspedes: ${booking.guests}

        DETALLES DE PAGO:
        ------------------------------------
        Monto Total: $${booking.totalPrice}
        Método de Pago: Tarjeta de Crédito/Débito
        Estado del Pago: ${booking.paymentStatus}

        ====================================
                Gracias por su reserva
                HotelDesk Management
        ====================================
        `.trim()

        //Configuración de los headers para descargar el archivo
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Content-Disposition', `attachment; filename="comprobante_pago_${booking.confirmationCode}.txt"`)
        res.send(receiptContent)  //Envía el contenido del recibo

    } catch (error) {
        next(error)
    }
}

const runAutomaticCancellation = async (req, res, next) => {
    try {
        const result = await cancelUnpaidBookings()

        res.status(200).json({
            success: true,
            message: result.message,
            data: {
                totalCancelled: result.totalCancelled
            }
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    searchAvailableRooms,
    getRoomById,
    createNewBooking,
    getUserBookingsList,
    getBookingDetails,
    cancelUserBooking,
    runAutomaticCancellation,
    downloadReceipt
}