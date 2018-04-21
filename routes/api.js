var Collection = require('../models/Collection');

module.exports = function(app){
    app.post('/authentication/register', function(req, res){
        let attr1 = req.body.attr1;
        let attr2 = req.body.attr2;

        let collection = new Collection({
            attr1,
            attr2
        });

        Collection.createUser(collection, function(err, collection){
            console.log(err);
            if(err) res.status(401).json({})
            if(collection) res.status(200).json({})
        });
    });
}


