const { getAllRoomsGroupedByType, getRoomById, getAllRoomsForAdmin, createRoom, updateRoom, deleteRoom } = require('../services/roomService')

const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await getAllRoomsGroupedByType()
    res.json({ success: true, data: rooms })

  } catch (error) {
    next(error)
  }
}

const getRoom = async (req, res, next) => {
  const roomId = req.params.id

  try {
    const room = await getRoomById(roomId)

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Habitación no encontrada'
      })
    }

    res.json({ success: true, data: room })

  } catch (error) {
    next(error)
  }
}

const getAllRoomsForAdminController = async (req, res, next) => {
  try {
    const filters = {
      number: req.query.number,
      type: req.query.type,
      status: req.query.status ? parseInt(req.query.status) : undefined
    }

    const rooms = await getAllRoomsForAdmin(filters)

    res.json({ success: true, data: rooms })

  } catch (error) {
    next(error)
  }
}

const createNewRoom = async (req, res, next) => {
  const userId = req.user?.id

  try {
    const room = await createRoom(req.body, userId)

    res.status(201).json({ success: true, data: room })

  } catch (error) {
    next(error)
  }
}

const updateExistingRoom = async (req, res, next) => {
  const roomId = req.params.id
  const userId = req.user?.id

  try {
    const room = await updateRoom(roomId, req.body, userId)

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Habitación no encontrada'
      })
    }

    res.json({ success: true, data: room })

  } catch (error) {
    next(error)
  }
}

const deleteExistingRoom = async (req, res, next) => {
  const roomId = req.params.id
  const userId = req.user?.id

  try {
    const result = await deleteRoom(roomId, userId)

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Habitación no encontrada'
      })
    }

    res.json({ success: true, message: 'Habitación marcada como fuera de servicio correctamente', data: result })

  } catch (error) {
    next(error)
  }
}

const uploadRoomImage = async (req, res, next) => {
  const file = req.file

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'No se proporcionó ninguna imagen'
    })
  }

  try {
    // La URL de la imagen será relativa al servidor
    const imageUrl = `/uploads/rooms/${file.filename}`

    res.status(200).json({
      success: true,
      message: 'Imagen subida exitosamente',
      url: { imageUrl }
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllRooms,
  getRoom,
  getAllRoomsForAdminController,
  createNewRoom,
  updateExistingRoom,
  deleteExistingRoom,
  uploadRoomImage
}