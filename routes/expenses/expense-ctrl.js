const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Expense = require('./expense-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW EXPENSE
router.post('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        req.body.uid = req.userId;
        Expense.create(req.body, (err, expense)=>{
            if(err) return res.json({status: "failure"});
            return res.json({status: "success", expense: expense});
        });
    });
});

// RETURNS ALL THE EXPENSES IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Expense.find({}, (err, expenses) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expenses."});
            if (!expenses) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expenses: expenses});
        });
    });
});

// GETS A SINGLE EXPENSE FROM THE DATABASE
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Expense.findById(req.params.id, (err, expense) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expense: expense});
        });
    });
});

// UPDATES A SINGLE EXPENSE IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Expense.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, expense) {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expense: expense});
        });
    });
});

// DELETES A EXPENSE FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Expense.deleteOne(req.params.id, (err, expense) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).json({status: "success", message: "Expense successfully deleted."});
        });
    });
});

// DELETES ALL EXPENSES FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");
        
        Expense.deleteMany({}, (err, expenses) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting expenses."});
            if (expenses.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete expenses."});
            res.status(200).json({status: "success", message: "Expenses successfully deleted."});
        });
    });
});

module.exports = router;