const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    fieldId: {
        type: Schema.Types.ObjectId,
        ref: 'Fields'
    },
    amount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Incomes', IncomeSchema);