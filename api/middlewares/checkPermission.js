const { User } = require('../models')
const { createError } = require('../utils/helpers/errorHelper')
const { auth: authMessages } = require('../utils/messages')

const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {   //Verifica que el usuario esté autenticado
                throw createError(authMessages.errors.tokenRequired, 401)
            }

            const user = await User.findByPk(req.user.id)  //Obtener el usuario completo con sus relaciones
            if (!user)  throw createError(authMessages.errors.userNotFound, 404)

            // Verificar si el usuario tiene el permiso requerido
            const hasPermission = await user.hasPermission(permissionName)
            if (!hasPermission) throw createError(authMessages.errors.accessDenied, 403)

            next()  //Si tiene el permiso, continuar con la siguiente función

        } catch (error) {
            next(error)
        }
    }
}

module.exports = checkPermission
