const { body, param } = require('express-validator')

// Validar ID de reserva (para check-in y check-out)
const bookingIdRules = [
    param('bookingId').isNumeric().withMessage('El ID de reserva debe ser numérico')
]

// Validar datos de check-out
const checkoutRules = [
    param('bookingId').isNumeric().withMessage('El ID de reserva debe ser numérico'),
    body('notes').optional().isString().withMessage('Las notas deben ser texto'),
    body('additionalCharges').optional().isNumeric().withMessage('Los cargos adicionales deben ser numéricos')
        .isFloat({ min: 0 }).withMessage('Los cargos adicionales no pueden ser negativos')
]

// Validar filtros de búsqueda (opcional)
const searchRules = [
    body('searchTerm').optional().isString().withMessage('El término de búsqueda debe ser texto'),
    body('filterStatus').optional().isIn(['all', 'pending', 'confirmed', 'processing', 'completed', 'cancelled'])
        .withMessage('Estado de filtro inválido')
]

module.exports = {
    bookingIdRules,
    checkoutRules,
    searchRules
}