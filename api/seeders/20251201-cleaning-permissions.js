'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'cleaning.rooms.view',
        description: 'Permite ver las habitaciones en limpieza',
        module: 'cleaning',
        action: 'view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'cleaning.rooms.update',
        description: 'Permite marcar habitaciones como disponibles',
        module: 'cleaning',
        action: 'update',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Crear uno por uno para que los hooks funcionen correctamente
    for (const permission of permissions) {
      await Permission.findOrCreate({
        where: { name: permission.name },
        defaults: permission
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const permissionNames = [
      'cleaning.rooms.view',
      'cleaning.rooms.update'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};