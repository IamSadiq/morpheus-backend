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
    if(req.userId){
        Upload.find({}, VerifyToken, (err, uploads)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", uploads: uploads});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

router.get('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Upload.findById(req.params.id, (err, upload)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", upload: upload});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

router.get('/user/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Upload.find({uid: req.param.id}, (err, upload)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", upload: upload});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

router.put('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Upload.findByIdAndUpdate(req.param.id, (err, upload)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", upload: upload});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

router.delete('/:id', VerifyToken, (req, res) => {
    if(req.userId){
        Upload.deleteOne(req.param.id, (err)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", message: "Upload successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

router.delete('/', VerifyToken, (req, res) => {
    if(req.userId){
        Upload.deleteMany({}, (err)=>{
            if (err) return res.status(500).json({status: "failure", message: "No upload found."});
            return res.status(500).json({status: "success", message: "Uploads successfully deleted."});
        });
    }
    return res.json({status: "failure", message: "Failed to authenticate."});
});

module.exports = router;