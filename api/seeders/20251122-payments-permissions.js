'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'payment.process',
        description: 'Permite procesar el pago de una reserva',
        module: 'payment',
        action: 'process',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'payment.info',
        description: 'Permite obtener información del pago de una reserva',
        module: 'payment',
        action: 'info',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Permission.bulkCreate(permissions);
  },

  down: async (queryInterface, Sequelize) => {
    const permissionNames = [
      'payment.process',
      'payment.info'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};