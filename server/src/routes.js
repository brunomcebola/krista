const express = require('express');
const routes = express.Router();

/* controladores dos pedidos */
const DoctorController = require('./controllers/DoctorController');
const PatientsController = require('./controllers/PatientsController');
const SchedulesController = require('./controllers/SchedulesController');
const ArduinoController = require('./controllers/ArduinoController');

routes.get('/doctors', DoctorController.index); //devolve uma lista dos médicos
routes.get('/doctors/:id', DoctorController.show);  //devolve um médico em especifico
routes.post('/doctors/new', DoctorController.store); //cria um novo médico
routes.put('/doctors/:id', DoctorController.update);    //atualiza as informações do médico especificado

routes.get('/patients', PatientsController.index);  //devolve os pacientes divididos por páginas
routes.get('/patients/:hsn', PatientsController.show);  //devolve um paciente especifico
routes.post('/patients/log', PatientsController.log);   //controla o login do paciente
routes.post('/patients/new', PatientsController.store); //cria um novo paciente
routes.post('/patients/update/:id', PatientsController.update); //atualiza a informação de um paciente
routes.post('/patients/checkUser', PatientsController.checkUsername); //verifica se o username já existe

routes.get('/schedules/:col', SchedulesController.new);   //cria nova colleção
routes.get('/schedules/info/:col', SchedulesController.info);     //obtem info medica
routes.put('/schedules/info/:col', SchedulesController.updateInfo);       //atualiza info medica
routes.post('/schedules/med/:col/:name', SchedulesController.medicine);       //obtem os medicamentos
routes.put('/schedules/med/:col', SchedulesController.newMed);      //cria ou atualiza medicamentos
routes.delete('/schedules/med/:col/:name', SchedulesController.delMed);     //elimina horario de medicação

routes.post('/arduino/:name', ArduinoController.data);  //permite à caixa obter o horário de um paciente

module.exports = routes;
