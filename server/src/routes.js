const express = require('express');
const routes = express.Router();

const DoctorController = require('./controllers/DoctorController');
const PatientsController = require('./controllers/PatientsController');
const Schedules = require('./controllers/Schedules');
const ArduinoController = require('./controllers/ArduinoController');

routes.get('/doctors', DoctorController.index);
routes.get('/doctors/:id', DoctorController.show);
routes.post('/doctors/new', DoctorController.store);
routes.put('/doctors/:id', DoctorController.update);

routes.get('/patients', PatientsController.index);
routes.get('/patients/:hsn', PatientsController.show);
routes.post('/patients/log', PatientsController.log);
routes.post('/patients/new', PatientsController.store);
routes.post('/patients/update/:id', PatientsController.update);
routes.post('/patients/checkUser', PatientsController.checkUsername);

routes.get('/schedules/:col', Schedules.new);   //cria nova colleção
routes.get('/schedules/info/:col', Schedules.info);     //obtem info medica
routes.put('/schedules/info/:col', Schedules.updateInfo);       //atualiza info medica
routes.post('/schedules/med/:col/:name', Schedules.medicine);       //obtem os medicamentos
routes.put('/schedules/med/:col', Schedules.newMed);      //cria ou atualiza medicamentos
routes.delete('/schedules/med/:col/:name', Schedules.delMed);     //elimina horario de medicação

routes.post('/arduino/:name', ArduinoController.data);

module.exports = routes;
