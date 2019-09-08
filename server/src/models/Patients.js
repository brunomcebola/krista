const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const crypto = require('crypto');

const PatientSchema = new mongoose.Schema({
    username: String,
    hsn: {
        type: String,
        minlength : 9,
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
        required: true
    },
    docName: {
        type: String,
        required: true
    },
    boxNum: {
        type: String,
        minlength : 12,
        required: true
    },
    hash : String, 
    saltPass : String,
    saltUser:  String,
});

PatientSchema.methods.setPassword = function(password) { 
    this.saltPass = crypto.randomBytes(16).toString('hex'); 
    this.hash = crypto.pbkdf2Sync(password, this.saltPass, 1000, 64, `sha512`).toString(`hex`); 
}; 

PatientSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password, this.saltPass, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
};

PatientSchema.methods.setUserSalt = function() { 
    this.saltUser = crypto.randomBytes(16).toString('hex');
}; 

PatientSchema.methods.getUserHash = function(username) { 
    return crypto.pbkdf2Sync(username, this.saltUser, 1000, 64, `sha512`).toString(`hex`); 
}; 

PatientSchema.plugin(mongoosePaginate);

mongoose.model('Patient', PatientSchema);