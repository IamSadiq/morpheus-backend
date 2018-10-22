const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Field = require('./field-model');
const Task = require('../tasks/task-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW FIELD
router.post('/', VerifyToken, (req, res) => {
    if(req.userId){
        Task.find({plantName: req.body.plantName}, (err, tasks) => {
            if(err) return res.json({status: "failure", message: "Failed to find tasks."});
            let taskIds = [];
            let fieldBudget = 0;

            tasks.forEach(elem => {
                taskIds.push({_id: elem._id});
                fieldBudget += elem.budget;
            });

            req.body.uid = req.userId;
            req.body.tasks = taskIds;
            req.body.totalBudget = fieldBudget;
            req.body.location = {
                longitude: req.body.long,
                latitude: req.body.lat,
                country: req.body.country,
                state: req.body.state,
                town: req.body.town,
            };

            Field.create(req.body, (err, field)=>{
                if(err) return res.json({status: "failure", message: "Failed to create fields.", err: err});
                return res.json({status: "success", field: field, tasks: tasks});
            });
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// RETURNS ALL THE FIELDS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    if(req.userId){
        Field.find({}, (err, fields) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the fields."});
            if (!fields) return res.status(404).send({status: "failure", message: "No fields found."});
            res.status(200).send({status: "success", fields: fields});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// GETS A SINGLE FIELD FROM THE DATABASE - BY USER ID
router.get('/user/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Field.find({uid: req.params.id}, (err, field) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the field."});
            if (!field) return res.status(404).send({status: "failure", message: "No field found."});
            res.status(200).send({status: "success", field: field});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// GETS A SINGLE FIELD FROM THE DATABASE - BY FIELD ID
router.get('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Field.findById(req.params.id, (err, field) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the field."});
            if (!field) return res.status(404).send({status: "failure", message: "No field found."});
            res.status(200).send({status: "success", field: field});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// UPDATES A SINGLE FIELD IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Field.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, field) {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the field."});
            if (!field) return res.status(404).send({status: "failure", message: "No field found."});
            res.status(200).send({status: "success", field: field});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES A FIELD FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Field.deleteOne(req.params.id, (err, field) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the field."});
            if (!field) return res.status(404).send({status: "failure", message: "No field found."});
            res.status(200).json({status: "success", message: "Field successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES ALL FIELDS FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    if(req.userId){
        Field.deleteMany({}, (err, fields) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting fields."});
            if (fields.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete fields."});
            res.status(200).json({status: "success", message: "Fields successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});


module.exports = router;