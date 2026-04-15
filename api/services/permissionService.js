const Permission = require('../models/Permission')
const Role = require('../models/Role')
const User = require('../models/User')
const RolePermission = require('../models/RolePermission')
const UserPermission = require('../models/UserPermission')

const { Op } = require('sequelize')
const { createError } = require('../utils/helpers/errorHelper')
const { admin: adminMessages, permissions: permissionMessages } = require('../utils/messages')
const { LOG_ACTIONS } = require('../utils/constants')
const logger = require('../utils/logger')

const SYSTEM_PERMISSIONS = ['admin.users.view','admin.users.edit','admin.users.delete','admin.roles.view',
    'admin.roles.create','admin.roles.edit','admin.roles.delete','admin.rooms.view','admin.rooms.create',
    'admin.rooms.edit','admin.rooms.delete','admin.bitacora.view','admin.reports.view','permissions.manage',
    'permissions.view','permissions.create','permissions.edit','permissions.delete','permissions.assign','permissions.remove'
]

const getAllPermissions = async () => {
    try {
        const permissions = await Permission.findAll({
            include: [
                {
                    model: Role,
                    as: 'Roles',
                    through: { attributes: [] },
                    attributes: ['id', 'name']
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

        return permissions.map(permission => ({
            ...permission.toJSON(),
            isSystemPermission: SYSTEM_PERMISSIONS.includes(permission.name),
            roleCount: permission.Roles ? permission.Roles.length : 0,
            userCount: permission.Users ? permission.Users.length : 0
        }))

    } catch (error) {
        throw createError(permissionMessages.errors.fetching, 500)
    }
}

const createPermission = async (permissionData, userId = null) => {
    const { name, description, module, action } = permissionData

    try {
        const existingPermission = await Permission.findOne({ where: { name: name.trim() } })  // Verificar que no exista un permiso con el mismo nombre
        if (existingPermission) throw createError(permissionMessages.errors.duplicateName, 400)
        
        // Verificar que no sea un permiso del sistema
        if (SYSTEM_PERMISSIONS.includes(name.trim())) throw createError(permissionMessages.errors.systemPermissionCreation, 400)

        const newPermission = await Permission.create({
            name: name.trim(),
            description: description ? description.trim() : null,
            module: module.trim(),
            action: action.trim()
        })

        await logger(
            userId,
            LOG_ACTIONS.PERMISSION_CREATED.message,
            `Permiso creado: ${newPermission.name} (${newPermission.module}.${newPermission.action})`,
            LOG_ACTIONS.PERMISSION_CREATED.criticity
        )

        // Obtener el permiso con sus asociaciones para devolverlo con el formato correcto
        const permissionWithAssociations = await Permission.findByPk(newPermission.id, {
            include: [
                {
                    model: Role,
                    as: 'Roles',
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'Users',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'email']
                }
            ]
        })

        if (!permissionWithAssociations) throw createError(permissionMessages.errors.creationFailed, 500)

        const permissionData = permissionWithAssociations.toJSON()
        return {
            ...permissionData,
            isSystemPermission: SYSTEM_PERMISSIONS.includes(permissionData.name.toLowerCase()),
            roleCount: permissionData.Roles ? permissionData.Roles.length : 0,
            userCount: permissionData.Users ? permissionData.Users.length : 0
        }

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.PERMISSION_CREATE_FAILED.message,
            `Error al crear permiso ${name}: ${error.message}`,
            LOG_ACTIONS.PERMISSION_CREATE_FAILED.criticity
        )

        throw error
    }
}

const updatePermission = async (permissionId, permissionData, userId = null) => {
    const { name, description, module, action, isActive } = permissionData

    try {
        const permission = await Permission.findByPk(permissionId)
        if (!permission) throw createError(permissionMessages.errors.notFound, 404)

        if (SYSTEM_PERMISSIONS.includes(permission.name.toLowerCase())) throw createError(permissionMessages.errors.systemPermissionModification, 400)

        if (name && name.trim() !== permission.name) {
            const existingPermission = await Permission.findOne({
                where: {
                    name: name.trim(),
                    id: { [Op.ne]: permissionId }
                }
            })

            if (existingPermission) throw createError(permissionMessages.errors.duplicateName, 400)
        }

        const oldName = permission.name
        const newName = name ? name.trim() : permission.name
        const newModule = module ? module.trim() : permission.module
        const newAction = action ? action.trim() : permission.action

        await permission.update({
            name: newName,
            description: description !== undefined ? (description ? description.trim() : null) : permission.description,
            module: newModule,
            action: newAction,
            isActive: isActive !== undefined ? isActive : permission.isActive
        })

        await logger(
            userId,
            LOG_ACTIONS.PERMISSION_UPDATED.message,
            `Permiso actualizado: ${oldName} -> ${newName} (${newModule}.${newAction})`,
            LOG_ACTIONS.PERMISSION_UPDATED.criticity
        )

        return permission

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.PERMISSION_UPDATE_FAILED.message,
            `Error al actualizar permiso ${permissionId}: ${error.message}`,
            LOG_ACTIONS.PERMISSION_UPDATE_FAILED.criticity
        )

        throw error
    }
}

const deletePermission = async (permissionId, userId = null) => {
    try {
        const permission = await Permission.findByPk(permissionId)
        if (!permission) throw createError(permissionMessages.errors.notFound, 404)

        if (SYSTEM_PERMISSIONS.includes(permission.name.toLowerCase())) throw createError(permissionMessages.errors.systemPermissionDeletion, 400)

        const rolePermissionsCount = await RolePermission.count({ where: { permissionId } })   // Verificar que no haya roles asignados
        if (rolePermissionsCount > 0) throw createError(permissionMessages.errors.hasRoles, 400)

        const userPermissionsCount = await UserPermission.count({ where: { permissionId } })   // Verificar que no haya usuarios asignados directamente
        if (userPermissionsCount > 0) throw createError(permissionMessages.errors.hasUsers, 400)

        const permissionName = permission.name
        await permission.destroy()

        await logger(
            userId,
            LOG_ACTIONS.PERMISSION_DELETED.message,
            `Permiso eliminado: ${permissionName}`,
            LOG_ACTIONS.PERMISSION_DELETED.criticity
        )

        return true

    } catch (error) {
        await logger(
            userId,
            LOG_ACTIONS.PERMISSION_DELETE_FAILED.message,
            `Error al eliminar permiso ${permissionId}: ${error.message}`,
            LOG_ACTIONS.PERMISSION_DELETE_FAILED.criticity
        )

        throw error
    }
}

const getPermissionRoles = async (permissionId) => {
    try {
        const permission = await Permission.findByPk(permissionId, {
            include: [
                {
                    model: Role,
                    as: 'Roles',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'description']
                }
            ]
        })

        if (!permission) throw createError(permissionMessages.errors.notFound, 404)

        return permission.Roles || []

    } catch (error) {
        throw error
    }
}

const getPermissionUsers = async (permissionId) => {
    try {
        const permission = await Permission.findByPk(permissionId, {
            include: [
                {
                    model: User,
                    as: 'Users',
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'email', 'userStateId']
                }
            ]
        })

        if (!permission) throw createError(permissionMessages.errors.notFound, 404)

        return permission.Users || []

    } catch (error) {
        throw error
    }
}

const assignPermissionToRole = async (roleId, permissionId, adminUserId = null) => {
    try {
        const [role, permission] = await Promise.all([   // Verificar que existan el rol y el permiso
            Role.findByPk(roleId),
            Permission.findByPk(permissionId)
        ])

        if (!role) throw createError(permissionMessages.errors.roleNotFound, 404)
        if (!permission) throw createError(permissionMessages.errors.notFound, 404)

        // Verificar que el rol no tenga ya este permiso
        const existingRolePermission = await RolePermission.findOne({ where: { roleId, permissionId } })
        if (existingRolePermission) throw createError(permissionMessages.errors.roleAlreadyHasPermission, 400)

        // Asignar el permiso al rol
        await RolePermission.create({
            roleId,
            permissionId,
            dvh: null
        })

        await logger(
            adminUserId,
            LOG_ACTIONS.PERMISSION_ASSIGNED.message,
            `Permiso asignado: ${permission.name} al rol ${role.name}`,
            LOG_ACTIONS.PERMISSION_ASSIGNED.criticity
        )

        return true

    } catch (error) {
        await logger(
            adminUserId,
            LOG_ACTIONS.PERMISSION_ASSIGN_FAILED.message,
            `Error al asignar permiso ${permissionId} al rol ${roleId}: ${error.message}`,
            LOG_ACTIONS.PERMISSION_ASSIGN_FAILED.criticity
        )

        throw error
    }
}

const removePermissionFromRole = async (roleId, permissionId, adminUserId = null) => {
    try {
        const [role, permission] = await Promise.all([
            Role.findByPk(roleId),
            Permission.findByPk(permissionId)
        ])

        const deletedCount = await RolePermission.destroy({ where: { roleId, permissionId } })
        if (deletedCount === 0) throw createError(permissionMessages.errors.roleDoesNotHavePermission, 400)

        await logger(
            adminUserId,
            LOG_ACTIONS.PERMISSION_DELETED.message,
            `Permiso eliminado: ${permission?.name || permissionId} del rol ${role?.name || roleId}`,
            LOG_ACTIONS.PERMISSION_DELETED.criticity
        )

        return true

    } catch (error) {
        await logger(
            adminUserId,
            LOG_ACTIONS.PERMISSION_DELETE_FAILED.message,
            `Error al eliminar permiso ${permissionId} del rol ${roleId}: ${error.message}`,
            LOG_ACTIONS.PERMISSION_DELETE_FAILED.criticity
        )

        throw error
    }
}

const assignPermissionToUser = async (userId, permissionId, adminUserId = null) => {
    try {
        const [user, permission] = await Promise.all([
            User.findByPk(userId),
            Permission.findByPk(permissionId)
        ])

        if (!user) throw createError(permissionMessages.errors.userNotFound, 404)
        if (!permission) throw createError(permissionMessages.errors.notFound, 404)

        const existingUserPermission = await UserPermission.findOne({ where: { userId, permissionId } })   // Verificar que el usuario no tenga ya este permiso
        if (existingUserPermission) throw createError(permissionMessages.errors.userAlreadyHasPermission, 400)

        // Asignar el permiso directamente al usuario
        await UserPermission.create({
            userId,
            permissionId,
            dvh: null
        })

        await logger(
            adminUserId,
            LOG_ACTIONS.PERMISSION_ASSIGNED.message,
            `Permiso asignado directamente: ${permission.name} al usuario ${user.name} (${user.email})`,
            LOG_ACTIONS.PERMISSION_ASSIGNED.criticity
        )

        return true

    } catch (error) {
        await logger(
            adminUserId,
            LOG_ACTIONS.PERMISSION_ASSIGN_FAILED.message,
            `Error al asignar permiso ${permissionId} directamente al usuario ${userId}: ${error.message}`,
            LOG_ACTIONS.PERMISSION_ASSIGN_FAILED.criticity
        )

        throw error
    }
}

const removePermissionFromUser = async (userId, permissionId, adminUserId = null) => {
    try {
        const [user, permission] = await Promise.all([
            User.findByPk(userId),
            Permission.findByPk(permissionId)
        ])

        const deletedCount = await UserPermission.destroy({ where: { userId, permissionId } })
        if (deletedCount === 0) throw createError(permissionMessages.errors.userDoesNotHavePermission, 400)

        await logger(
            adminUserId,
            LOG_ACTIONS.PERMISSION_DELETE.message,
            `Permiso eliminado directamente: ${permission?.name || permissionId} del usuario ${user?.name || userId} (${user?.email || ''})`,
            LOG_ACTIONS.PERMISSION_DELETE.criticity
        )

        return true

    } catch (error) {
        await logger(
            adminUserId,
            LOG_ACTIONS.PERMISSION_DELETE_FAILED.message,
            `Error al eliminar permiso ${permissionId} directamente del usuario ${userId}: ${error.message}`,
            LOG_ACTIONS.PERMISSION_DELETE_FAILED.criticity
        )

        throw error
    }
}

const getRolesForPermissionAssignment = async () => {
    try {
        const roles = await Role.findAll({
            attributes: ['id', 'name', 'description'],
            where: {
                isActive: true
            },
            order: [['id', 'ASC']]
        })

        return roles

    } catch (error) {
        throw createError(permissionMessages.errors.fetchingAvailableRoles, 500)
    }
}

const getUsersForPermissionAssignment = async () => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'userStateId'],
            where: {
                userStateId: 1 // Solo usuarios activos
            },
            order: [['id', 'ASC']]
        })

        return users

    } catch (error) {
        throw createError(permissionMessages.errors.fetchingAvailableUsers, 500)
    }
}

module.exports = {
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionRoles,
    getPermissionUsers,
    assignPermissionToRole,
    removePermissionFromRole,
    assignPermissionToUser,
    removePermissionFromUser,
    getRolesForPermissionAssignment,
    getUsersForPermissionAssignment
}