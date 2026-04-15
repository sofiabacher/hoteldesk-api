const express = require('express')
const router = express.Router()

const { getAllRooms, getRoom, getAllRoomsForAdminController, createNewRoom, updateExistingRoom, deleteExistingRoom, uploadRoomImage } = require('../controller/roomController')
const checkPermission = require('../middlewares/checkPermission')
const isAuth = require('../middlewares/isAuth')
const upload = require('../middlewares/upload')

//Rutas públicas
router.get('/', isAuth, checkPermission('room.list'), getAllRooms)  //Obtiene todas las habitaciones disponibles
router.get('/:id', isAuth, checkPermission('room.view'), getRoom)  //Obtiene detalles de la habitación por nombre/ID

//Endpoints gestionar habitaciones
router.get('/admin/all', isAuth, checkPermission('admin.rooms'), getAllRoomsForAdminController)  //Obtener todos las habitaciones
router.post('/admin', isAuth, checkPermission('admin.rooms'), createNewRoom)  //Crear habitación
router.put('/admin/:id', isAuth, checkPermission('admin.rooms'), updateExistingRoom)  //Actualizar habitación
router.delete('/admin/:id', isAuth, checkPermission('admin.rooms'), deleteExistingRoom)  //Marcar habitación como fuera de servicio

//Endpoint para subir imagen de habitación
router.post('/upload-image', isAuth, checkPermission('admin.rooms'), upload.single('image'), uploadRoomImage)

module.exports = router 