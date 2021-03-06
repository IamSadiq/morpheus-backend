const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Income = require('./income-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW INCOME
router.post('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        req.body.uid = req.userId;
        Income.create(req.body, (err, income)=>{
            if(err) return res.json({status: "failure"});
            return res.json({status: "success", income: income});
        });
    });
});

// RETURNS ALL THE INCOMES IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Income.find({}, (err, incomes) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the incomes."});
            if (!incomes) return res.status(404).send({status: "failure", message: "No income found."});
            res.status(200).send({status: "success", incomes: incomes});
        });
    });
});

// GETS A SINGLE INCOME FROM THE DATABASE -- > BY INCOME ID
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Income.findById(req.params.id, (err, income) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the income."});
            if (!income) return res.status(404).send({status: "failure", message: "No income found."});
            res.status(200).send({status: "success", income: income});
        });
    });
});

// UPDATES A SINGLE INCOME IN THE DATABASE -- > USER ID
router.put('/user/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Income.find({uid: req.params.id}, req.body, {new: true}, function (err, income) {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the income."});
            if (!income) return res.status(404).send({status: "failure", message: "No income found."});
            res.status(200).send({status: "success", income: income});
        });
    });
});

// DELETES A INCOME FROM THE DATABASE -> BY INCOME ID
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Income.deleteOne({_id: req.params.id}, (err, income) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the income."});
            if (!income) return res.status(404).send({status: "failure", message: "No income found."});
            res.status(200).json({status: "success", message: "Income successfully deleted."});
        });
    });
});

// DELETES A INCOME FROM THE DATABASE -> BY USER ID
router.delete('/user/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Income.deleteOne({uid: req.params.id}, (err, income) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the income."});
            if (!income) return res.status(404).send({status: "failure", message: "No income found."});
            res.status(200).json({status: "success", message: "Income successfully deleted."});
        });
    });
});

// DELETES ALL INCOMES FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Income.deleteMany({}, (err, incomes) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting incomes."});
            if (incomes.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete incomes."});
            res.status(200).json({status: "success", message: "Incomes successfully deleted."});
        });
    });
});

module.exports = router;