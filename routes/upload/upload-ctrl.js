var formidable = require('formidable');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var User = require('../users/user-model');
var VerifyToken = require('../auth/VerifyToken');

// POST /upload gets urlencoded bodies
router.post('/upload', VerifyToken, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    var form = new formidable.IncomingForm();
    if(req.userId){
        form.parse(req, (err, fields, files) => {
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;

                User.findByIdAndUpdate(req.userId, {avatar: newpath}, (err, user) =>{
                    if(err) return res.status(500).send({status: 'failure', message: 'err'});
                    res.status(200).json({status: 'success', message: 'File uploaded and moved'});
                    res.end();
                });
            });
        });
    }
});

module.exports = router;