const mongoose = require('mongoose');
const db = mongoose.connection;

module.exports = {

    async new (req, res) {
        await db.createCollection(req.params.col);
        await db.collection(req.params.col).insertOne({name: 'info', text : ''});

        res.send();
    },
    
    async updateInfo(req, res) {
        await db.collection(req.params.col).findOneAndUpdate({ 'name' : 'info' }, {$set: req.body});

        return res.send();
    },

    async info(req, res) {
        const response = await db.collection(req.params.col).findOne({ 'name': 'info'});

        return res.json(response);
    },

    async newMed(req, res) {
        const response = await db.collection(req.params.col).findOne({ 'name': req.body.name});

        if(response === null){
            await db.collection(req.params.col).insertOne(req.body);
        } 
        else{
            await db.collection(req.params.col).findOneAndUpdate({ 'name' : req.body.name }, {$set: req.body});
        }

        return res.send();
    },

    async delMed(req, res) {
        await db.collection(req.params.col).findOneAndDelete({ 'name' : req.params.name });

        return res.send();
    },

    async medicine(req, res) {
        const response = await db.collection(req.params.col).findOne({ 'name': req.params.name });

        return res.json(response)
    }
}