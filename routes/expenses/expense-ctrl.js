const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Expense = require('./expense-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW Expense
router.post('/', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err) => {
        if(err) return res.json({status: "failure", message: "Failed to authenticate."});

        Expense.create(req.body, (err, expense)=>{
            if(err) return res.json({status: "failure"});
            return res.json({status: "success", expense: expense});
        });
    });
});

// RETURNS ALL THE Expense IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the users."});

        Expense.find({}, (err, expenses) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expenses."});
            if (!fields) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expenses: expenses});
        });
    });
});

// GETS A SINGLE Expense FROM THE DATABASE
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});

        Expense.findById(req.params.id, (err, expense) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expense: expense});
        });
    });
});

// UPDATES A SINGLE Expense IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, sessUser) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the users."});

        Expense.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, expense) {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expense: expense});
        });
    });
});

// DELETES A Expense FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});

        Expense.findByIdAndRemove(req.params.id, (err, expense) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).json({status: "success", message: "Expense successfully deleted."});
        });
    });
});


module.exports = router;