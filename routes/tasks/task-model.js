const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Fields',
    },
    plantName: String,
    description: String,
    status: String,
    type: String,
    duration: Number,
    startDate: String,
    endDate: String,
    budget: Number
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

// tAsks = [
//     {
//         // uid: req.userId,
//         plantName: "Rice",
//         description: "Plouging before planting",
//         type: "Land Preparation",
//         duration: 1,
//         startDate: Date.now(),
//         endDate: "",
//         budget: 7000
//     },
//     {
//         // uid: req.userId,
//         plantName: "Maize",
//         description: "Planting the crops",
//         type: "Planting",
//         duration: 3,
//         startDate: Date.now(),
//         endDate: "",
//         budget: 2000
//     },
//     {
//         // uid: req.userId,
//         plantName: "Yam",
//         description: "Adding Fertilizers to field",
//         type: "Fertilizing",
//         duration: 2,
//         startDate: Date.now(),
//         endDate: "",
//         budget: 1000
//     },
//     {
//         // uid: req.userId,
//         plantName: "Maize",
//         description: "Maintenance like weeding, ridging etc.",
//         type: "Maintenance",
//         duration: 4,
//         startDate: Date.now(),
//         endDate: "",
//         budget: 500
//     },
//     {
//         // uid: req.userId,
//         plantName: "Rice",
//         description: "Harvesting produce from field",
//         type: "Harvesting",
//         duration: 5,
//         startDate: Date.now(),
//         endDate: "",
//         budget: 3000
//     },
//     {
//         // uid: req.userId,
//         plantName: "Tomatoe",
//         description: "Storing the produce",
//         type: "Storage",
//         duration: 3,
//         startDate: Date.now(),
//         endDate: "",
//         budget: 4000
//     }
// ];