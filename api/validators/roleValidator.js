const { body, param } = require('express-validator')

const roleRules = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre del rol es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre del rol debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-Z0-9\s_-]+$/)
        .withMessage('El nombre del rol solo puede contener letras, números, espacios, guiones y guiones bajos'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('La descripción no puede exceder los 200 caracteres'),

    body('permissions')
        .optional()
        .isArray()
        .withMessage('Los permisos deben ser un array')
        .custom((permissions) => {
            if (permissions && permissions.length > 0) {
                for (const permissionId of permissions) {
                    if (!Number.isInteger(permissionId) || permissionId <= 0) {
                        throw new Error('Cada permiso debe ser un número entero positivo')
                    }
                }
            }
            return true
        })
]

const roleIdRules = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID del rol debe ser un número entero positivo')
        .toInt()
]

module.exports = {
    roleRules,
    roleIdRules
}