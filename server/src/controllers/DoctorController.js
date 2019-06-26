const mongoose = require('mongoose');
const Doctor = mongoose.model('Doctor');

module.exports = {
    async index(req, res) {
        /*  usado se chegar a fazer paginação dos medicos existentes
        
        const { page } = req.query;
        const doctors = await Doctor.paginate({},{ page , limit:10 });
        
        */
        const doctors = await Doctor.find();
        
        return res.json(doctors);
    },

    async show(req, res) {
        const doctor = await Doctor.findOne({'medicalNumber':req.params.id});

        return res.json(doctor);
    },

    async store(req, res) {

       const doctor = await Doctor.create(req.body);
       
       return res.json(doctor);

    },

    async update(req, res) {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {new: true});

        return res.json(doctor);
    },

    /*  usado se chegar a fazer remoção dos medicos existentes
    
    async destroy(req, res) {
        await Doctor.findByIdAndRemove(req.params.id);

        return res.send();
    }
    
    */
}; 