const router = require('express').Router()

const { searchAvailableRooms, getRoomById, createNewBooking, getUserBookingsList, getBookingDetails, updateBookingDetails, cancelUserBooking, runAutomaticCancellation, downloadReceipt } = require('../controller/bookingController')
const { bookingCreationRules, bookingSearchRules, bocheckPermissionRules, bookingStatusRules, roomIdRules, bookingIdRules } = require('../validators/bookingValidator')

const validateFields = require('../middlewares/validateFields')
const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')

//Endpoint obtener habitaciones
router.get('/rooms/search', isAuth, checkPermission('booking.rooms.search'), bookingSearchRules, validateFields, searchAvailableRooms)  //Buscar habitaciones disponibles
router.get('/rooms/:roomId', isAuth, checkPermission('booking.rooms.view'), roomIdRules, validateFields, getRoomById)  //Ver detalles de habitación

//Endpoints para obtener reservas
router.get('/my-bookings', isAuth, checkPermission('booking.list.my'), bookingStatusRules, validateFields, getUserBookingsList)   //Reservas del usuario
router.get('/:id', isAuth, checkPermission('booking.view'), bookingIdRules, validateFields, getBookingDetails)  //Ver detalles de reserva específica

//Endpoint crear reserva
router.post('/', isAuth, checkPermission('booking.create'), bookingCreationRules, validateFields, createNewBooking)

//Endpoint descargar comprobante de pago
router.get('/:id/receipt', isAuth, checkPermission('booking.receipt.download'), bookingIdRules, validateFields, downloadReceipt)

//Endpoint para cancelar reserva
router.delete('/:id', isAuth, checkPermission('booking.cancel'), bookingIdRules, validateFields, cancelUserBooking)

//Endpoint para cancelación automática de reservas no pagadas
router.post('/auto-cancel-unpaid', runAutomaticCancellation)

module.exports = router