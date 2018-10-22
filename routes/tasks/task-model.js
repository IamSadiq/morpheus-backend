const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Fields'
    },
    plantName: String,
    description: String,
    status: { type: String, default: 'Pending' },
    type: String,
    startDate: String,
    endDate: String,
    budget: { type: Number, default: 0 }
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