const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Field = require('./field-model');
const Task = require('../tasks/task-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW FIELD
router.post('/', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err) => {
        if(err) return res.json({status: "failure", message: "Failed to authenticate."});

        Task.find({plantName: req.body.plantName}, (err, tasks) => {
            if(err) return res.json({status: "failure", message: "Failed to find tasks."});
            let taskIds = [];
            let fieldBudget = 0;

            tasks.forEach(elem => {
                taskIds.push({taskId: elem._id});
                fieldBudget += elem.budget;
            });

            req.body.uid = req.userId;
            req.body.tasks = taskIds;
            req.body.totalBudget = fieldBudget;

            Field.create(req.body, (err, field)=>{
                if(err) return res.json({status: "failure", message: "Failed to create fields."});
                return res.json({status: "success", fieldId: field._id, tasks: tasks});
            });
        });
    });
});

// RETURNS ALL THE FIELDS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the users."});

        Field.find({}, (err, fields) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the fields."});
            if (!fields) return res.status(404).send({status: "failure", message: "No fields found."});
            res.status(200).send({status: "success", fields: fields});
        });
    });
});

// GETS A SINGLE FIELD FROM THE DATABASE - BY USER ID
router.get('/user/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});

        Field.find({uid: req.params.id}, (err, field) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the field."});
            if (!field) return res.status(404).send({status: "failure", message: "No field found."});
            res.status(200).send({status: "success", field: field});
        });
    });
});

// GETS A SINGLE FIELD FROM THE DATABASE - BY FIELD ID
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});

        Field.findById(req.params.id, (err, field) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the field."});
            if (!field) return res.status(404).send({status: "failure", message: "No field found."});
            res.status(200).send({status: "success", field: field});
        });
    });
});

// UPDATES A SINGLE FIELD IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, sessUser) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the users."});

        Field.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, field) {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the field."});
            if (!field) return res.status(404).send({status: "failure", message: "No field found."});
            res.status(200).send({status: "success", field: field});
        });
    });
});

// DELETES A FIELD FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});

        Field.findByIdAndRemove(req.params.id, (err, field) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the field."});
            if (!field) return res.status(404).send({status: "failure", message: "No field found."});
            res.status(200).json({status: "success", message: "Field successfully deleted."});
        });
    });
});

// DELETES ALL FIELDS FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});

        Field.remove({}, (err, fields) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting fields."});
            if (fields.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete fields."});
            res.status(200).json({status: "success", message: "Fields successfully deleted."});
        });
    });
});


module.exports = router;