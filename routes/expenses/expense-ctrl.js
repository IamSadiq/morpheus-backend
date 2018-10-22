const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Expense = require('./expense-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW EXPENSE
router.post('/', VerifyToken, (req, res) => {
    if(req.userId){
        req.body.uid = req.userId;
        Expense.create(req.body, (err, expense)=>{
            if(err) return res.json({status: "failure"});
            return res.json({status: "success", expense: expense});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// RETURNS ALL THE EXPENSES IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    if(req.userId){
        Expense.find({}, (err, expenses) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expenses."});
            if (!expenses) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expenses: expenses});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// GETS A SINGLE EXPENSE FROM THE DATABASE
router.get('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Expense.findById(req.params.id, (err, expense) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expense: expense});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// UPDATES A SINGLE EXPENSE IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Expense.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, expense) {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).send({status: "success", expense: expense});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES A EXPENSE FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Expense.deleteOne(req.params.id, (err, expense) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the expense."});
            if (!expense) return res.status(404).send({status: "failure", message: "No expense found."});
            res.status(200).json({status: "success", message: "Expense successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES ALL EXPENSES FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    if(req.userId){
        Expense.deleteMany({}, (err, expenses) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting expenses."});
            if (expenses.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete expenses."});
            res.status(200).json({status: "success", message: "Expenses successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

module.exports = router;