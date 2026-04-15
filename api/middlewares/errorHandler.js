const { app } = require('../config')

module.exports = (err, req, res, next) => {
  console.error('Error no capturado:', err);

  res.status(err.status || 500).json({
    success: false,
    message: app.isProd ? 'Error interno del servidor' : err.message
  });
}