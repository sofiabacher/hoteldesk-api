const Role = require('../models/Role')
const User = require('../models/User')
const UserRole = require('../models/UserRole')
const Permission = require('../models/Permission')
const RolePermission = require('../models/RolePermission')

const { Op } = require('sequelize')
const { createError } = require('../utils/helpers/errorHelper')
const { admin: adminMessages, roles: roleMessages } = require('../utils/messages')
const { LOG_ACTIONS } = require('../utils/constants')
const logger = require('../utils/logger')

const SYSTEM_ROLES = ['admin', 'guest', 'recepcionist', 'cleaning']

const getAllRoles = async () => {
    try {
        const roles = await Role.findAll({
            include: [
                {
                    model: Permission,
                    as: 'Permissions',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: User,
                    as: 'Users',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['id', 'ASC']]
        })

        return roles.map(role => ({
            ...role.toJSON(),
            isSystemRole: SYSTEM_ROLES.includes(role.name.toLowerCase()),
            userCount: role.Users ? role.Users.length : 0,
            permissionCount: role.Permissions ? role.Permissions.length : 0
        }))

    } catch (error) {
        throw createError(roleMessages.errors.fetching, 500)
    }
}

const createRole = async (roleData, userId = null) => {
    const { name, description, permissions = [] } = roleData

    try {
        // Verificar que no exista un rol con el mismo nombre
        const existingRole = await Role.findOne({ where: { name: name.trim() } })
        if (existingRole) throw createError(roleMessages.errors.duplicateName, 400)

        // Verificar que no sea un rol del sistema
        if (SYSTEM_ROLES.includes(name.trim().toLowerCase())) {
            throw createError(roleMessages.errors.systemRoleCreation, 400)
        }

        const newRole = await Role.create({
            name: name.trim(),
            description: description ? description.trim() : null
        })

        // Asignar permisos si se proporcionaron
        if (permissions.length > 0) {
            try {
                const rolePermissions = permissions.map(permissionId => ({
                    roleId: newRole.id,
                    permissionId,
                    dvh: null
                }))

                const createdPermissions = await RolePermission.bulkCreate(rolePermissions)
    
            } catch (permError) {
                throw createError(roleMessages.errors.permissionAssignment + ': ' + permError.message, 500)
            }
        }

        await logger(
            userId,
            LOG_ACTIONS.ROLE_CREATED.message,
            `Rol creado: ${newRole.name} con ${permissions.length} permisos`,
            LOG_ACTIONS.ROLE_CREATED.criticity
        )

        // Obtener el rol con sus asociaciones para devolverlo con el formato correcto
        const roleWithAssociations = await Role.findByPk(newRole.id, {
            include: [
                {
                    model: Permission,
                    as: 'Permissions',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'description']
                }
                // Temporalmente excluimos Users para evitar el error con userStateId
            ]
        })

        if (!roleWithAssociations) {
            throw createError(roleMessages.errors.creationFailed, 500)
        }

        const roleData = roleWithAssociations.toJSON()
        return {
            ...roleData,
            isSystemRole: SYSTEM_ROLES.includes(roleData.name.toLowerCase()),
            userCount: 0,
            permissionCount: roleData.Permissions ? roleData.Permissions.length : 0
        }

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.ROLE_CREATE_FAILED.message,
            `Error al crear rol ${name}: ${error.message}`,
            LOG_ACTIONS.ROLE_CREATE_FAILED.criticity
        )

        throw error
    }
}

const updateRole = async (roleId, roleData, userId = null) => {
    const { name, description, permissions = [] } = roleData

    try {
        const role = await Role.findByPk(roleId)
        if (!role) throw createError(roleMessages.errors.notFound, 404)

        if (SYSTEM_ROLES.includes(role.name.toLowerCase())) {
            throw createError(roleMessages.errors.systemRoleModification, 400)
        }

        if (name && name.trim() !== role.name) {
            const existingRole = await Role.findOne({
                where: {
                    name: name.trim(),
                    id: { [Op.ne]: roleId }
                }
            })

            if (existingRole) throw createError(roleMessages.errors.duplicateName, 400)
        }

        const oldName = role.name
        const newName = name ? name.trim() : role.name
        
        await role.update({   // Actualizar datos del rol
            name: newName,
            description: description !== undefined ? (description ? description.trim() : null) : role.description
        })

        // Actualizar permisos si se proporcionaron
        if (permissions.length >= 0) {
            await RolePermission.destroy({ where: { roleId } })   //Eliminar permisos actuales

            if (permissions.length > 0) {  // Asignar nuevos permisos
                const rolePermissions = permissions.map(permissionId => ({
                    roleId,
                    permissionId,
                    dvh: null
                }))

                await RolePermission.bulkCreate(rolePermissions)
            }
        }

        await logger(
            userId,
            LOG_ACTIONS.ROLE_UPDATED.message,
            `Rol actualizado: ${oldName} -> ${newName} con ${permissions.length} permisos`,
            LOG_ACTIONS.ROLE_UPDATED.criticity
        )

        return role

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.ROLE_UPDATE_FAILED.message,
            `Error al actualizar rol ${roleId}: ${error.message}`,
            LOG_ACTIONS.ROLE_UPDATE_FAILED.criticity
        )

        throw error
    }
}

const deleteRole = async (roleId, userId = null) => {
    try {
        const role = await Role.findByPk(roleId)
        if (!role) throw createError(roleMessages.errors.notFound, 404)

        if (SYSTEM_ROLES.includes(role.name.toLowerCase())) {
            throw createError(roleMessages.errors.systemRoleDeletion, 400)
        }

        // Verificar que no haya usuarios asignados
        const userRolesCount = await UserRole.count({ where: { roleId } })
        if (userRolesCount > 0) throw createError(roleMessages.errors.hasUsers, 400)

        const roleName = role.name
        await role.destroy()  // Eliminar el rol

        await logger(
            userId,
            LOG_ACTIONS.ROLE_DELETED.message,
            `Rol eliminado: ${roleName}`,
            LOG_ACTIONS.ROLE_DELETED.criticity
        )

        return true

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.ROLE_DELETE_FAILED.message,
            `Error al eliminar rol ${roleId}: ${error.message}`,
            LOG_ACTIONS.ROLE_DELETE_FAILED.criticity
        )

        throw error
    }
}

const getRoleUsers = async (roleId) => {
    try {
        const role = await Role.findByPk(roleId, {
            include: [
                {
                    model: User,
                    as: 'Users',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'email', 'userStateId']
                }
            ]
        })

        if (!role)  throw createError(roleMessages.errors.notFound, 404)

        return role.Users || []

    } catch (error) {
        throw error
    }
}

const assignRoleToUser = async (userId, roleId, adminUserId = null) => {
    try {
        // Verificar que existan el usuario y el rol
        const [user, role] = await Promise.all([
            User.findByPk(userId),
            Role.findByPk(roleId)
        ])

        if (!user) throw createError(roleMessages.errors.userNotFound, 404)
        if (!role) throw createError(roleMessages.errors.notFound, 404)

        // Verificar que el usuario no tenga ya este rol
        const existingUserRole = await UserRole.findOne({ where: { userId, roleId } })
        if (existingUserRole) throw createError(roleMessages.errors.userAlreadyHasRole, 400)

        // Asignar el rol
        await UserRole.create({
            userId,
            roleId,
            dvh: null
        })

        await logger(
            adminUserId,
            LOG_ACTIONS.ROLE_ASSIGNED.message,
            `Rol asignado: ${role.name} al usuario ${user.name} (${user.email})`,
            LOG_ACTIONS.ROLE_ASSIGNED.criticity
        )

        return true

    } catch (error) {
        await logger(
            adminUserId,
            LOG_ACTIONS.ROLE_ASSIGN_FAILED.message,
            `Error al asignar rol ${roleId} al usuario ${userId}: ${error.message}`,
            LOG_ACTIONS.ROLE_ASSIGN_FAILED.criticity
        )

        throw error
    }
}

const removeRoleFromUser = async (userId, roleId, adminUserId = null) => {
    try {
        const [user, role] = await Promise.all([
            User.findByPk(userId),
            Role.findByPk(roleId)
        ])

        const deletedCount = await UserRole.destroy({ where: { userId, roleId } })
        if (deletedCount === 0) throw createError(roleMessages.errors.userDoesNotHaveRole, 400)
        
        await logger(
            adminUserId,
            LOG_ACTIONS.ROLE_REMOVED.message,
            `Rol eliminado: ${role?.name || roleId} del usuario ${user?.name || userId} (${user?.email || ''})`,
            LOG_ACTIONS.ROLE_REMOVED.criticity
        )

        return true

    } catch (error) {
        await logger(
            adminUserId,
            LOG_ACTIONS.ROLE_REMOVE_FAILED.message,
            `Error al eliminar rol ${roleId} del usuario ${userId}: ${error.message}`,
            LOG_ACTIONS.ROLE_REMOVE_FAILED.criticity
        )

        throw error
    }
}

const getUsersForRoleAssignment = async () => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'userStateId'],
            where: {
                userStateId: 1 // Solo usuarios activos
            },
            include: [
                {
                    model: Role,
                    as: 'Roles',
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                }
            ],
            order: [['id', 'ASC']]
        })

        return users

    } catch (error) {
        throw createError(roleMessages.errors.fetchingAvailableUsers, 500)
    }
}

module.exports = {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
    getRoleUsers,
    assignRoleToUser,
    removeRoleFromUser,
    getUsersForRoleAssignment
}