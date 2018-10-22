const express = require('express');
const router = express.Router();
const User = require('./user-model');
const bcrypt = require('bcrypt');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW USER
router.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.find({email: req.body.email}, {password: 0}, (err, sess_user) => {

        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the users."});
        if (sess_user[0]) return res.status(500).send({status: "failure", reason: "User already exists."});

        if (!sess_user[0]){
            var token = "jesuismorpheus" + Date.now();
            req.body.apiKey = token;
            
            User.create(req.body, (err, user) => {
                if (err) return res.status(500).send({status: "failure", reason: "There was a problem adding the information to the database."});
                res.status(200).send({ status: 'success', apiKey: token, user_id: user._id });
            });
        }
    });
    
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0, apiKey: 0}, (err, user) => {
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the users."});

        User.find({}, {password: 0}, (err, users) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the users."});
            res.status(200).send(users);
        });
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});

        User.findById(req.params.id, (err, user) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});
            if (!user) return res.status(404).send({status: "failure", reason: "No user found."});
            res.status(200).send(user);
        });
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});

        User.findByIdAndRemove(req.params.id, (err, user) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});
            if (!user) return res.status(404).send({status: "failure", reason: "No user found."});
            res.status(200).json({status: "success", message: "User successfully deleted."});
        });
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8);

    User.findById(req.userId, { password: 0 }, (err, sessUser) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the users."});

        User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send(user);
        });
    });
});


module.exports = router;