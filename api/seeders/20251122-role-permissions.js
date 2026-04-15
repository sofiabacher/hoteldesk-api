'use strict';

const { Role, Permission } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = await Role.findAll()   // Obtengo todos los roles y permisos
    const permissions = await Permission.findAll()

    const roleMap = {}  //Mapeo los roles a sus IDs
    roles.forEach(role => (roleMap[role.name] = role.id))

    const permissionMap = {}   //Mapeo los permisos a sus IDs
    permissions.forEach(permission => (permissionMap[permission.name] = permission.id))

    const rolePermissions = []

    // ===== ROL: ADMIN =====
    const adminPermissions = [
      'auth.login', 'auth.logout',
      'user.profile.view', 'user.profile.update', 'user.password.change', 'user.role.switch', 'user.avatar.upload',
      'admin.users.manage', 'admin.users.view', 'admin.users.edit', 'admin.users.delete',
      'admin.reports.view',
      'admin.rooms', 'admin.rooms.create', 'admin.rooms.edit', 'admin.rooms.delete', 'admin.rooms.list',
      'admin.logs',
      'admin.bitacora.view', 'admin.bitacora.download',
      'admin.roles.view', 'admin.roles.create', 'admin.roles.edit', 'admin.roles.delete',
      'admin.rooms.view',
      'admin.backup.manual', 'admin.backup.view', 'admin.backup.download',
      'permissions.manage', 'permissions.view', 'permissions.create', 'permissions.edit', 'permissions.delete', 'permissions.assign', 'permissions.remove',
      'room.list', 'room.view',
      'booking.rooms.search', 'booking.rooms.view',
      'booking.list.all'
    ]

    adminPermissions.forEach(permissionName => {
      if (permissionMap[permissionName] && roleMap.admin) {
        rolePermissions.push({
          roleId: roleMap.admin,
          permissionId: permissionMap[permissionName],
          dvh: null
        })
      }
    })


    // ===== ROL: RECEPCIONIST =====
    const recepcionistPermissions = [
      'auth.login', 'auth.logout',
      'user.profile.view', 'user.profile.update', 'user.password.change', 'user.role.switch', 'user.avatar.upload',
      'receptionist.checkin.view', 'receptionist.checkin.process',  'receptionist.checkin.details',
      'receptionist.checkout.view', 'receptionist.checkout.process', 'receptionist.checkout.details', 'receptionist.checkout.payment',
      'receptionist.dashboard.view', 'receptionist.stats.view', 'receptionist.summary.view',
      'receptionist.rooms.view', 'receptionist.rooms.updateStatus',
      'booking.view', 'booking.rooms.search', 'booking.rooms.view',
      'room.list', 'room.view'
    ];

    recepcionistPermissions.forEach(permissionName => {
      if (permissionMap[permissionName] && roleMap.recepcionist) {
        rolePermissions.push({
          roleId: roleMap.recepcionist,
          permissionId: permissionMap[permissionName],
          dvh: null
        });
      }
    });


    // ===== ROL: CLEANING =====
    const cleaningPermissions = [
      'auth.login', 'auth.logout',
      'user.profile.view', 'user.profile.update', 'user.password.change', 'user.role.switch', 'user.avatar.upload',
      'room.status.update',
      'cleaning.rooms.view',
      'cleaning.rooms.update'
    ];

    cleaningPermissions.forEach(permissionName => {
      if (permissionMap[permissionName] && roleMap.cleaning) {
        rolePermissions.push({
          roleId: roleMap.cleaning,
          permissionId: permissionMap[permissionName],
          dvh: null
        });
      }
    });

    
    // ===== ROL: GUEST =====
    const guestPermissions = [
      'auth.login', 'auth.register', 'auth.activateAccount', 'auth.resendActivation',
      'auth.recoverPassword', 'auth.resetPassword', 'auth.validateResetToken', 'auth.logout',

      'user.profile.view', 'user.profile.update', 'user.password.change', 'user.role.switch', 'user.avatar.upload',

      'room.list', 'room.view',

      'booking.rooms.search', 'booking.rooms.view', 'booking.list.my', 'booking.view',
      'booking.create', 'booking.receipt.download', 'booking.cancel',

      'payment.process', 'payment.info'
    ];

    guestPermissions.forEach(permissionName => {
      if (permissionMap[permissionName] && roleMap.guest) {
        rolePermissions.push({
          roleId: roleMap.guest,
          permissionId: permissionMap[permissionName],
          dvh: null
        });
      }
    });

    // Crear todas las asignaciones
    await queryInterface.bulkInsert('role_permissions', rolePermissions)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {})
  }
};