const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UploadSchema = new Schema({
    email: String,
    avatar: String
});

module.exports = mongoose.model('Upload', UploadSchema);