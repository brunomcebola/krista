const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    medicalNumber: {
        type: Number,
        min : 100000000,
        max : 999999999,
    }
});

//ProductSchema.plugin(mongoosePaginate);   usado se chegar a fazer paginação dos medicos existentes

mongoose.model('Doctor', ProductSchema);