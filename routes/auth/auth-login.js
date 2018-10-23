const express = require('express');
const router = express.Router();
const User = require('../users/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    User.find({username: req.body.username}, (err, user) => {
        if (err) return res.status(500).send({status: "failure", message: "There was a problem finding the user."});
        if (user.length < 1) return res.status(500).send({status: "failure", message: "Failed to authenticate user."});

        console.log("req.body: "+ JSON.stringify(req.body));
        console.log("returned user: " + user);

        // jwt.verify(bcrypt.hashSync(req.body.password, 8), "jesuismorpheus", function(err, decoded) {
        //     if (err) return res.status(500).send({status: "failure", message: "Incorrect username or password."});
        //     console.log("decoded: "+ decoded);
        //     return res.status(200).send({status: "success", auth: true, user: user});
        // });
        
        if(bcrypt.compareSync(req.body.password, user.password)) return res.status(200).send({status: "success", auth: true, user: user});
        return res.status(500).send({status: "failure", message: "Incorrect username or password."});
    });
});

module.exports = router;