const mongoose = require('mongoose');
const db = mongoose.connection;

module.exports = {

    async new (req, res) {
        await db.createCollection(req.params.col);
        await db.collection(req.params.col).insertOne({name: 'info', text : ''});

        res.send('aa');
    },
    
    async update(req, res) {
        await db.collection(req.params.col).findOneAndUpdate({ 'name' : 'info' }, {$set: req.body});

        return res.send('bb');
    },

    async info(req, res) {
        const response = await db.collection(req.params.col).findOne({ 'name': 'info'});

        return res.json(response);
    }
    
}