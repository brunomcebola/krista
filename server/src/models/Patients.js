const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const crypto = require('crypto');

const PatientSchema = new mongoose.Schema({
    username: {
        type: String,
        default: 'user'    //alterar para gerar aleatorio
    },
    password: String,
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
        default: 2,
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
        type: String,
        minlength : 9,
        maxlength : 9,
        required: true
    },
    docName: {
        type: String,
        required: true
    },
    boxNum: {
        type: String,
        minlength : 12,
        maxlength : 12,
        required: true
    },
    salt: String
});

PatientSchema.methods.setPassword = function(password) { 
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
}; 

PatientSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.password === hash; 
}; 

PatientSchema.plugin(mongoosePaginate);

mongoose.model('Patient', PatientSchema);