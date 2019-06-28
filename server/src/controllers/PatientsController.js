const mongoose = require('mongoose');
const Patient = mongoose.model('Patient');

module.exports = {
    async index(req, res) {
        const { page } = req.query;
        const patients = await Patient.paginate({},{ page , limit:10 });
        
        return res.json(patients);
    },

    async show(req, res) {
        const patient = await Patient.findOne({'hsn':req.params.hsn});

        return res.json(patient);
    },

    async store(req, res) {

       const patient = await Patient.create(req.body);
       
       return res.json(patient);

    },

    async update(req, res) {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {new: true});

        return res.json(patient);
    },

    /*  usado se chegar a fazer remoção dos medicos existentes
    
    async destroy(req, res) {
        await Doctor.findByIdAndRemove(req.params.id);

        return res.send();
    }
    
    */
}; 