

const calcularDVH = (row) => {
  const values = Object.entries(row)    //Convierte el objeto en un array de pares [clave, valor
    .filter(([key]) => key !== 'dvh')    //Excluye el campo dvh del cálculo si existe
    .map(([, value]) => String(value))  //Convierte cada valor a texto
    .join('')  //Une todos los valores en un solo string

  return calcularNumDvh(values)
}

function calcularNumDvh(string) {
  const digits = string
    .split("")
    .filter(d => /\d/.test(d))       // Solo dígitos
    .map(d => parseInt(d, 10))       // Convertir a número base 10

  let weight = 2
  let sum = 0

  for (let i = digits.length - 1; i >= 0; i--) {   //Multiplica por pesos desde la derecha (2,3,4, ..)
    sum += digits[i] * weight
    weight++
    if (weight > 7) weight = 2
  }

  const rest = sum % 11
  const dvh = 7 - rest      //Calcular el módulo 11
  return dvh === 7 ? 0 : dvh
}

const verificarDVHRegistro = async (Model, id) => {   //Verifica el DVH individual
  try {
    const record = await Model.findByPk(id)
    if (!record || !record.dvh) return false

    const expectedDVH = calcularDVH(record.toJSON())
    return record.dvh === expectedDVH
  } catch (error) {
    return false
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------//

const calcularDVV = (registers, estadoCampo = 'userStateId', estadoActivo = 1) => {    //Calcula el DVV tomando los DVH de los registros activos
  const dvhList = registers    //Filtrar registros activos y DVH válidos
    .filter(r => r && r[estadoCampo] === estadoActivo)
    .map(r => r.dvh)
    .filter(dvh => typeof dvh === 'number' && !isNaN(dvh))

  if (dvhList.length === 0) return 0

  const digits = dvhList    //Convierte a dígitos
    .join('')
    .split('')
    .filter(ch => /\d/.test(ch))
    .map(ch => parseInt(ch, 10))

  if (digits.length === 0) return 0

  let sum = 0     //Hace el módulo 11 con pesos 2...7
  let weight = 2

  for (let i = digits.length - 1; i >= 0; i--) {
    sum += digits[i] * weight
    weight = weight < 7 ? weight + 1 : 2
  }

  const rest = sum % 11    //Calculo final DVV
  const dvv = 11 - rest

  return dvv === 11 ? 0 : dvv     //Ajuste estándar: si da 11, devolver 0
}

const actualizarDVV = async (Model, tableName, estadoCampo = 'userStateId', estadoActivo = 1) => {   //Recalcula el DVV de una tabla y lo guarda en Integrity
  const attributes = ['dvh']
  if (estadoCampo) {
    attributes.push(estadoCampo)
  }

  const registros = await Model.findAll({
    attributes: attributes,
    raw: true
  })

  const nuevoDVV = calcularDVV(registros, estadoCampo, estadoActivo)
  const Integrity = require('../models/Integrity')

  await Integrity.upsert({
    tableName,
    dvv: nuevoDVV
  })

  return nuevoDVV
}

const verificarDVV = async (Model, tableName, estadoCampo = 'userStateId', estadoActivo = 1) => {   //Verifica que el DVV guardado coincida con el real
  const attributes = ['dvh']
  if (estadoCampo) {
    attributes.push(estadoCampo)
  }

  const registros = await Model.findAll({
    attributes: attributes,
    raw: true
  })

  const dvvCalculado = calcularDVV(registros, estadoCampo, estadoActivo)

  const Integrity = require('../models/Integrity')
  const row = await Integrity.findByPk(tableName)

  if (!row) return false

  return row.dvv === dvvCalculado
}

const repararDVV = async (Model, tableName, estadoCampo = 'userStateId', estadoActivo = 1) => {  //Reparar el DVV de una tabla específica
  try {
    const nuevoDVV = await actualizarDVV(Model, tableName, estadoCampo, estadoActivo)
    return { success: true, dvv: nuevoDVV, message: `DVV actualizado para ${tableName}` }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------//

const getTableConfigurations = () => {
  const { User, Role, Room, Booking, Permission, UserRole, UserPermission, RolePermission } = require('../models')

  return {
    models: { User, Role, Room, Booking, Permission, UserRole, UserPermission, RolePermission },
    tables: [
      { Model: User, name: 'users', estadoCampo: 'userStateId', estadoActivo: 1 },
      { Model: Role, name: 'roles', estadoCampo: null, estadoActivo: null },
      { Model: Room, name: 'rooms', estadoCampo: 'roomStateId', estadoActivo: 1 },
      { Model: Booking, name: 'bookings', estadoCampo: 'status', estadoActivo: 'confirmed' },
      { Model: Permission, name: 'permissions', estadoCampo: null, estadoActivo: null },
      { Model: UserRole, name: 'user_roles', estadoCampo: null, estadoActivo: null },
      { Model: UserPermission, name: 'user_permissions', estadoCampo: null, estadoActivo: null },
      { Model: RolePermission, name: 'role_permissions', estadoCampo: null, estadoActivo: null }
    ]
  }
}

const getTableModels = () => {  //Mapeo de nombres de tabla a modelos
  const { models } = getTableConfigurations()
  return {
    'users': models.User,
    'roles': models.Role,
    'rooms': models.Room,
    'bookings': models.Booking,
    'permissions': models.Permission,
    'user_roles': models.UserRole,
    'user_permissions': models.UserPermission,
    'role_permissions': models.RolePermission
  }
}

const verificarIntegrityTotal = async () => {   //Verificación de integridad para todas las tablas
  const { tables } = getTableConfigurations()
  const results = []

  for (const table of tables) {
    try {
      const isValid = await verificarDVV(
        table.Model,
        table.name,
        table.estadoCampo,
        table.estadoActivo
      )

      results.push({
        table: table.name,
        status: isValid ? 'OK' : 'ERROR',
        isValid
      })

    } catch (error) {
      results.push({
        table: table.name,
        status: 'ERROR',
        isValid: false,
        error: error.message
      })
    }
  }

  return results
}

const generarReporteIntegrity = async () => {    //Generar resporte de integridad
  const results = await verificarIntegrityTotal()

  const summary = {
    totalTables: results.length,
    validTables: results.filter(r => r.isValid).length,
    invalidTables: results.filter(r => !r.isValid).length,
    status: results.every(r => r.isValid) ? 'Sistema: OK' : 'Sistema: ERRORES',
    timestamp: new Date().toISOString()
  }

  return { summary, details: results }
}


module.exports = {
  calcularDVH,
  calcularDVV,
  actualizarDVV,
  verificarDVV,
  verificarIntegrityTotal,
  verificarDVHRegistro,
  repararDVV,
  generarReporteIntegrity,
  getTableConfigurations,
  getTableModels
}