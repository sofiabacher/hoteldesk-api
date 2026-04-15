'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'admin.bitacora.view',
        description: 'Permite ver los registros de bitácora del sistema',
        module: 'admin',
        action: 'bitacora.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.bitacora.download',
        description: 'Permite descargar los registros de bitácora en formato CSV',
        module: 'admin',
        action: 'bitacora.download',
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
      'admin.bitacora.view',
      'admin.bitacora.download'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};