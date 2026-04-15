const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({   //Carpeta donde se guardan las imágenes --> uploads/avatars/ o uploads/rooms/
    destination: function (req, file, cb) {
        // Determinar la carpeta basada en la ruta
        if (req.originalUrl && req.originalUrl.includes('/rooms/')) {
            // Crear carpeta rooms si no existe
            const fs = require('fs')
            const roomsDir = 'uploads/rooms/'
            if (!fs.existsSync(roomsDir)) {
                fs.mkdirSync(roomsDir, { recursive: true })
            }
            cb(null, 'uploads/rooms/')
        } else {
            cb(null, 'uploads/avatars/')
        }
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const prefix = req.originalUrl && req.originalUrl.includes('/rooms/') ? 'room-' : ''
        cb(null, prefix + uniqueSuffix + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {   //Renombra la imágen para que no se repita y no choquen 
    const allowedTypes = /jpeg|jpg|png/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimetype)

    if (extname && mimeType) {
        cb(null, true)
    } else {
        cb(new Error('Solo imágenes con formato permitido'))
    }
}

const upload = multer({ storage, fileFilter })

module.exports = upload