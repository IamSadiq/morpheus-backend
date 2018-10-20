var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/upload/:id', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST /upload gets urlencoded bodies
app.post('/upload', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.json({status: 'success', message: 'File uploaded and moved'});
        res.end();
      });
});

module.exports = router;