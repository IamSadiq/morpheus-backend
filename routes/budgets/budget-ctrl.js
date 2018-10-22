const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Budget = require('./budget-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW BUDGET
router.post('/', VerifyToken, (req, res) => {
    if(req.userId) {
        req.body.uid = req.userId;
        Budget.create(req.body, (err, budget)=>{
            if(err) return res.json({status: "failure"});
            return res.json({status: "success", budget: budget});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// RETURNS ALL THE BUDGETS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    if(req.userId) {
        Budget.find({}, (err, budgets) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budgets."});
            res.status(200).send({status: "success", budgets: budgets});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// GETS A SINGLE BUDGET FROM THE DATABASE --> BY BUDGET ID
router.get('/:id', VerifyToken, (req, res) => {
    if(req.userId) {
        Budget.findById(req.params.id, (err, budget) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budget."});
            res.status(200).send({status: "success", budget: budget});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// GETS A SINGLE BUDGET FROM THE DATABASE --> BY USER ID
router.get('/user/:id', VerifyToken, (req, res) => {
    if(req.userId) {
        Budget.find({uid: req.params.id}, (err, budget) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budget."});
            res.status(200).send({status: "success", budget: budget});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// UPDATES A SINGLE BUDGET IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    if(req.userId) {
        Budget.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, budget) {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budget."});
            res.status(200).send({status: "success", budget: budget});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES A BUDGET FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    if(req.userId) {
        Budget.deleteOne(req.params.id, (err, budget) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the budget."});
            res.status(200).json({status: "success", message: "Budget successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES ALL BUDGETS FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    if(req.userId) {
        Budget.deleteMany({}, (err, budgets) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting budgets."});
            if (budgets.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete budgets."});
            res.status(200).json({status: "success", message: "Budgets successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

module.exports = router;