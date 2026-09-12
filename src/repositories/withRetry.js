/**
 * repositories/withRetry.js
 * ------------------------------------------------------------------
 * Patron DECORATOR aplicado a llamadas HTTP.
 *
 * "Envuelve" cualquier funcion asincrona que hable con la API externa
 * y le agrega, sin modificar su codigo original, la capacidad de
 * reintentar automaticamente ante fallos transitorios (caidas de red,
 * timeouts, error 502/503). Esto favorece la DISPONIBILIDAD del
 * sistema: una falla momentanea de la API no tumba la operacion.
 * ------------------------------------------------------------------
 * @param {Function} fn función async a decorar
 * @param {Object} options { retries, delayMs }
 */
function withRetry(fn, { retries = 2, delayMs = 300 } = {}) {
  return async function decorated(...args) {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        // eslint-disable-next-line no-await-in-loop
        return await fn(...args);
      } catch (error) {
        lastError = error;
        const isRetryable =
          !error.response || (error.response.status >= 500 && error.response.status < 600);
        if (!isRetryable || attempt === retries) break;
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
    throw lastError;
  };
}

module.exports = withRetry;
