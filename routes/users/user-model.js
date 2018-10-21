const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: String,
    password: String,
    avatar: String
});

module.exports = mongoose.model('User', UserSchema);