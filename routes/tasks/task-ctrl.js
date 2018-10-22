const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const Task = require('./task-model');
const VerifyToken = require('../auth/VerifyToken');

// CREATES A NEW TASK
router.post('/', VerifyToken, (req, res) => {
    if(req.userId){
        let now = Date.now();
        req.body.uid = req.userId;
        req.body.startDate = new Date(now);
        req.body.endDate = new Date(now + 60 * 60 * 24 * req.body.duration * 1000);

        Task.create(req.body, (err, response)=>{
            if(err) return res.json({status: "failure", err: err});
            return res.json(response);
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// RETURNS ALL THE TASKS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
    if(req.userId){
        Task.find({}, (err, tasks) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the tasks."});
            return res.status(200).send({status: "success", tasks: tasks});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// GETS A SINGLE TASK FROM THE DATABASE --> BY USER ID
router.get('/user/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Task.find({uid: req.params.id}, (err, task) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the task."});
            return res.status(200).send({status: "success", task: task});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// GETS A SINGLE TASK FROM THE DATABASE --> BY TASK ID
router.get('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Task.findById(req.params.id, (err, task) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the task."});
            return res.status(200).send({status: "success", task: task});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// UPDATES A SINGLE TASK IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Task.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, task) {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem finding the task."});
            return res.status(200).send({status: "success", task: task});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES A TASK FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Task.deleteOne(req.params.id, (err, task) => {
            if (err) return res.status(500).send({status: "failure", message: "There was a problem deleting the task."});
            return res.status(200).json({status: "success", message: "Task successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

// DELETES ALL TASKS FROM THE DATABASE
router.delete('/', VerifyToken, (req, res) => {
    if(req.userId){
        Task.deleteMany({}, (err, tasks) => {
            if (err) return res.status(500).send({status: "failure", reason: "There was a problem deleting tasks."});
            // if (tasks.length > 0) return res.status(404).send({status: "failure", reason: "Failed to delete tasks."});
            return res.status(200).json({status: "success", message: "Tasks successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

module.exports = router;