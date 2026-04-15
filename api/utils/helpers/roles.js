const ROLE_PRIORITY = ['admin', 'recepcionist', 'cleaning', 'guest']  //Orden de prioridad de los roles

/**
 * Determina el rol principal de un usuario según la prioridad definida.
 * @param {Array<{ name: string }>} roles  -Array de objetos de rol con propiedad `name`.
 * @returns {string}  -Rol principal según prioridad, o 'guest' como fallback.
 */
function getPrimaryRole(roles) {
    if (!Array.isArray(roles) || roles.length === 0) return 'guest'   //Verifica que tenga un rol y si no default 'guest

    const sorted = roles.sort(   //Ordena los roles del userio según la prioridad definida 
        (a, b) => ROLE_PRIORITY.indexOf(a.name) - ROLE_PRIORITY.indexOf(b.name)
    )

    return sorted[0]?.name || 'guest'  //Devuelve el nombre del 1° rol en la lista ordenada, si no hay = 'guest'
}

module.exports = {
    getPrimaryRole,
    ROLE_PRIORITY
}