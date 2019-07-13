const mongoose = require('mongoose');
const Doctor = mongoose.model('Doctor');

function check(req){
    return (req.headers.referer === 'https://kristahealthcare.netlify.com/MedicalLogin' || req.headers.referer === 'https://kristahealthcare.netlify.com/MedicalArea' || req.headers.referer === 'https://kristahealthcare.netlify.com/MedicalArea/Schedules') 
}

module.exports = {
    async index(req, res) {
        if (check(req)){
            const doctors = await Doctor.find();
            return res.json(doctors);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async show(req, res) {
        if (check(req)){
            const doctor = await Doctor.findOne({'medicalNumber':req.params.id});
            return res.json(doctor);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
        
    },

    async store(req, res) {
        if (check(req)){
            const doctor = await Doctor.create(req.body);
            return res.json(doctor);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async update(req, res) {
        if (check(req)){
            const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {new: true});
            return res.json(doctor);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    }
}; 