const { validationResult } = require('express-validator')

const validateFields = (req, res, next) => {
    const errors = validationResult(req)  //Recolecta todos los errores de la validación de los campos

    if (!errors.isEmpty()) {

        return res.status(400).json(     //Devuelve los errores en un formato válido para el front
            {
                success: false,
                errores: errors.array().map(err => (
                    {
                        campo: err.param,
                        mensaje: err.msg
                    }
                )
                )
            })
    }

    next()  //Si no hay errores sigue 
}

module.exports = validateFields