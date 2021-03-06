const express = require('express');
const router = express.Router();
const User = require('./user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW USER
router.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.find({username: req.body.username}, {password: 0}, (err, sess_user) => {
        if (sess_user[0]) return res.status(500).send({status: "failure", message: "Username is taken."});

        if (!sess_user[0]){
            var token = jwt.sign({ id: req.body.password }, "jesuismorpheus");
            req.body.apiKey = token;
            
            User.create(req.body, (err, user) => {
                if (err) return res.status(500).send({status: "failure", message: "There was a problem adding the information to the database."});
                res.status(200).send({ status: 'success', user: user });
            });
        }
    });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        User.find({}, {password: 0, apiKey: 0}, (err, users) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the users."});
            return res.status(200).send(users);
        });
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        User.findById(req.params.id, (err, user) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});
            return res.status(200).send(user);
        });
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8);

    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            return res.status(200).send(user);
        });
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        User.deleteOne({_id: req.params.id}, (err, user) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});
            return res.status(200).json({status: "success", message: "User successfully deleted."});
        });
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        User.deleteMany({}, (err, user) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});
            return res.status(200).json({status: "success", message: "Users successfully deleted."});
        });
    });
});


module.exports = router;