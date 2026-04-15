const User = require('../models/User')
const Role = require('../models/Role')
const { createError } = require('../utils/helpers/errorHelper')
const messages = require('../utils/messages')

const { USER_STATES } = require('../utils/constants')
const { verifySessionToken } = require('../utils/token')

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']   //Obtiene token del encabezado authorization
        if (!authHeader || !authHeader.startsWith('Bearer '))   throw createError('No hay token de autorización', 401)

        const token = authHeader.split(' ')[1]
        if (!token) throw createError(messages.token.noAuthorizationToken, 401)

        const { valid, payload } = verifySessionToken(token)
        if (!valid) throw createError(messages.token.invalidOrExpiredToken, 401)

        const user = await User.findByPk(payload.id, {   //Busca el usuario con sus roles
            include: { model: Role, through: { attributes: [] }, attributes: ['name'] }   //Evita mostrar los datos en la tabla intermedia user_roles
        })

        if (!user) throw createError(messages.login.errors.notFound, 404)

        if (user.userStateId !== USER_STATES.ACTIVE) {  //Verifica que el usuario esté activo
            if (user.userStateId === USER_STATES.DELETED) {
                const deletedError = createError('Tu cuenta ha sido eliminada del sistema.', 423)
                deletedError.code = 'USER_DELETED'
                deletedError.userState = 'deleted'
                throw deletedError

            } else {
                throw createError(messages.login.errors.inactive, 403)
            }
        }

        req.user = {
            id: user.id,
            email: user.email,
            roles: user.Roles.map(r => r.name),
            primaryRole: payload.primaryRole
        }

        next()

    } catch (error) {
        next(error)
    }
}

module.exports = isAuth