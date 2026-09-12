/**
 * middlewares/errorHandler.js
 * ------------------------------------------------------------------
 * Manejo centralizado de errores (ultimo eslabon de la cadena de
 * middlewares de Express).
 *
 * DISPONIBILIDAD: cualquier excepcion no controlada en un controlador
 * (por ejemplo, la API externa cayo, o devolvio algo inesperado)
 * termina aqui en lugar de tumbar el proceso de Node. El usuario
 * siempre recibe una pantalla de error controlada.
 *
 * CONFIDENCIALIDAD: en produccion nunca se muestra el stack trace ni
 * detalles internos del error al usuario final; solo se registran en
 * el log del servidor.
 * ------------------------------------------------------------------
 */
const env = require('../config/env');

function notFoundHandler(req, res) {
  res.status(404).render('errors/404', { title: 'Pagina no encontrada' });
}

// eslint-disable-next-line no-unused-vars
function generalErrorHandler(err, req, res, next) {
  const status = err.response?.status || err.status || 500;

  // Se registra el detalle completo solo del lado del servidor.
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.message);
  if (!env.isProduction) {
    console.error(err.stack);
  }

  res.status(status).render('errors/500', {
    title: 'Ocurrio un problema',
    message:
      status === 404
        ? 'El recurso solicitado no existe en la API.'
        : 'No se pudo completar la operacion. Intente nuevamente en unos minutos.',
    // El detalle tecnico solo se expone si NO estamos en produccion.
    detail: env.isProduction ? null : err.message,
  });
}

module.exports = { notFoundHandler, generalErrorHandler };
