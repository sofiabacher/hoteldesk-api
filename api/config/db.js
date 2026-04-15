const Sequelize = require('sequelize')
const { db, app } = require('.')

const sequelize = new Sequelize(
    db.name, 
    db.user, 
    db.password,
    
    {
        host: db.host,
        dialect: db.dialect,
        logging: app.isDev ? console.log : false,   //mostrar las consultas SQL por consola (true = console.log)
        timezone: '-03:00'     //Argentina
    }
);

module.exports = sequelize