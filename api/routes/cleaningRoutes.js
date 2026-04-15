const router = require('express').Router()

const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')

const { getRoomsInCleaningController, markRoomAsAvailableController } = require('../controller/cleaningController')

// Obtener habitaciones en limpieza
router.get( '/rooms', isAuth, checkPermission('cleaning.rooms.view'), getRoomsInCleaningController )

// Marcar habitación como disponible
router.put( '/rooms/:roomId/available', isAuth, checkPermission('cleaning.rooms.update'), markRoomAsAvailableController )

module.exports = router