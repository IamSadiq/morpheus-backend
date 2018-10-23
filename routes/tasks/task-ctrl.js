const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Task = require('./task-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW TASK
router.post('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        let now = Date.now();
        req.body.uid = req.userId;
        req.body.startDate = new Date(now);
        req.body.endDate = new Date(now + 60 * 60 * 24 * req.body.duration * 1000);

        Task.create(req.body, (err, response)=>{
            if(err) return res.json({status: "failure", err: err});
            return res.json(response);
        });
    });
});

// RETURNS ALL THE TASKS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Task.find({}, (err, tasks) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the tasks."});
            return res.status(200).send({status: "success", tasks: tasks});
        });
    });
});

// GETS A SINGLE TASK FROM THE DATABASE --> BY USER ID
router.get('/user/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Task.find({uid: req.params.id}, (err, task) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the task."});
            return res.status(200).send({status: "success", task: task});
        });
    });
});

// GETS A SINGLE TASK FROM THE DATABASE --> BY TASK ID
router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Task.findById(req.params.id, (err, task) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the task."});
            return res.status(200).send({status: "success", task: task});
        });
    });
});

// UPDATES A SINGLE TASK IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Task.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, task) {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the task."});
            return res.status(200).send({status: "success", task: task});
        });
    });
});

// DELETES A TASK FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Task.deleteOne(req.params.id, (err, task) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem deleting the task."});
            return res.status(200).json({status: "success", message: "Task successfully deleted."});
        });
    });
});

// DELETES ALL TASKS FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Task.deleteMany({}, (err, tasks) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting tasks."});
            // if (tasks.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete tasks."});
            return res.status(200).json({status: "success", message: "Tasks successfully deleted."});
        });
    });
});

module.exports = router;