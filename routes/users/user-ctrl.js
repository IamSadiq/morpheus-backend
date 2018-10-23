const express = require('express');
const router = express.Router();
const User = require('./user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW USER
router.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    User.find({email: req.body.email}, {password: 0}, (err, sess_user) => {
        if (sess_user[0]) return res.status(500).send({status: "failure", reason: "User already exists."});

        if (!sess_user[0]){
            // var token = bcrypt.hashSync("jesuismorpheus" + Date.now(), 16);
            var token = jwt.sign({ id: req.body.email }, "jesuismorpheus");
            req.body.apiKey = token;
            
            User.create(req.body, (err, user) => {
                if (err) return res.status(500).send({status: "failure", reason: "There was a problem adding the information to the database."});
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
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the users."});
            return res.status(200).send(users);
        });
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken, (req, res) => {
    if(req.userId) {
        User.findById(req.params.id, (err, user) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});
            return res.status(200).send(user);
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8);

    if(req.userId) {
        User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            return res.status(200).send(user);
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    if(req.userId) {
        User.deleteOne(req.params.id, (err, user) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});
            return res.status(200).json({status: "success", message: "User successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES A USER FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    if(req.userId) {
        User.deleteMany({}, (err, user) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});
            return res.status(200).json({status: "success", message: "User successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});


module.exports = router;