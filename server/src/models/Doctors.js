const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    medicalNumber: {
        type: String,
        minlength : 9,
        maxlength : 9,
        required: true
    }
});

//DoctorSchema.plugin(mongoosePaginate);   usado se chegar a fazer paginação dos medicos existentes

mongoose.model('Doctor', DoctorSchema);