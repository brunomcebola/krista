const mongoose = require('mongoose');
const db = mongoose.connection;
const Patient = mongoose.model('Patient');

module.exports = {
    async data(req,res){
        const patient = await Patient.findOne({'boxNum':req.body.boxNum});
        if(patient!==null) {
            const resp = await db.collection(`${'u'+patient.hsn}`).findOne({'name':req.params.name});
            return res.json(resp)
        }
        else {
            return res.send('caixa não registada');
        }        
    }
}