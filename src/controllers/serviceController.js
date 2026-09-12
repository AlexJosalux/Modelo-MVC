/**
 * controllers/serviceController.js
 * ------------------------------------------------------------------
 * Capa CONTROLLER del patron MVC.
 *
 * Recibe la peticion HTTP, pide los datos al repositorio (nunca habla
 * directamente con axios ni con la API externa), y decide que VISTA
 * renderizar con que datos. No contiene reglas de negocio del dominio
 * (eso vive en el modelo) ni detalles de acceso a datos (eso vive en
 * el repositorio): separacion de responsabilidades propia de MVC.
 * ------------------------------------------------------------------
 */
const repository = require('../repositories/ServiceApiRepository');
const { getValidationErrors } = require('../middlewares/validators');

async function index(req, res, next) {
  try {
    const services = await repository.findAll();
    res.render('services/index', {
      title: 'Catalogo de servicios',
      services,
      flash: req.flash('success'),
    });
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const service = await repository.findById(req.params.id);
    res.render('services/show', { title: service.name, service });
  } catch (err) {
    next(err);
  }
}

function newForm(req, res) {
  res.render('services/form', {
    title: 'Nuevo servicio',
    service: {},
    errors: [],
    formAction: '/services',
    method: 'POST',
  });
}

async function create(req, res, next) {
  const errors = getValidationErrors(req);
  if (errors) {
    return res.status(422).render('services/form', {
      title: 'Nuevo servicio',
      service: req.body,
      errors,
      formAction: '/services',
      method: 'POST',
    });
  }
  try {
    await repository.create(req.body);
    req.flash('success', 'Servicio creado correctamente.');
    return res.redirect('/services');
  } catch (err) {
    return next(err);
  }
}

async function editForm(req, res, next) {
  try {
    const service = await repository.findById(req.params.id);
    res.render('services/form', {
      title: `Editar: ${service.name}`,
      service,
      errors: [],
      formAction: `/services/${service.id}?_method=PUT`,
      method: 'POST',
    });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  const errors = getValidationErrors(req);
  if (errors) {
    return res.status(422).render('services/form', {
      title: 'Editar servicio',
      service: { ...req.body, id: req.params.id },
      errors,
      formAction: `/services/${req.params.id}?_method=PUT`,
      method: 'POST',
    });
  }
  try {
    await repository.update(req.params.id, req.body);
    req.flash('success', 'Servicio actualizado correctamente.');
    return res.redirect('/services');
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await repository.delete(req.params.id);
    req.flash('success', 'Servicio eliminado correctamente.');
    res.redirect('/services');
  } catch (err) {
    next(err);
  }
}

module.exports = { index, show, newForm, create, editForm, update, remove };
