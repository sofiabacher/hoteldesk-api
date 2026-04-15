const router = require('express').Router()

const { getIntegrityReport, getIntegrityStatus, repairTableIntegrity, verifyRecordIntegrity, recalculateAllDVV } = require('../controller/integrityController')

const isAuth = require('../middlewares/isAuth')
const checkPermission = require('../middlewares/checkPermission')

//Endpoints para obtener reportes de integridad
router.get('/report', isAuth, checkPermission('admin.users.manage'), getIntegrityReport)  //Obtener reporte completo
router.get('/status', getIntegrityStatus)  //Comprobar estado de integridad rápido

//Endpoints calcular y verificar DVH
router.post('/repair/:tableName', isAuth, checkPermission('admin.users.manage'), repairTableIntegrity)   //Reparar DVH de tabla específica
router.get('/verify/:tableName/:id', verifyRecordIntegrity)  //Verificar el DVH de un registro específico

//Endpoints calcular DVV
router.post('/recalculate-all', isAuth, checkPermission('admin.users.manage'), recalculateAllDVV)  //Recalcular todos los DVV

module.exports = router