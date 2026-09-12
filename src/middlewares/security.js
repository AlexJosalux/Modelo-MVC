/**
 * middlewares/security.js
 * ------------------------------------------------------------------
 * Middlewares de seguridad transversales (patron CHAIN OF
 * RESPONSIBILIDAD propio de Express: cada request pasa por una
 * cadena de funciones antes de llegar al controlador).
 *
 *  - helmet()      -> CONFIDENCIALIDAD: cabeceras HTTP seguras,
 *                     oculta tecnologia del servidor, activa CSP,
 *                     evita sniffing de tipo MIME, clickjacking, etc.
 *  - rateLimiter    -> DISPONIBILIDAD: limita cuantas peticiones puede
 *                     hacer una misma IP en una ventana de tiempo,
 *                     mitigando ataques de fuerza bruta / DoS basico.
 * ------------------------------------------------------------------
 */
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:'],
    },
  },
});

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // maximo 100 peticiones por IP por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Ha superado el limite de peticiones permitidas. Intente nuevamente en un minuto.',
  },
});

module.exports = { helmetMiddleware, rateLimiter };
