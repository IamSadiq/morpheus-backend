const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Task = require('./task-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW TASK
router.post('/', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err) => {
        if(err) return res.json({status: "failure", reason: "Failed to authenticate."});

        req.body.uid = req.userId;
        Task.create(req.body, (err, response)=>{
            if(err) return res.json({status: "failure"});
            return res.json({status: "success", taskId: response._id, status: "Pending"});
        });
    });
});

// RETURNS ALL THE TASKS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the users."});

        Task.find({}, (err, tasks) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the tasks."});
            if (!tasks) return res.status(404).send({status: "failure", reason: "No tasks found."});
            res.status(200).send({status: "success", tasks: tasks});
        });
    });
});

// GETS A SINGLE TASK FROM THE DATABASE
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});

        Task.findById(req.params.id, (err, task) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the task."});
            if (!task) return res.status(404).send({status: "failure", reason: "No task found."});
            res.status(200).send({status: "success", task: task});
        });
    });
});

// UPDATES A SINGLE TASK IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, sessUser) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the users."});

        Task.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, task) {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the task."});
            if (!task) return res.status(404).send({status: "failure", reason: "No task found."});
            res.status(200).send({status: "success", task: task});
        });
    });
});

// DELETES A TASK FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});

        Task.findByIdAndRemove(req.params.id, (err, task) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem deleting the task."});
            if (!task) return res.status(404).send({status: "failure", message: "No task found."});
            res.status(200).json({status: "success", message: "Task successfully deleted."});
        });
    });
});

// DELETES ALL TASKS FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => { // { password: 0 }projection
        if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the user."});

        Task.remove({}, (err, tasks) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting tasks."});
            if (tasks.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete tasks."});
            res.status(200).json({status: "success", message: "Tasks successfully deleted."});
        });
    });
});

module.exports = router;