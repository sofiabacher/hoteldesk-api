'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'admin.users.manage',
        description: 'Permite gestionar usuarios del sistema (listar, modificar estado, eliminar)',
        module: 'admin',
        action: 'users.manage',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.users.view',
        description: 'Permite ver la lista de usuarios del sistema',
        module: 'admin',
        action: 'users.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.users.edit',
        description: 'Permite modificar el estado de los usuarios (bloquear, desbloquear)',
        module: 'admin',
        action: 'users.edit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.users.delete',
        description: 'Permite eliminar usuarios del sistema',
        module: 'admin',
        action: 'users.delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.reports.view',
        description: 'Permite ver y generar reportes del sistema',
        module: 'admin',
        action: 'reports.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.rooms',
        description: 'Permite gestionar habitaciones del sistema (crear, modificar, eliminar, listar)',
        module: 'admin',
        action: 'rooms.manage',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.rooms.create',
        description: 'Permite crear nuevas habitaciones',
        module: 'admin',
        action: 'rooms.create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.rooms.edit',
        description: 'Permite modificar información de habitaciones',
        module: 'admin',
        action: 'rooms.edit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.rooms.delete',
        description: 'Permite eliminar habitaciones',
        module: 'admin',
        action: 'rooms.delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.rooms.list',
        description: 'Permite ver la lista de habitaciones para administración',
        module: 'admin',
        action: 'rooms.list',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.logs',
        description: 'Permite ver logs de actividades del sistema',
        module: 'admin',
        action: 'logs.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.roles.view',
        description: 'Permite ver la lista de roles del sistema',
        module: 'admin',
        action: 'roles.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.roles.create',
        description: 'Permite crear nuevos roles personalizados',
        module: 'admin',
        action: 'roles.create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.roles.edit',
        description: 'Permite modificar roles personalizados y asignar roles a usuarios',
        module: 'admin',
        action: 'roles.edit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.roles.delete',
        description: 'Permite eliminar roles personalizados',
        module: 'admin',
        action: 'roles.delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.rooms.view',
        description: 'Permite ver la lista de habitaciones para administración',
        module: 'admin',
        action: 'rooms.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.bitacora.view',
        description: 'Permite ver la bitácora de actividades del sistema',
        module: 'admin',
        action: 'bitacora.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions.manage',
        description: 'Permite gestionar completamente los permisos del sistema (crear, editar, eliminar, asignar, quitar)',
        module: 'admin',
        action: 'permissions.manage',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions.view',
        description: 'Permite ver la lista de permisos del sistema',
        module: 'admin',
        action: 'permissions.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions.create',
        description: 'Permite crear nuevos permisos en el sistema',
        module: 'admin',
        action: 'permissions.create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions.edit',
        description: 'Permite editar permisos existentes',
        module: 'admin',
        action: 'permissions.edit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions.delete',
        description: 'Permite eliminar permisos del sistema',
        module: 'admin',
        action: 'permissions.delete',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions.assign',
        description: 'Permite asignar permisos a roles y usuarios',
        module: 'admin',
        action: 'permissions.assign',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'permissions.remove',
        description: 'Permite quitar permisos de roles y usuarios',
        module: 'admin',
        action: 'permissions.remove',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Permission.bulkCreate(permissions);
  },

  down: async (queryInterface, Sequelize) => {
    const permissionNames = [
      'admin.users.manage',
      'admin.users.view',
      'admin.users.edit',
      'admin.users.delete',
      'admin.reports.view',
      'admin.rooms',
      'admin.rooms.create',
      'admin.rooms.edit',
      'admin.rooms.delete',
      'admin.rooms.list',
      'admin.logs',
      'admin.roles.view',
      'admin.roles.create',
      'admin.roles.edit',
      'admin.roles.delete',
      'admin.rooms.view',
      'admin.bitacora.view',
      'permissions.manage',
      'permissions.view',
      'permissions.create',
      'permissions.edit',
      'permissions.delete',
      'permissions.assign',
      'permissions.remove'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};