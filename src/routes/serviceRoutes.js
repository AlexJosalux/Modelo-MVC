/**
 * routes/serviceRoutes.js
 * ------------------------------------------------------------------
 * Definicion de rutas (mapa URL -> Controller) del recurso "servicios".
 * Aqui se engancha la cadena de middlewares de seguridad especifica
 * de cada operacion: validacion de entrada + verificacion CSRF en
 * toda ruta que modifique datos (POST/PUT/DELETE).
 * ------------------------------------------------------------------
 */
const { Router } = require('express');
const controller = require('../controllers/serviceController');
const { serviceValidationRules, idParamRule } = require('../middlewares/validators');
const { verifyCsrfToken } = require('../middlewares/csrf');

const router = Router();

router.get('/', controller.index);
router.get('/new', controller.newForm);
router.get('/:id', idParamRule, controller.show);

router.post('/', verifyCsrfToken, serviceValidationRules, controller.create);

router.get('/:id/edit', idParamRule, controller.editForm);
router.put('/:id', idParamRule, verifyCsrfToken, serviceValidationRules, controller.update);

router.delete('/:id', idParamRule, verifyCsrfToken, controller.remove);

module.exports = router;
