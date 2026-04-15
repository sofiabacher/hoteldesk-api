const sequelize = require('../config/db')
const bcrypt = require('bcrypt')

const Role = require('./Role')
const UserRole = require('./UserRole')
const { actualizarDVV } = require('../utils/integrity')

const { DataTypes } = require('sequelize')
const { bcrypt : bcryptConfig } = require('../config')
const { calcularDVH } = require('../utils/integrity')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { isEmail: { msg: "Formato de correo inválido" } },
        index: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },

    dni: {
        type: DataTypes.STRING(15),
        allowNull: null,
        unique: true,
        index: true
    },

    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'birthdate'  // Mapear a la columna 'birthdate' en la BD
    },

    photo: {
        type: DataTypes.STRING,   //URL de la imagen (guardada en /uploads)
        allowNull: true,
        defaultValue: null
    },

    userStateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },

    failedAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    dvh: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,  //Guardar la fecha de creación del registro y de su última actualización 

    hooks: {
        beforeCreate: async (user) => {   //Hashear password al crear un usuario nuevo o al cambiar la contraseña (es como un trigger de SQL)
            if (user.password) {
                user.password = await bcrypt.hash(user.password, bcryptConfig.saltRounds)
            }
            user.dvh = calcularDVH(user.toJSON())  //Para enviar solo los datos reales del usuario, sin métodos ni propiedades
        },

        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, bcryptConfig.saltRounds)
            }
            user.dvh = calcularDVH(user.toJSON())
        },

        afterCreate: async (user) => {
            const guestRole = await Role.findOne({ where: { name: 'guest' }})
            if (guestRole) {
                await UserRole.create({ userId: user.id, roleId: guestRole.id })
            } 

            await actualizarDVV(User, 'users', 'userStateId')
        },

        afterUpdate: async (user) => {
            await actualizarDVV(User, 'users', 'userStateId')
        },

        afterDestroy: async (user) => {
            await actualizarDVV(User, 'users', 'userStateId')
        }
    }
})

//Crear métodos personalizados al modelo
User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password)   //Compara la contraseña ingresada con la que está en la BD (this.password)
}

User.prototype.hasPermission = async function (permissionName) {
    const Permission = require('./Permission')

    const userPermissions = await Permission.findAll({   // Obtener permisos directos del usuario
        include: [{
            model: this.constructor,
            as: 'Users',  // Alias por defecto de Sequelize para User
            where: { id: this.id },
            through: { attributes: [] }
        }]
    })

    // Obtener permisos a través de roles
    const rolePermissions = await Permission.findAll({
        include: [{
            model: Role,
            as: 'Roles',  // Alias por defecto de Sequelize para Role
            include: [{
                model: this.constructor,
                as: 'Users',  // Alias por defecto de Sequelize para User
                where: { id: this.id },
                through: { attributes: [] }
            }],
            through: { attributes: [] }
        }]
    })

    // Combinar todos los permisos
    const allPermissions = [...userPermissions, ...rolePermissions]
    const permissionNames = allPermissions.map(p => p.name)

    return permissionNames.includes(permissionName)
}

module.exports = User