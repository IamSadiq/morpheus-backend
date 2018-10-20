var User = require('./user-model');

function verifyToken(req, res, next) {
    var token = req.params.apiKey;
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    User.find({apiKey: token}, (err, user) =>{
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      // if everything good, save to request for use in other routes
      req.userId = user._id;
      next();
    });
}

module.exports = verifyToken;