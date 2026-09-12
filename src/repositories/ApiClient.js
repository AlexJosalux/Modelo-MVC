/**
 * repositories/ApiClient.js
 * ------------------------------------------------------------------
 * Patron SINGLETON + wrapper de axios para consumir la API externa.
 *
 * Se crea una unica instancia de cliente HTTP con timeout configurado
 * (buena practica de DISPONIBILIDAD: evita que una peticion colgada a
 * la API externa bloquee la aplicacion indefinidamente) y con
 * cabeceras por defecto controladas.
 * ------------------------------------------------------------------
 */
const axios = require('axios');
const env = require('../config/env');

class ApiClient {
  constructor() {
    if (ApiClient.instance) {
      return ApiClient.instance;
    }

    this.http = axios.create({
      baseURL: env.apiBaseUrl,
      timeout: env.apiTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    ApiClient.instance = this;
  }

  getInstance() {
    return this.http;
  }
}

module.exports = new ApiClient().getInstance();
