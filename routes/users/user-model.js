const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    apiKey: String,
    username: String,
    email: String,
    password: String,
    avatar: String
});

module.exports = mongoose.model('User', UserSchema);