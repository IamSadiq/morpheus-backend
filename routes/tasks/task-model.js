const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Fields'
    },
    taskDescipriton: String,
    status: { type: String, default: 'Pending' },
    taskType: String,
    startDate: String,
    endDate: String,
    taskBudget: { type: Number, default: 0 }
});

module.exports = mongoose.model('Tasks', TaskSchema);

// taskType: {
//     landPreparation
//     planting
//     maintenance
//     fertilizing
//     Harvesting
//     storage
// }