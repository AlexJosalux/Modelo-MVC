/**
 * config/env.js
 * ------------------------------------------------------------------
 * Patron SINGLETON aplicado a la configuracion de la aplicacion.
 *
 * En lugar de leer process.env directamente en cada archivo (lo cual
 * dispersa el acceso a datos sensibles por todo el proyecto), se crea
 * UNA sola instancia de configuracion que el resto de la app importa.
 * Esto favorece la CONFIDENCIALIDAD: los valores sensibles (secretos,
 * URLs internas) viven en un unico punto controlado y nunca se
 * hardcodean en el codigo fuente, sino que vienen de variables de
 * entorno (.env, que esta excluido del control de versiones).
 * ------------------------------------------------------------------
 */
const dotenv = require('dotenv');
dotenv.config();

class EnvConfig {
  constructor() {
    if (EnvConfig.instance) {
      // Si ya existe una instancia, se reutiliza (Singleton).
      return EnvConfig.instance;
    }

    this.port = parseInt(process.env.PORT, 10) || 3000;
    this.apiBaseUrl = process.env.API_BASE_URL || 'https://api.restful-api.dev/objects';
    this.apiTimeoutMs = parseInt(process.env.API_TIMEOUT_MS, 10) || 5000;
    this.sessionSecret = process.env.SESSION_SECRET || 'clave_temporal_insegura_cambiar';
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.isProduction = this.nodeEnv === 'production';

    if (this.sessionSecret === 'clave_temporal_insegura_cambiar' && this.isProduction) {
      // Falla rapido en produccion si no se configuro un secreto real.
      throw new Error('Debe definir SESSION_SECRET en el archivo .env antes de ejecutar en produccion.');
    }

    EnvConfig.instance = this;
  }
}

// Se exporta la UNICA instancia (Singleton) ya construida.
module.exports = new EnvConfig();
