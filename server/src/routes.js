const express = require('express');
const routes = express.Router();

const DoctorController = require('./controllers/DoctorController');
const PatientsController = require('./controllers/PatientsController');
const Schedules = require('./controllers/Schedules');

routes.get('/doctors', DoctorController.index);
routes.get('/doctors/:id', DoctorController.show);
routes.post('/doctors/new', DoctorController.store);
routes.put('/doctors/:id', DoctorController.update);

routes.get('/patients', PatientsController.index);
routes.get('/patients/:hsn', PatientsController.show);
routes.post('/patients/new', PatientsController.store);

routes.get('/tests/:col', Schedules.new);


//routes.delete('/products/:id', ProductController.destroy);    usado se chegar a fazer remoção dos medicos existentes

module.exports = routes;
