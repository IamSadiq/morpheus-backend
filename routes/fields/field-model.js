const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tasks: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Tasks'
            },
        ],
        default: []
    },
    plantName: String,
    fieldSize: { type: Number, default: 0 },
    location: {
        longitude: { type: Number, default: 0 },
        latitude: { type: Number, default: 0 },
        country: { type: String, default: 'Nigeria' },
        state: String,
        town: String
    },
    totalBudget: { type: Number, default: 0 },
});

module.exports = mongoose.model('Fields', FieldSchema);