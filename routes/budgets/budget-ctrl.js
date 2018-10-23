const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Budget = require('./budget-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW BUDGET
router.post('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        req.body.uid = req.userId;
        Budget.create(req.body, (err, budget)=>{
            if(err) return res.json({status: "failure"});
            return res.json({status: "success", budget: budget});
        });
    });
});

// RETURNS ALL THE BUDGETS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Budget.find({}, (err, budgets) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budgets."});
            res.status(200).send({status: "success", budgets: budgets});
        });
    });
});

// GETS A SINGLE BUDGET FROM THE DATABASE --> BY BUDGET ID
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Budget.findById(req.params.id, (err, budget) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budget."});
            res.status(200).send({status: "success", budget: budget});
        });
    });
});

// GETS A SINGLE BUDGET FROM THE DATABASE --> BY USER ID
router.get('/user/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Budget.find({uid: req.params.id}, (err, budget) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budget."});
            res.status(200).send({status: "success", budget: budget});
        });
    });
});

// UPDATES A SINGLE BUDGET IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Budget.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, budget) {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budget."});
            res.status(200).send({status: "success", budget: budget});
        });
    });
});

// DELETES A BUDGET FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Budget.deleteOne(req.params.id, (err, budget) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budget."});
            res.status(200).json({status: "success", message: "Budget successfully deleted."});
        });
    });
});

// DELETES ALL BUDGETS FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Budget.deleteMany({}, (err, budgets) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting budgets."});
            if (budgets.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete budgets."});
            res.status(200).json({status: "success", message: "Budgets successfully deleted."});
        });
    });
});

module.exports = router;