const express = require('express')
const server = express()
const path = require('path')  //Para construir rutas de archivos seguras y multiplataformas

require('./models')  //Importa las relaciones de los modelos
const { app } = require('./config')

const sequelize = require('./config/db')
const corsMiddleware = require('./middlewares/cors')
const errorHandle = require('./middlewares/errorHandler')

const authRoutes = require('./routes/authRoutes')
const logRoutes = require('./routes/logRoutes')
const userRoutes = require('./routes/userRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const roomRoutes = require('./routes/roomRoutes')
const adminRoutes = require('./routes/adminRoutes')
const roleRoutes = require('./routes/roleRoutes')
const permissionRoutes = require('./routes/permissionRoutes')
const integrityRoutes = require('./routes/integrityRoutes')
const receptionistRoutes = require('./routes/receptionistRoutes')
const cleaningRoutes = require('./routes/cleaningRoutes')

// Importar servicios
const schedulerService = require('./services/schedulerService')

//Middlewares
server.use(express.json())
server.use(corsMiddleware)

//Rutas por dominio
server.use('/auth', authRoutes)    //Ej: /auth/login
server.use('/log', logRoutes)   //Rutas de bitácora
server.use('/users', userRoutes)   //Rutas de usuarios
server.use('/booking', bookingRoutes)  //Rutas de reservas
server.use('/payment', paymentRoutes) //Rutas de pagos
server.use('/rooms', roomRoutes)     //Rutas de habitaciones
server.use('/admin', adminRoutes)    //Rutas de administración
server.use('/roles', roleRoutes)     //Rutas de gestión de roles
server.use('/permissions', permissionRoutes)  //Rutas de permisos
server.use('/integrity', integrityRoutes)  //Rutas de integridad de datos
server.use('/receptionist', receptionistRoutes)  //Rutas de recepcionista
server.use('/cleaning', cleaningRoutes)  //Rutas de personal de limpieza

server.use(errorHandle)
server.use('/uploads', express.static(path.join(__dirname, 'uploads'))) //Para que el navegador pueda acceder a la imagen mediante URL


const initServer = async () => {
    try {
        await sequelize.authenticate()
        console.log("Conexión con la BD establecida")

        if (app.isProd && app.forceSync) {   //Por si la restauración de los modelos está en true y el sistema en producción
            console.error("Bloqueo de arranque: DB_FORCE_SYNC no debe estar activado en producción")
            process.exit(1)
        }

        await sequelize.sync({ force: app.forceSync })
        console.log("Modelos sincronizados con la BD")

        /* if (app.isDev) {
            await runSeeders()
            console.log("Seeders ejecutados")
        } */

        schedulerService.start()   //Iniciar scheduler de tareas automáticas

        server.listen(app.port, async () => {
            console.log("El server esta escuchando en el puerto", app.port)
        })

    } catch (error) {
        console.error("Error al inciar el servidor:", error)
        process.exit(1) //Corta el proceso y marca que fue con un error (1)
    }
}

initServer()