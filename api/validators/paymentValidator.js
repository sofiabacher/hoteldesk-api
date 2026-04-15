const { body, param } = require('express-validator')
const { validation: validationMessages } = require('../utils/messages')

const paymentProcessingRules = [
    body('bookingId')
        .notEmpty()
        .withMessage(validationMessages.idBookingRequired)
        .isInt({ min: 1 })
        .withMessage(validationMessages.idNotNegative)
]

const bookingIdRules = [
    param('bookingId')
        .notEmpty()
        .withMessage('El ID de la reserva es requerido')
        .isInt({ min: 1 })
        .withMessage('El ID de la reserva debe ser un número entero positivo')
]
 
module.exports = { 
    paymentProcessingRules,
    bookingIdRules
}  