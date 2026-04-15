'use strict'

const { calcularDVH } = require('../utils/integrity')
const { ROOM_STATES, ROOM_TYPES } = require('../utils/constants')

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date()

    const rawRooms = [
      //Habitaciones estándar (6 rooms, IDs 1-6) - Comodidades básicas 1-3 guests
      {
        id: 1,
        name: 'Estándar 101',
        description: 'Habitación económica perfecta para viajeros individuales o parejas',
        type: ROOM_TYPES.STANDARD,
        capacity: 2,
        price: 89.00,
        size: '22m²',
        beds: '1 cama doble',
        amenities: ['wifi', 'tv', 'ac'],
        images: '/uploads/rooms/estandar/101.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Estándar 102',
        description: 'Cómoda habitación con vistas al jardín',
        type: ROOM_TYPES.STANDARD,
        capacity: 2,
        price: 89.00,
        size: '22m²',
        beds: '1 cama doble',
        amenities: ['wifi', 'tv', 'ac'],
        images: '/uploads/rooms/estandar/102.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'Estándar 103',
        description: 'Ideal para estancias cortas',
        type: ROOM_TYPES.STANDARD,
        capacity: 1,
        price: 69.00,
        size: '18m²',
        beds: '1 cama individual',
        amenities: ['wifi', 'tv', 'ac'],
        images: '/uploads/rooms/estandar/103.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        name: 'Estándar 104',
        description: 'Habitación con acceso fácil al hall principal',
        type: ROOM_TYPES.STANDARD,
        capacity: 2,
        price: 89.00,
        size: '22m²',
        beds: '1 cama doble',
        amenities: ['wifi', 'tv', 'ac'],
        images: '/uploads/rooms/estandar/104.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        name: 'Estándar 105',
        description: 'Espaciosa habitación para tres personas',
        type: ROOM_TYPES.STANDARD,
        capacity: 3,
        price: 99.00,
        size: '25m²',
        beds: '1 cama doble + 1 individual',
        amenities: ['wifi', 'tv', 'ac', 'minibar'],
        images: '/uploads/rooms/estandar/105.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 6,
        name: 'Estándar 106',
        description: 'Económica y funcional',
        type: ROOM_TYPES.STANDARD,
        capacity: 2,
        price: 89.00,
        size: '22m²',
        beds: '1 cama doble',
        amenities: ['wifi', 'tv', 'ac'],
        images: '/uploads/rooms/estandar/106.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },

      //Habitaciones Deluxe (6 rooms, IDs 7-12) - Comodidades Premium 2-4 guests
      {
        id: 7,
        name: 'Deluxe 201 - Vista Parcial al Mar',
        description: 'Confort premium con vistas parciales al océano',
        type: ROOM_TYPES.DELUXE,
        capacity: 2,
        price: 129.00,
        size: '32m²',
        beds: '1 cama queen',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'premium-furniture', 'coffee-machine'],
        images: '/uploads/rooms/deluxe/201.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 8,
        name: 'Deluxe 202 - Vista Jardín',
        description: 'Elegante habitación con vistas a los jardines tropicales',
        type: ROOM_TYPES.DELUXE,
        capacity: 2,
        price: 129.00,
        size: '32m²',
        beds: '1 cama queen',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'premium-furniture', 'coffee-machine'],
        images: '/uploads/rooms/deluxe/202.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 9,
        name: 'Deluxe 203',
        description: 'Lujo y comodidad en el corazón del hotel',
        type: ROOM_TYPES.DELUXE,
        capacity: 3,
        price: 149.00,
        size: '35m²',
        beds: '1 cama king + sofá cama',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'premium-furniture', 'coffee-machine', 'balcony'],
        images: '/uploads/rooms/deluxe/203.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 10,
        name: 'Deluxe 204 - Esquina',
        description: 'Habitación de esquina con más espacio y luz natural',
        type: ROOM_TYPES.DELUXE,
        capacity: 2,
        price: 139.00,
        size: '34m²',
        beds: '1 cama queen',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'premium-furniture', 'coffee-machine'],
        images: '/uploads/rooms/deluxe/204.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 11,
        name: 'Deluxe 205 - Familiar',
        description: 'Perfecta para familias pequeñas',
        type: ROOM_TYPES.DELUXE,
        capacity: 4,
        price: 179.00,
        size: '40m²',
        beds: '2 camas queen',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'premium-furniture', 'coffee-machine', 'extra-beds'],
        images: '/uploads/rooms/deluxe/205.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 12,
        name: 'Deluxe 206 - Romántica',
        description: 'Diseñada para parejas con detalles románticos',
        type: ROOM_TYPES.DELUXE,
        capacity: 2,
        price: 159.00,
        size: '33m²',
        beds: '1 cama king',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'premium-furniture', 'coffee-machine', 'jacuzzi'],
        images: '/uploads/rooms/deluxe/206.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },

      //Habitaciones Ejecutivas (5 rooms, IDs 13-17) - Centrado en el trabajo 2-4 guests
      {
        id: 13,
        name: 'Executive Suite 301',
        description: 'Espacio de trabajo integrado con vistas panorámicas',
        type: ROOM_TYPES.EXECUTIVE,
        capacity: 3,
        price: 189.00,
        size: '45m²',
        beds: '1 cama king + sofá cama',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'work-desk', 'balcony', 'coffee-machine'],
        images: '/uploads/rooms/ejecutiva/301.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 14,
        name: 'Executive Suite 302 - Business',
        description: 'Área de trabajo completa con impresora',
        type: ROOM_TYPES.EXECUTIVE,
        capacity: 2,
        price: 199.00,
        size: '48m²',
        beds: '1 cama king',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'work-desk', 'printer', 'balcony', 'meeting-area'],
        images: '/uploads/rooms/ejecutiva/302.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 15,
        name: 'Executive Suite 303',
        description: 'Lujo ejecutivo con sala de reuniones privada',
        type: ROOM_TYPES.EXECUTIVE,
        capacity: 4,
        price: 229.00,
        size: '55m²',
        beds: '1 cama king + 2 individuales',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'work-desk', 'meeting-area', 'balcony', 'coffee-machine'],
        images: '/uploads/rooms/ejecutiva/303.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 16,
        name: 'Executive Suite 304 - Alta Tecnología',
        description: 'Equipada con última tecnología para negocios',
        type: ROOM_TYPES.EXECUTIVE,
        capacity: 3,
        price: 219.00,
        size: '50m²',
        beds: '1 cama king + sofá cama',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'work-desk', 'smart-board', 'video-conference', 'balcony'],
        images: '/uploads/rooms/ejecutiva/304.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 17,
        name: 'Executive Suite 305',
        description: 'Suite premium con acceso a lounge ejecutivo',
        type: ROOM_TYPES.EXECUTIVE,
        capacity: 2,
        price: 239.00,
        size: '52m²',
        beds: '1 cama king',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'work-desk', 'lounge-access', 'balcony', 'coffee-machine'],
        images: '/uploads/rooms/ejecutiva/305.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },

      //Habitaciones familiares (4 rooms, IDs 18-21) - Espacio para 4-6 guests
      {
        id: 18,
        name: 'Family Room 401',
        description: 'Diseñada para familias con niños pequeños',
        type: ROOM_TYPES.FAMILY,
        capacity: 4,
        price: 169.00,
        size: '50m²',
        beds: '2 camas dobles',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'extra-beds', 'kid-friendly', 'game-console'],
        images: '/uploads/rooms/familiar/401.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 19,
        name: 'Family Room 402 - Grande',
        description: 'Amplio espacio para familias numerosas',
        type: ROOM_TYPES.FAMILY,
        capacity: 5,
        price: 199.00,
        size: '60m²',
        beds: '1 king + 2 dobles',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'extra-beds', 'kid-friendly', 'game-console', 'dining-area'],
        images: '/uploads/rooms/familiar/402.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 20,
        name: 'Family Room 403 - Con Balcón',
        description: 'Balcon amplio con zona de juegos infantil',
        type: ROOM_TYPES.FAMILY,
        capacity: 6,
        price: 229.00,
        size: '65m²',
        beds: '2 king + 2 individuales',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'extra-beds', 'kid-friendly', 'game-console', 'balcony', 'play-area'],
        images: '/uploads/rooms/familiar/403.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 21,
        name: 'Family Room 404 - Suite Familiar',
        description: 'Dos dormitorios independientes para mayor privacidad',
        type: ROOM_TYPES.FAMILY,
        capacity: 4,
        price: 249.00,
        size: '70m²',
        beds: '2 dormitorios (1 king + 2 dobles)',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'extra-beds', 'kid-friendly', 'game-console', 'separate-living', 'kitchenette'],
        images: '/uploads/rooms/familiar/404.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },

      //Habitaciones Suite Presidencial (3 rooms, IDs 22-24) - Lujo supremo 4-6 guests
      {
        id: 22,
        name: 'Presidential Suite 501 - Panorámica',
        description: 'La máxima experiencia de lujo con vistas de 360°',
        type: ROOM_TYPES.PRESIDENTIAL,
        capacity: 4,
        price: 399.00,
        size: '85m²',
        beds: '1 cama king + 2 individuales',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'jacuzzi', 'balcony', 'living-room', 'dining-area', 'butler-service'],
        images: '/uploads/rooms/presidencial/501.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 23,
        name: 'Presidential Suite 502 - Penthouse',
        description: 'Penthouse de dos niveles con terraza privada',
        type: ROOM_TYPES.PRESIDENTIAL,
        capacity: 6,
        price: 599.00,
        size: '120m²',
        beds: '2 king + 2 queen',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'jacuzzi', 'balcony', 'living-room', 'dining-area', 'butler-service', 'private-terrace', 'kitchenette'],
        images: '/uploads/rooms/presidencial/502.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 24,
        name: 'Presidential Suite 503 - Imperial',
        description: 'La joya de la corona del hotel',
        type: ROOM_TYPES.PRESIDENTIAL,
        capacity: 6,
        price: 799.00,
        size: '150m²',
        beds: '2 king + 4 individuales',
        amenities: ['wifi', 'tv', 'ac', 'minibar', 'jacuzzi', 'balcony', 'living-room', 'dining-area', 'butler-service', 'private-terrace', 'kitchenette', 'private-elevator', 'spa-bathroom'],
        images: '/uploads/rooms/presidencial/503.jpg',
        roomStateId: ROOM_STATES.AVAILABLE,
        createdAt: now,
        updatedAt: now
      }
    ]

    const rooms = rawRooms.map(room => {
      const serialized = Object.assign({}, room, {
        amenities: JSON.stringify(room.amenities)
      })

      return Object.assign({}, serialized, {
        dvh: calcularDVH(serialized)
      })
    })

    await queryInterface.bulkInsert('rooms', rooms, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('rooms', null, {})
  }
}