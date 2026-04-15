'use strict';

const { Permission } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        name: 'auth.login',
        description: 'Permite iniciar sesión',
        module: 'auth',
        action: 'login',
        createdAt: new Date(),
        updatedAt: new Date(),
        dvh: null
      },
      {
        name: 'auth.register',
        description: 'Permite registrar un nuevo usuario',
        module: 'auth',
        action: 'register',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'auth.activateAccount',
        description: 'Permite activar una cuenta',
        module: 'auth',
        action: 'activate',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'auth.resendActivation',
        description: 'Permite reenviar el correo de activación',
        module: 'auth',
        action: 'resend',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'auth.recoverPassword',
        description: 'Permite iniciar la recuperación de contraseña',
        module: 'auth',
        action: 'recover',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'auth.resetPassword',
        description: 'Permite restablecer la contraseña',
        module: 'auth',
        action: 'reset',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'auth.validateResetToken',
        description: 'Permite validar el token de restablecimiento',
        module: 'auth',
        action: 'validateToken',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'auth.logout',
        description: 'Permite cerrar sesión',
        module: 'auth',
        action: 'logout',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await Permission.bulkCreate(permissions);
  },

  down: async (queryInterface, Sequelize) => {
    const permissionNames = [
      'auth.login',
      'auth.register',
      'auth.activateAccount',
      'auth.resendActivation',
      'auth.recoverPassword',
      'auth.resetPassword',
      'auth.validateResetToken',
      'auth.logout'
    ];

    await Permission.destroy({ where: { name: permissionNames } })
  }
};