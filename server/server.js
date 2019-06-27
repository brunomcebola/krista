const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const PORT = process.env.PORT || 3001

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
    'mongodb+srv://kristadmin:iRAhiSIFacrKpEo8@sitedata-xv2ex.mongodb.net/data?retryWrites=true&w=majority',
    { useNewUrlParser: true}
);

requireDir('./src/models');

app.use('/kristaApi', require('./src/routes'));

app.listen(PORT);