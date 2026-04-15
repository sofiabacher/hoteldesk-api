require('dotenv').config() //Cargar las variables de entorno

const env = process.env.NODE_ENV || 'development'

module.exports = {
    app: {
        env,
        port: process.env.PORT || 3000,
        isDev: env === 'development',
        isProd: env === 'production',
        isTest: env === 'test',
        forceSync: process.env.DB_FORCE_SYNC === 'true'
    },

    db: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },

    bcrypt: { 
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10   //parseInt(string, base) convierte el string a decimal por eso base = 10
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        tokenSecret: process.env.JWT_ACTIVATION_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24hs',
        emailExpiresIn: process.env.JWT_EMAIL_EXPIRES_IN || '1hs'
    },

    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        from: process.env.EMAIL_FROM
    },

    /*log: {
        path: process.env.LOG_PATH || './logs/bitacora.json'
    }, */

    cors: {
        origin: process.env.FRONTEND_URL || '*'
    }
}