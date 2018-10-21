const mongoose = require('mongoose');
const FieldSchema = new mongoose.Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    plantName: String,
    fieldSize: Number,
    location: {
        longitude: Number,
        latitude: Number,
        country: { type: String, default: 'Nigeria' },
        state: String,
        town: String
    }
});

module.exports = mongoose.model('Field', FieldSchema);