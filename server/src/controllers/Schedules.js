const mongoose = require('mongoose');
const db = mongoose.connection;

module.exports = {

    async new (req, res) {
        await db.createCollection(req.params.col);

        res.send();
    } 
    
}