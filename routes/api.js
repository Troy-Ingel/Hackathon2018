var User = require('../models/User');

module.exports = function(app){
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    app.get('/user/:id', function(req, res) {
        User.find({_id: req.params.id}, function(err, user){
            res.json(user[0]);
        })
    });
    app.post('/user', function(req, res) {
        let user = {
            name: req.body.name,
            first_score: req.body.first_score,
            latest_score: req.body.first_score
        }

        User.create(user, function(err, user){
            if(err) console.log('cant create user');
            if(user) console.log('user create');
            res.json(user);
        });
    });
    app.post('/user/:id', function(req, res) {
        console.log(req.body);
        User.update({"_id": req.body._id}, {latest_score: req.body.latest_score}, function(err, user){
            if(err) console.log(err);
            if(user) console.log(user);
            console.log(user);

            User.find({_id: req.params.id}, function(err, user){
                res.json(user[0]);
            })
        });
    });

    app.get('/users', function(req, res) {
        User.find({}, function(err, users){
            if(err) console.log(err);
            if(users) console.log(users);

            res.json(users);
        })
    });
}
