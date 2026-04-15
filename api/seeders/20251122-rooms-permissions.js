'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'room.list',
        description: 'Permite obtener todas las habitaciones disponibles',
        module: 'room',
        action: 'list',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'room.view',
        description: 'Permite obtener detalles de una habitación',
        module: 'room',
        action: 'view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'room.status.update',
        description: 'Permite actualizar el estado de limpieza de una habitación',
        module: 'room',
        action: 'status.update',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Permission.bulkCreate(permissions);
  },

  down: async (queryInterface, Sequelize) => {
    const permissionNames = [
      'room.list',
      'room.view',
      'room.status.update'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};