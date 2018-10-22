const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    item: String,
    descipriton: String,
    source: String,
    date: String,
    amount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Expenses', ExpenseSchema);