const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuthSchema = new Schema({
    email: String,
    passwordToken: String
});

module.exports = mongoose.model('Auth', AuthSchema);