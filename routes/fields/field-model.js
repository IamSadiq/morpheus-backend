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
        ]
    },
    plantName: String,
    fieldSize: Number,
    location: {
        longitude: Number,
        latitude: Number,
        country: { type: String, default: 'Nigeria' },
        state: String,
        town: String
    },
    totalBudget: Number
});

module.exports = mongoose.model('Fields', FieldSchema);