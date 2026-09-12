/**
 * src/app.js
 * ------------------------------------------------------------------
 * Punto de entrada de la aplicacion. Aqui se arma la cadena de
 * middlewares (patron Chain of Responsibility de Express) en un
 * orden deliberado:
 *
 *   1) helmet            -> cabeceras seguras (Confidencialidad)
 *   2) rateLimiter        -> limite de peticiones (Disponibilidad)
 *   3) morgan             -> bitacora de accesos (auditoria)
 *   4) parsers/session     -> lectura de body, cookies y sesion
 *   5) attachCsrfToken     -> token CSRF disponible para las vistas
 *   6) rutas de la app
 *   7) 404 y manejador central de errores (Disponibilidad)
 * ------------------------------------------------------------------
 */
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const env = require('./config/env');
const { helmetMiddleware, rateLimiter } = require('./middlewares/security');
const { attachCsrfToken } = require('./middlewares/csrf');
const { notFoundHandler, generalErrorHandler } = require('./middlewares/errorHandler');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();

// --- Seguridad basica (Confidencialidad / Disponibilidad) ---------
app.use(helmetMiddleware);
app.use(rateLimiter);
app.disable('x-powered-by');

// --- Logging de accesos ---------------------------------------------
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// --- Parsers y sesion -------------------------------------------------
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // el cookie de sesion no es accesible desde JS del navegador
      sameSite: 'lax', // mitiga CSRF adicional
      secure: env.isProduction, // solo viaja por HTTPS en produccion
      maxAge: 1000 * 60 * 60, // 1 hora
    },
  }),
);
app.use(flash());
app.use(attachCsrfToken);

// --- Motor de vistas (EJS + layout comun) ----------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

app.use(express.static(path.join(__dirname, 'public')));

// --- Rutas de la aplicacion -------------------------------------------
app.get('/', (req, res) => res.redirect('/services'));
app.use('/services', serviceRoutes);

// --- 404 y manejador central de errores -------------------------------
app.use(notFoundHandler);
app.use(generalErrorHandler);

app.listen(env.port, () => {
  console.log(`Servidor escuchando en http://localhost:${env.port}`);
  console.log(`API consumida: ${env.apiBaseUrl}`);
});

module.exports = app;
