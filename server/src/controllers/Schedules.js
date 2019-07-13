const mongoose = require('mongoose');
const db = mongoose.connection;

function check(req){
    return (req.headers.referer === 'https://kristahealthcare.netlify.com/MedicalLogin' || req.headers.referer === 'https://kristahealthcare.netlify.com/MedicalArea' || req.headers.referer === 'https://kristahealthcare.netlify.com/MedicalArea/Schedules') 
}

module.exports = {

    async new (req, res) {
        if (check(req)){
            await db.createCollection(req.params.col);
            await db.collection(req.params.col).insertOne({name: 'info', text : ''});
            res.send();
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },
    
    async updateInfo(req, res) {
        if (check(req)){
            await db.collection(req.params.col).findOneAndUpdate({ 'name' : 'info' }, {$set: req.body});
            return res.send();
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async info(req, res) {
        if (check(req)){
            const response = await db.collection(req.params.col).findOne({ 'name': 'info'});
            return res.json(response);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async newMed(req, res) {
        if (check(req)){
            const response = await db.collection(req.params.col).findOne({ 'name': req.body.name});
            if(response === null){
                await db.collection(req.params.col).insertOne(req.body);
            } 
            else{
                await db.collection(req.params.col).findOneAndUpdate({ 'name' : req.body.name }, {$set: req.body});
            }
            return res.send();
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async delMed(req, res) {
        if (check(req)){
            await db.collection(req.params.col).findOneAndDelete({ 'name' : req.params.name });
            return res.send();
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    async medicine(req, res) {
        if (check(req)){
            const response = await db.collection(req.params.col).findOne({ 'name': req.params.name });
            return res.json(response)
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    }
}