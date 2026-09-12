/**
 * middlewares/validators.js
 * ------------------------------------------------------------------
 * Validacion y saneamiento de entradas con express-validator.
 *
 * INTEGRIDAD: ningun dato escrito por el usuario llega al repositorio
 * (y de ahi a la API externa) sin antes pasar por reglas explicitas
 * de tipo, longitud y formato. Esto evita datos corruptos y reduce el
 * riesgo de inyeccion de contenido malicioso (por ejemplo, HTML/JS en
 * campos de texto que luego se muestran en las vistas).
 * ------------------------------------------------------------------
 */
const { body, param, validationResult } = require('express-validator');

const serviceValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del servicio es obligatorio.')
    .isLength({ min: 3, max: 120 })
    .withMessage('El nombre debe tener entre 3 y 120 caracteres.')
    .escape(),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La categoria es obligatoria.')
    .isLength({ max: 60 })
    .withMessage('La categoria no debe superar 60 caracteres.')
    .escape(),
  body('price')
    .notEmpty()
    .withMessage('El precio es obligatorio.')
    .bail()
    .isFloat({ min: 0, max: 999999 })
    .withMessage('El precio debe ser un numero positivo valido.'),
  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las notas no deben superar 500 caracteres.')
    .escape(),
  body('available').optional().toBoolean(),
];

const idParamRule = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('El identificador del servicio es obligatorio.')
    .isLength({ max: 100 })
    .escape(),
];

/**
 * Helper (no middleware) que el controlador invoca explicitamente para
 * saber si la peticion trae errores de validacion. Se deja como
 * funcion simple -y no como middleware que interrumpe la cadena- para
 * que cada controlador decida como responder (por ejemplo, volviendo
 * a renderizar el formulario con los datos ya escritos por el usuario).
 */
function getValidationErrors(req) {
  const result = validationResult(req);
  return result.isEmpty() ? null : result.array();
}

module.exports = { serviceValidationRules, idParamRule, getValidationErrors };
