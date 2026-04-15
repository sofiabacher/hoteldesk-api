'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const permissions = [
            {
                name: 'receptionist.dashboard.view',
                description: 'Ver panel principal del recepcionista',
                module: 'receptionist',
                action: 'dashboard.view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.checkin.view',
                description: 'Ver lista de check-ins pendientes',
                module: 'receptionist',
                action: 'checkin.view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.checkin.process',
                description: 'Procesar check-in de huéspedes',
                module: 'receptionist',
                action: 'checkin.process',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.checkin.details',
                description: 'Ver detalles de reserva para check-in',
                module: 'receptionist',
                action: 'checkin.details',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.checkout.view',
                description: 'Ver lista de check-outs pendientes',
                module: 'receptionist',
                action: 'checkout.view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.checkout.process',
                description: 'Procesar check-out de huéspedes',
                module: 'receptionist',
                action: 'checkout.process',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.checkout.details',
                description: 'Ver detalles de reserva para check-out',
                module: 'receptionist',
                action: 'checkout.details',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.checkout.payment',
                description: 'Gestionar pagos de check-out',
                module: 'receptionist',
                action: 'checkout.payment',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.rooms.view',
                description: 'Ver estado de habitaciones',
                module: 'receptionist',
                action: 'rooms.view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.rooms.updateStatus',
                description: 'Actualizar estado de habitaciones',
                module: 'receptionist',
                action: 'rooms.updateStatus',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.stats.view',
                description: 'Ver estadísticas del día',
                module: 'receptionist',
                action: 'stats.view',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'receptionist.summary.view',
                description: 'Ver resumen de actividades',
                module: 'receptionist',
                action: 'summary.view',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]

        await queryInterface.bulkInsert('permissions', permissions)
    },

    down: async (queryInterface, Sequelize) => {
        const permissionNames = [
            'receptionist.dashboard.view',
            'receptionist.checkin.view',
            'receptionist.checkin.process',
            'receptionist.checkin.details',
            'receptionist.checkout.view',
            'receptionist.checkout.process',
            'receptionist.checkout.details',
            'receptionist.checkout.payment',
            'receptionist.rooms.view',
            'receptionist.rooms.updateStatus',
            'receptionist.stats.view',
            'receptionist.summary.view'
        ]

        await queryInterface.bulkDelete('permissions', {
            name: {
                [Sequelize.Op.in]: permissionNames
            }
        })
    }
}