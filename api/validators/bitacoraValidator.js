const { body, query } = require('express-validator')

const bitacoraFiltersRules = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('La fecha de inicio debe ser una fecha válida (ISO 8601)')
        .custom((value, { req }) => {
            if (value && req.query.endDate && new Date(value) > new Date(req.query.endDate)) {
                throw new Error('La fecha de inicio no puede ser posterior a la fecha de fin')
            }
            return true
        }),

    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('La fecha de fin debe ser una fecha válida (ISO 8601)'),

    // Validaciones para paginación
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número entero mayor a 0')
        .toInt(),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('El límite debe ser un número entre 1 y 100')
        .toInt(),

    query('format')
        .optional()
        .isIn(['csv'])
        .withMessage('El formato de descarga debe ser "csv"')
]

module.exports = {
    bitacoraFiltersRules
}