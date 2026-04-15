const {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    getRoleUsers,
    assignRoleToUser,
    removeRoleFromUser,
    getUsersForRoleAssignment
} = require('../services/roleService')
const { admin: adminMessages } = require('../utils/messages')

/**
 * Obtiene todos los roles
 */
const getRoles = async (req, res, next) => {
    try {
        const roles = await getAllRoles()

        res.status(200).json({
            success: true,
            data: roles,
            message: 'Roles obtenidos correctamente'
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Crea un nuevo rol (solo roles personalizados)
 */
const createNewRole = async (req, res, next) => {
    const { name, description, permissions } = req.body
    const userId = req.user?.id

    try {
        const newRole = await createRole({ name, description, permissions }, userId)

        res.status(201).json({
            success: true,
            data: newRole,
            message: 'Rol creado correctamente'
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Actualiza un rol existente (solo roles personalizados)
 */
const updateExistingRole = async (req, res, next) => {
    const { id } = req.params
    const { name, description, permissions } = req.body
    const userId = req.user?.id

    try {
        const updatedRole = await updateRole(id, { name, description, permissions }, userId)

        res.status(200).json({
            success: true,
            data: updatedRole,
            message: 'Rol actualizado correctamente'
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Elimina un rol (solo roles personalizados)
 */
const deleteExistingRole = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user?.id

    try {
        await deleteRole(id, userId)

        res.status(200).json({
            success: true,
            message: 'Rol eliminado correctamente'
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Obtiene los usuarios asignados a un rol
 */
const getUsersByRole = async (req, res, next) => {
    const { id } = req.params

    try {
        const users = await getRoleUsers(id)

        res.status(200).json({
            success: true,
            data: users,
            message: 'Usuarios del rol obtenidos correctamente'
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Asigna un rol a un usuario
 */
const assignRole = async (req, res, next) => {
    const { userId, roleId } = req.body
    const adminUserId = req.user?.id

    try {
        await assignRoleToUser(userId, roleId, adminUserId)

        res.status(200).json({
            success: true,
            message: 'Rol asignado al usuario correctamente'
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Elimina un rol de un usuario
 */
const removeRole = async (req, res, next) => {
    const { userId, roleId } = req.body
    const adminUserId = req.user?.id

    try {
        await removeRoleFromUser(userId, roleId, adminUserId)

        res.status(200).json({
            success: true,
            message: 'Rol eliminado del usuario correctamente'
        })

    } catch (error) {
        next(error)
    }
}

/**
 * Obtiene usuarios disponibles para asignación de roles
 */
const getUsersForAssignment = async (req, res, next) => {
    try {
        const users = await getUsersForRoleAssignment()

        res.status(200).json({
            success: true,
            data: users,
            message: 'Usuarios obtenidos correctamente'
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getRoles,
    createNewRole,
    updateExistingRole,
    deleteExistingRole,
    getUsersByRole,
    assignRole,
    removeRole,
    getUsersForAssignment
}