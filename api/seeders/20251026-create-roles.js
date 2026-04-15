'use strict'   //activa modo estricto en JS

module.exports = {
    async up(queryInterface, Sequelize) {   //up: ejecuta el seeder --> ('nameTabla', [{registros}], {opciones extras})
        const now = new Date()

        await queryInterface.bulkInsert('roles', [
            {
                name: 'guest',
                description: 'Usuario básico con acciones sobre reservas y visualización ',
                createdAt: now,
                updatedAt: now
            },
            {
                name: 'admin',
                description: 'Administrador del sistema con permisos de gestiones',
                createdAt: now,
                updatedAt: now
            },
            {
                name: 'recepcionist',
                description: 'Recepcionista encargado del check-in y check-out',
                createdAt: now,
                updatedAt: now
            },
            {
                name: 'cleaning',
                description: 'Personal de limpieza responsable del mantenimiento y estado de habitaciones',
                createdAt: now,
                updatedAt: now
            }
        ], {})
    },

    async down(queryInterface, Sequelize) {  //down: revertir el seeder (elimina lo insertado) --> ('nameTabla', null: borra todas las filas, {opciones adicionales})
        await queryInterface.bulkDelete('roles', null, {})
    }
}