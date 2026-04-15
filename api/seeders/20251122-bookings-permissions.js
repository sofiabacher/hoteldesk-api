'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'booking.rooms.search',
        description: 'Permite buscar habitaciones disponibles según fechas y huéspedes',
        module: 'booking',
        action: 'rooms.search',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'booking.rooms.view',
        description: 'Permite obtener información detallada de una habitación por ID',
        module: 'booking',
        action: 'rooms.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'booking.list.my',
        description: 'Permite obtener todas las reservas del usuario autenticado',
        module: 'booking',
        action: 'list.my',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'booking.view',
        description: 'Permite obtener detalles completos de una reserva específica',
        module: 'booking',
        action: 'view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'booking.create',
        description: 'Permite crear una nueva reserva validando disponibilidad, fechas y capacidad',
        module: 'booking',
        action: 'create',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'booking.receipt.download',
        description: 'Permite descargar comprobante de pago (solo reservas pagadas)',
        module: 'booking',
        action: 'receipt.download',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'booking.cancel',
        description: 'Permite cancelar una reserva del usuario',
        module: 'booking',
        action: 'cancel',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'booking.list.all',
        description: 'Permite ver todas las reservas del sistema (solo administrador)',
        module: 'booking',
        action: 'list.all',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Permission.bulkCreate(permissions);
  },

  down: async (queryInterface, Sequelize) => {
    const permissionNames = [
      'booking.rooms.search',
      'booking.rooms.view',
      'booking.list.my',
      'booking.view',
      'booking.create',
      'booking.receipt.download',
      'booking.cancel',
      'booking.list.all'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};