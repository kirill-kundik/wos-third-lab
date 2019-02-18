var express = require('express');
var router = express.Router();
var User = require('../models/user');


// GET route for reading data
router.get('/', function (req, res, next) {
    User.find().exec(function (err, data) {
       if (err)
           return callback(err);
        return res.render('index', {title: 'User dashboard', data: data});
    });
});


//POST route for updating data
router.post('/', function (req, res, next) {
    console.log(req.body);

    let userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    };

    User.create(userData, function (error, user) {
        if (error) {
            return next(error);
        } else {
            return res.redirect('/');
        }
    });
});

module.exports = router;