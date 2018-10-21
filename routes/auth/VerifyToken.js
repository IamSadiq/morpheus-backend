const User = require('../users/user-model');

function verifyToken(req, res, next) {
    // var token = req.params.apiKey;
    // if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    // User.find({apiKey: token}, (err, user) =>{
    //   if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    //   if (!user) return res.status(404).send({status: "failure", auth: false});
      
    //   // if everything good, save to request for use in other routes
    //   req.userId = user._id;
    //   next();
    // });

    req.userId = "5bcc69f0aea1775e24c64b29";
    next();
}

module.exports = verifyToken;