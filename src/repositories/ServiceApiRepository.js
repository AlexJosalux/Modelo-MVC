/**
 * repositories/ServiceApiRepository.js
 * ------------------------------------------------------------------
 * Patron REPOSITORY.
 *
 * Los controladores NUNCA llaman a axios directamente. Hablan con
 * este repositorio, que expone un lenguaje de negocio (listar, buscar
 * por id, crear, actualizar, eliminar) y oculta los detalles de como
 * y donde se obtienen realmente los datos (hoy una API REST externa;
 * manana podria ser otra API o una base de datos, sin que el resto
 * de la aplicacion se entere).
 *
 * Cada metodo esta decorado con withRetry (patron DECORATOR) para
 * tolerar fallas transitorias de la API externa (Disponibilidad).
 * ------------------------------------------------------------------
 */
const http = require('./ApiClient');
const withRetry = require('./withRetry');
const Service = require('../models/Service');

class ServiceApiRepository {
  async findAll() {
    const request = withRetry(() => http.get('/'));
    const { data } = await request();
    return data.map(Service.fromApiPayload);
  }

  async findById(id) {
    const request = withRetry(() => http.get(`/${encodeURIComponent(id)}`));
    const { data } = await request();
    return Service.fromApiPayload(data);
  }

  async create(serviceData) {
    const service = Service.fromForm(serviceData);
    const request = withRetry(() => http.post('/', service.toApiPayload()));
    const { data } = await request();
    return Service.fromApiPayload(data);
  }

  async update(id, serviceData) {
    const service = Service.fromForm({ ...serviceData, id });
    const request = withRetry(() => http.put(`/${encodeURIComponent(id)}`, service.toApiPayload()));
    const { data } = await request();
    return Service.fromApiPayload(data);
  }

  async delete(id) {
    const request = withRetry(() => http.delete(`/${encodeURIComponent(id)}`));
    await request();
    return true;
  }
}

// Se exporta una unica instancia: los controladores comparten el mismo repositorio.
module.exports = new ServiceApiRepository();
