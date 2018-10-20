const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Fields'
    },
    taskDescipriton: String,
    status: String,
    startDate: String,
    endDate: String,
    budget: Number
});

module.exports = mongoose.model('Task', TaskSchema);