const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UploadSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar: File
});

module.exports = mongoose.model('Upload', UploadSchema);