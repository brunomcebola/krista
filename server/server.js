const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const requireDir = require('require-dir');

const PORT = process.env.PORT || 3001

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({}));

//ligação à base de dados
mongoose.connect(
    'connection string here',
    { useNewUrlParser: true}
);

requireDir('./src/models');

app.use('', require('./src/routes'));

app.listen(PORT);
