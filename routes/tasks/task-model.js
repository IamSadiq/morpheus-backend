const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Fields'
    },
    taskDescipriton: String,
    status: { type: String, default: 'Pending' },
    startDate: String,
    endDate: String,
    budget: { type: Number, default: 0 }
});

module.exports = mongoose.model('Task', TaskSchema);