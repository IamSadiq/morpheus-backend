const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
    User.find({email: req.body.password}, (err, user) => {
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the users."});
        if (!user) return res.status(500).send({status: "failure", reason: "No such user found."});

        if(bcrypt.compareSync(req.body.password, user.password)) {
            // Passwords match
            res.status(200).send({status: "success", auth: true, apiKey: user.apiKey});
        } else {
            // Passwords don't match
            res.status(200).send({status: "failure", auth: false});
        }
    });
});