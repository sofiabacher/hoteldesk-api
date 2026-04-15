
const User = require('./User')
const Log = require('./Log')

const Role = require('./Role')
const UserRole = require('./UserRole')
const Room = require('./Room')
const Booking = require('./Booking')

const Permission = require('./Permission')
const RolePermission = require('./RolePermission')
const UserPermission = require('./UserPermission')

const Integrity = require('./Integrity')

//Log and user (one to many)
User.hasMany(Log, { foreignKey: 'userId', as: 'logs', onDelete: 'SET NULL', onUpdate: 'CASCADE' })    //onDelete:'SET NULL' --> guardar logs aunque el usuario se elimina (pasa a null el id)
Log.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'SET NULL', onUpdate: 'CASCADE' })  //onUpdate:'CASCADE' --> si el id_user cambia, se actualiza en los logs relacionados

//Role and user (many to many)
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId', onDelete: 'CASCADE'})
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId', onDelete: 'CASCADE'})

//Role and Permission (many to many)
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId', onDelete: 'CASCADE'})
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId', onDelete: 'CASCADE'})

//User and Permission (many to many)
User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'userId', onDelete: 'CASCADE'})
Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'permissionId', onDelete: 'CASCADE'})

//User and Booking (one to many)
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' })

//Room and Booking (one to many)
Room.hasMany(Booking, { foreignKey: 'roomId', as: 'bookings', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
Booking.belongsTo(Room, { foreignKey: 'roomId', as: 'room', onDelete: 'CASCADE', onUpdate: 'CASCADE' })


module.exports = {
    User,
    Log,
    Role,
    UserRole,
    Room,
    Booking,
    Permission,
    RolePermission,
    UserPermission,
    Integrity
}