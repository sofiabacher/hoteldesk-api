'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'admin.backup.manual',
        description: 'Permite realizar backups manuales de la base de datos',
        module: 'admin',
        action: 'backup.manual',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.backup.view',
        description: 'Permite ver la lista de backups realizados',
        module: 'admin',
        action: 'backup.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'admin.backup.download',
        description: 'Permite descargar archivos de backup',
        module: 'admin',
        action: 'backup.download',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Permission.bulkCreate(permissions);
  },

  down: async (queryInterface, Sequelize) => {
    const permissionNames = [
      'admin.backup.manual',
      'admin.backup.view',
      'admin.backup.download'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};