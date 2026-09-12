/**
 * middlewares/csrf.js
 * ------------------------------------------------------------------
 * Proteccion CSRF (Cross-Site Request Forgery) implementada de forma
 * explicita con token por sesion (patron "Synchronizer Token").
 *
 * INTEGRIDAD: sin este control, un sitio malicioso podria inducir al
 * navegador de un usuario autenticado a enviar, sin que se de cuenta,
 * una peticion POST/PUT/DELETE hacia nuestra app (por ejemplo, borrar
 * un servicio). Al exigir un token secreto -ligado a la sesion- que
 * solo nuestras propias vistas conocen, esas peticiones falsificadas
 * son rechazadas.
 * ------------------------------------------------------------------
 */
const crypto = require('crypto');

/** Genera (o reutiliza) el token CSRF de la sesion actual y lo expone a las vistas. */
function attachCsrfToken(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(24).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
}

/** Verifica el token CSRF en peticiones que modifican datos (POST/PUT/DELETE). */
function verifyCsrfToken(req, res, next) {
  const tokenFromRequest = req.body._csrf || req.query._csrf;
  const tokenFromSession = req.session.csrfToken;

  if (!tokenFromSession || tokenFromRequest !== tokenFromSession) {
    return res.status(403).render('errors/403', {
      title: 'Peticion rechazada',
      message: 'Token de seguridad (CSRF) invalido o ausente. Vuelva a intentar desde el formulario.',
    });
  }
  return next();
}

module.exports = { attachCsrfToken, verifyCsrfToken };
