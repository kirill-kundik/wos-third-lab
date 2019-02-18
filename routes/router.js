var express = require('express');
var router = express.Router();
var User = require('../models/user');

let nodemailer = require('nodemailer').createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'goliathusua@gmail.com',
        pass: '5654314kkv'
    }
});

// GET route for reading data
router.get('/', function (req, res, next) {
    User.find().exec(function (err, data) {
        if (err)
            return callback(err);
        return res.render('index', {title: 'User dashboard', data: data});
    });
});

router.post('/sendEmails', function (req, res) {

    User.find().exec(function (err, data) {
        if (err)
            return callback(err);
        data.forEach(function (item) {
            const mailOptions = {
                from: 'goliathusua@gmail.com',
                to: item['email'],
                subject: 'Foolish info',
                text: req.body.msg
            };

            nodemailer.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

        })
    });

    res.redirect('/')
});

//POST route for updating data
router.post('/', function (req, res, next) {

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