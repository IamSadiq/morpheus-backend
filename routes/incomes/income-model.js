const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
    item: String,
    descipriton: String,
    source: String,
    date: String,
    amount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Incomes', IncomeSchema);