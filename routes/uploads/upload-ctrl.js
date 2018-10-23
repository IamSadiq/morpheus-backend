var formidable = require('formidable');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var User = require('../users/user-model');
var Upload = require('./upload-model');
var VerifyToken = require('../auth/VerifyToken');

// POST /upload gets urlencoded bodies
router.post('/upload', VerifyToken, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    var form = new formidable.IncomingForm();
    if(req.userId){
        form.parse(req, (err, fields, files) => {
            var oldpath = files.filetoupload.path;
            // var newpath = __dirname + '/public/images/' + files.filetoupload.name;
            var newpath = '../../public/images/' + files.filetoupload.name;

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;

                Upload.create({uid: req.userId, avatar: newpath}, (err, upload)=>{
                    if (err) return res.json({status: "failure", message: "Failed to save avatar to DB."});

                    User.findByIdAndUpdate(req.userId, {avatar: newpath}, (err, user) => {
                        if(err) return res.status(500).send({status: 'failure', message: 'Failed to update user record.'});
                        res.status(200).json({status: 'success', message: 'File uploaded and moved'});
                        res.end();
                    });
                });
            });
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

router.get('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Upload.find({}, VerifyToken, (err, uploads)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", uploads: uploads});
        });
    });
});

router.get('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Upload.findById(req.params.id, (err, upload)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", upload: upload});
        });
    });
});

router.get('/user/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Upload.find({uid: req.param.id}, (err, upload)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", upload: upload});
        });
    });
});

router.put('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Upload.findByIdAndUpdate(req.param.id, (err, upload)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", upload: upload});
        });
    });
});

// DELETE BY UPLOAD ID
router.delete('/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Upload.deleteOne({_id: req.params.id}, (err)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", message: "Upload successfully deleted."});
        });
    });
});

// DELETE BY UPLOAD USER ID
router.delete('/user/:id', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Upload.deleteOne({uid: req.params.id}, (err)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", message: "Upload successfully deleted."});
        });
    });
});

router.delete('/', VerifyToken, (req, res) => {
    User.findById(req.userId, {password: 0}, (err, user) => {
        if (err) return res.status(500).send("There was a problem finding the user.");

        Upload.deleteMany({}, (err)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", message: "Uploads successfully deleted."});
        });
    });
});

module.exports = router;