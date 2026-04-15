'use strict'

const { Integrity } = require('../models')

module.exports = {
    async up(queryInterface, Sequelize) {
        const tables = [    // Inicializar DVV para todas las tablas principales con valor 0
            'users',
            'roles',
            'user_roles',
            'rooms',
            'bookings',
            'permissions',
            'role_permissions',
            'user_permissions'
        ]

        for (const tableName of tables) {
            await Integrity.upsert({
                tableName: tableName,
                dvv: 0
            })
        }
    },

    async down(queryInterface, Sequelize) {    // Eliminar todos los registros de la tabla integrity
        await queryInterface.bulkDelete('integrity', null, {})
    }
}