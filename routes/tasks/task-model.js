const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
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