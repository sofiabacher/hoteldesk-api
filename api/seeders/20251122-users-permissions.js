'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'user.profile.view',
        description: 'Permite obtener los datos del usuario autenticado',
        module: 'user',
        action: 'profile.view',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user.profile.update',
        description: 'Permite modificar nombre, apellido, teléfono, DNI, fecha de nacimiento, foto',
        module: 'user',
        action: 'profile.update',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user.password.change',
        description: 'Permite modificar la contraseña',
        module: 'user',
        action: 'password.change',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user.role.switch',
        description: 'Permite seleccionar el rol activo',
        module: 'user',
        action: 'role.switch',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user.avatar.upload',
        description: 'Permite cambiar la foto del usuario',
        module: 'user',
        action: 'avatar.upload',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Permission.bulkCreate(permissions);
  },

  down: async (queryInterface, Sequelize) => {
    const permissionNames = [
      'user.profile.view',
      'user.profile.update',
      'user.password.change',
      'user.role.switch',
      'user.avatar.upload'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};