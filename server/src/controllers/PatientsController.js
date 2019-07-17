const mongoose = require('mongoose');
const Patient = mongoose.model('Patient');
const links = require('../links');

function check(req){
    return (links.includes(req.headers.referer))
}

module.exports = {
    async index(req, res) {
        if (check(req)){
            const { page } = req.query;
            const patients = await Patient.paginate({},{ page , limit:10 });
            return res.json(patients);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async show(req, res) {
        if (check(req)){
            const patient = await Patient.findOne({'hsn':req.params.hsn});
            return res.json(patient);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async log(req, res) {
        if (check(req)){
            const patient = await Patient.findOne({'username': req.body.user, 'password': req.body.pass});
            return res.send(patient);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async store(req, res) {
        if (check(req)){
            const patient = await Patient.create(req.body);
            return res.json(patient);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async update(req, res) {
        if (check(req)){
            const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {new: true});
            return res.json(patient)
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    }
}; 