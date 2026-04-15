const { Room, Booking } = require('../models')
const { ROOM_STATE_LABELS, ROOM_STATES, LOG_ACTIONS } = require('../utils/constants')
const { room : roomsMessages } = require('../utils/messages')
const logger = require('../utils/logger')

const getAllRoomsGroupedByType = async () => {   //Obtener todas las habitaciones disponibles agrupadas por tipo
  try {
    const rooms = await Room.findAll({
      where: { roomStateId: 1 },   //Solo habitaciones disponibles
      order: [['type', 'ASC'], ['price', 'ASC']],
      attributes: ['id', 'name', 'description', 'type', 'capacity', 'price', 'size', 'beds', 'amenities', 'images']
    })

    const roomsByType = {}  //Agrupa las habitaciones por tipo y obtiene una habitación representativa para cada tipo
    
    rooms.forEach(room => {
      if (!roomsByType[room.type]) {
        roomsByType[room.type] = []
      } 

      roomsByType[room.type].push({
        id: room.id,
        name: room.name,
        description: room.description,
        type: room.type,
        capacity: room.capacity,
        price: room.price,
        size: room.size,
        beds: room.beds,
        amenities: JSON.parse(room.amenities || '[]'),
        image: room.images && room.images.startsWith('/')
          ? `${process.env.BACKEND_URL || 'http://localhost:3000'}${room.images}`
          : room.images
      })
    })

    const roomTypesWithPrices = Object.keys(roomsByType).map(type => {    //Obtener rangos de precios para cada tipo de habitación
      const roomsOfType = roomsByType[type]
      const prices = roomsOfType.map(room => room.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      const representativeRoom = roomsOfType[0]  ///Selecciona la habitación más representativa (la primera)

      return {
        type,
        representativeRoom,
        priceRange: minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`,
        totalRooms: roomsOfType.length,
        allRooms: roomsOfType
      }
    })

    return {
      roomsByType: roomTypesWithPrices,
      totalRoomTypes: roomTypesWithPrices.length
    }

  } catch (error) {
    throw new Error(roomsMessages.errors.fetchingRooms)
  }
}

const getRoomById = async (roomId) => {  //Obtener habitación por nombre (slug)
  try {
    const room = await Room.findByPk(roomId, { attributes: ['id', 'name', 'description', 'type', 'capacity', 'price', 'size', 'beds', 'amenities', 'images', 'roomStateId'] })
    if (!room) return null

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      type: room.type,
      capacity: room.capacity,
      price: room.price,
      size: room.size,
      beds: room.beds,
      amenities: JSON.parse(room.amenities || '[]'),
      image: room.images && room.images.startsWith('/')
          ? `${process.env.BACKEND_URL || 'http://localhost:3000'}${room.images}`
          : room.images,
      state: ROOM_STATE_LABELS[room.roomStateId] || 'Desconocido',
      roomStateId: room.roomStateId
    }

  } catch (error) {
    throw new Error(roomsMessages.errors.fetchingRoomsDetails)
  }
}

const getAllRoomsForAdmin = async (filters = {}) => {   //Buscar habitaciones con filtros
  try {
    const where = {}

    if (filters.number) { where.name = { [require('sequelize').Op.like]: `%${filters.number}%` } }
    if (filters.type) { where.type = filters.type }
    if (filters.status) { where.roomStateId = filters.status }

    const rooms = await Room.findAll({
      where,
      order: [['id', 'ASC']],
      attributes: ['id', 'name', 'description', 'type', 'capacity', 'price', 'size', 'beds', 'amenities', 'images', 'roomStateId', 'createdAt', 'updatedAt']
    })

    return rooms.map(room => ({
      id: room.id,
      name: room.name,
      description: room.description,
      type: room.type,
      capacity: room.capacity,
      price: parseFloat(room.price),
      size: room.size,
      beds: room.beds,
      amenities: JSON.parse(room.amenities || '[]'),
      image: room.images && room.images.startsWith('/')
        ? `${process.env.BACKEND_URL || 'http://localhost:3000'}${room.images}`
        : room.images,
      state: ROOM_STATE_LABELS[room.roomStateId] || 'Desconocido',
      roomStateId: room.roomStateId,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    }))

  } catch (error) {
    throw new Error(roomsMessages.errors.fetchingRooms)
  }
}

const createRoom = async (roomData, userId) => {  //Crear habitación
  try {
    const room = await Room.create({
      name: roomData.name,
      description: roomData.description || '',
      type: roomData.type,
      capacity: roomData.capacity,
      price: roomData.price,
      size: roomData.size || '',
      beds: roomData.beds || '',
      amenities: JSON.stringify(roomData.amenities || []),
      images: roomData.images || '',
      roomStateId: roomData.roomStateId || 1
    })

    await logger(
      userId,
      LOG_ACTIONS.ROOM_CREATED.message,
      `Habitación "${room.name}" creada con ID ${room.id}`,
      LOG_ACTIONS.ROOM_CREATED.criticity
    )

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      type: room.type,
      capacity: room.capacity,
      price: parseFloat(room.price),
      size: room.size,
      beds: room.beds,
      amenities: JSON.parse(room.amenities || '[]'),
      image: room.images && room.images.startsWith('/')
        ? `${process.env.BACKEND_URL || 'http://localhost:3000'}${room.images}`
        : room.images,
      state: ROOM_STATE_LABELS[room.roomStateId] || 'Disponible',
      roomStateId: room.roomStateId
    }

  } catch (error) {
    await logger(
      userId,
      LOG_ACTIONS.ROOM_CREATED_FAILED.message,
      `Error al crear la habitación "${room.name}" - ID ${room.id}`,
      LOG_ACTIONS.ROOM_CREATED_FAILED.criticity
    )

    throw error
  }
}

const updateRoom = async (roomId, roomData, userId) => {   //Actualizar datos de habitación
  try {
    const room = await Room.findByPk(roomId)
    if (!room) throw new Error('Habitación no encontrada')
    
    const oldState = room.roomStateId
    const previousName = room.name

    await room.update({
      name: roomData.name || room.name,
      description: roomData.description !== undefined ? roomData.description : room.description,
      type: roomData.type || room.type,
      capacity: roomData.capacity || room.capacity,
      price: roomData.price || room.price,
      size: roomData.size !== undefined ? roomData.size : room.size,
      beds: roomData.beds !== undefined ? roomData.beds : room.beds,
      amenities: roomData.amenities !== undefined ? JSON.stringify(roomData.amenities) : room.amenities,
      images: roomData.images !== undefined ? roomData.images : room.images,
      roomStateId: roomData.roomStateId !== undefined ? roomData.roomStateId : room.roomStateId
    })

  
    if (roomData.roomStateId && roomData.roomStateId !== oldState) {
      await logger(
        userId,
        LOG_ACTIONS.ROOM_STATE_CHANGED.message,
        `Habitación "${previousName}" actualizada - Estado cambiado de "${ROOM_STATE_LABELS[oldState]}" a "${ROOM_STATE_LABELS[roomData.roomStateId]}"`,
        LOG_ACTIONS.ROOM_STATE_CHANGED.criticity
      )

    } else {
      await logger(
        userId,
        LOG_ACTIONS.ROOM_UPDATED.message,
        `Habitación "${previousName}" actualizada`,
        LOG_ACTIONS.ROOM_UPDATED.criticity
      )
    }

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      type: room.type,
      capacity: room.capacity,
      price: parseFloat(room.price),
      size: room.size,
      beds: room.beds,
      amenities: JSON.parse(room.amenities || '[]'),
      image: room.images && room.images.startsWith('/')
        ? `${process.env.BACKEND_URL || 'http://localhost:3000'}${room.images}`
        : room.images,
      state: ROOM_STATE_LABELS[room.roomStateId] || 'Desconocido',
      roomStateId: room.roomStateId
    }

  } catch (error) {
    await logger(
      userId,
      LOG_ACTIONS.ROOM_UPDATED_FAILED.message,
      `Error al actualizar habitación ID: ${room.id} - Nombre: ${room.name}`,
      LOG_ACTIONS.ROOM_UPDATED_FAILED.criticity
    )

    throw error
  }
}

const deleteRoom = async (roomId, userId) => {   //Marcar habitación como fuera de servicio en lugar de eliminar
  try {
    const room = await Room.findByPk(roomId)
    if (!room) throw new Error('Habitación no encontrada')

    if (room.roomStateId === ROOM_STATES.OUT_OF_SERVICE) {  //Revisamos si la hbaitación ya está "eliminada"
      throw new Error('La habitación ya está marcada como fuera de servicio')
    }

    const roomName = room.name
    const previousState = ROOM_STATE_LABELS[room.roomStateId] || 'Desconocido'

    await room.update({ roomStateId: ROOM_STATES.OUT_OF_SERVICE })

    await logger(
      userId,
      LOG_ACTIONS.ROOM_STATE_CHANGED.message,
      `Habitación "${roomName}" con ID ${roomId} marcada como fuera de servicio. Estado anterior: ${previousState}`,
      LOG_ACTIONS.ROOM_STATE_CHANGED.criticity
    )

    return {
      id: room.id,
      name: room.name,
      description: room.description,
      type: room.type,
      capacity: room.capacity,
      price: parseFloat(room.price),
      size: room.size,
      beds: room.beds,
      amenities: JSON.parse(room.amenities || '[]'),
      image: room.images && room.images.startsWith('/')
        ? `${process.env.BACKEND_URL || 'http://localhost:3000'}${room.images}`
        : room.images,
      state: ROOM_STATE_LABELS[room.roomStateId] || 'Desconocido',
      roomStateId: room.roomStateId
    }

  } catch (error) {
    await logger(
      userId,
      LOG_ACTIONS.ROOM_UPDATED_FAILED.message,
      `Error al actualizar habitación ID: ${room.id} - Nombre: ${room.name}`,
      LOG_ACTIONS.ROOM_UPDATED_FAILED.criticity
    )

    throw error
  }
}

module.exports = {
  getAllRoomsGroupedByType,
  getRoomById,
  getAllRoomsForAdmin,
  createRoom,
  updateRoom,
  deleteRoom
}