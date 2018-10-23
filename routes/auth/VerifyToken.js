const User = require('../users/user-model');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, "jesuismorpheus", function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate apiKey.' });
        
        User.find({apiKey: token, _id: decoded._id}, (err, user) =>{
            if (err) return res.status(500).send({ status: "failure", auth: false, message: 'Failed to find user attachment to apiKey.' });
            
            // if everything good, save to request for use in other routes
            req.userId = user._id;
            next();
        });
    });

    // req.userId = "5bcc69f0aea1775e24c64b29";
    // console.log(req.userId);
    // next();
}

module.exports = verifyToken;