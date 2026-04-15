const { body, param, query } = require('express-validator')
const { validation: validationMessages } = require('../utils/messages')

const bookingCreationRules = [
    body('roomId')
        .notEmpty()
        .withMessage(validationMessages.idRoomRequired)
        .isInt({ min: 1 })
        .withMessage(validationMessages.idNotNegative),

    body('checkInDate')
        .notEmpty()
        .withMessage(validationMessages.checkInRequired)
        .isISO8601()
        .withMessage(validationMessages.dateFormatInvalid),

    body('checkOutDate')
        .notEmpty()
        .withMessage(validationMessages.checkOutRequired)
        .isISO8601()
        .withMessage(validationMessages.dateFormatInvalid),

    body('guests')
        .notEmpty()
        .withMessage(validationMessages.guestRequired)
        .isInt({ min: 1, max: 10 })
]

const bookingSearchRules = [
    query('checkInDate')
        .optional()
        .isISO8601()
        .withMessage(validationMessages.dateFormatInvalid),

    query('checkOutDate')
        .optional()
        .isISO8601()
        .withMessage(validationMessages.dateFormatInvalid),

    query('guests')
        .optional()
        .isInt({ min: 1, max: 10 })
        
]

const bookingIdRules = [
    param('id')
        .notEmpty()
        .withMessage(validationMessages.idBookingRequired)
        .isInt({ min: 1 })
        .withMessage(validationMessages.idNotNegative)
]

const roomIdRules = [
    param('roomId')
        .notEmpty()
        .withMessage(validationMessages.idRoomRequired)
        .isInt({ min: 1 })
        .withMessage(validationMessages.idNotNegative)
]

const bookingStatusRules = [
    query('status')
        .optional()
        .isIn(['Pendiente', 'Confirmada', 'Cancelada', 'Completada'])
        .withMessage('Estado de reserva inválido')
]

module.exports = {
    bookingCreationRules,
    bookingSearchRules,
    bookingIdRules,
    roomIdRules,
    bookingStatusRules
} 