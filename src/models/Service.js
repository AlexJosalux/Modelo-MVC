/**
 * models/Service.js
 * ------------------------------------------------------------------
 * Modelo de dominio "Servicio" + patron FACTORY METHOD.
 *
 * En vez de construir el objeto Service con "new Service(...)" desde
 * cualquier parte del codigo (repartiendo el conocimiento de la forma
 * exacta del JSON de la API), se centraliza esa construccion en
 * metodos de fabrica estaticos: Service.fromApiPayload() y
 * Service.fromForm(). Si la API externa cambia su formato, solo se
 * ajusta este archivo.
 * ------------------------------------------------------------------
 */
class Service {
  constructor({ id = null, name, category, price, available, notes }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.available = available;
    this.notes = notes;
  }

  /** Fabrica un Service a partir del JSON que devuelve la API externa. */
  static fromApiPayload(payload) {
    const data = payload.data || {};
    return new Service({
      id: payload.id,
      name: payload.name,
      category: data.categoria ?? 'Sin categoria',
      price: typeof data.precio === 'number' ? data.precio : null,
      available: data.disponible !== undefined ? Boolean(data.disponible) : true,
      notes: data.notas ?? '',
    });
  }

  /** Fabrica un Service a partir de los datos ya validados de un formulario. */
  static fromForm(body) {
    return new Service({
      id: body.id || null,
      name: body.name,
      category: body.category,
      price: body.price !== '' && body.price !== undefined ? Number(body.price) : null,
      available: body.available === 'on' || body.available === true,
      notes: body.notes || '',
    });
  }

  /** Convierte el modelo interno al formato que espera la API externa. */
  toApiPayload() {
    return {
      name: this.name,
      data: {
        categoria: this.category,
        precio: this.price,
        disponible: this.available,
        notas: this.notes,
      },
    };
  }
}

module.exports = Service;
