const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const PatientSchema = new mongoose.Schema({
    username: {
        type: String,
        default: 'user'    //alterar para gerar aleatorio
    },
    password: {
        type: String,
        default: 'krista'   //alterar para gerar aleatoria
    },
    hsn: {
        type: String,
        minlength : 9,
        maxlength : 9,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    sex: {
        type: Number,
        default: 0,
    },
    age: {
        type: Number,
        default: 18
    },
    changed: {
        type: Number,
        default: 0,
    },
    docNum: {
        type: Number,
        required: true
    }
});

PatientSchema.plugin(mongoosePaginate);

mongoose.model('Patient', PatientSchema);