const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Habit'
    }
}, {
    timestamps: true,    
});

completionSchema.index({date: 1, habit: 1}, {unique: true});

const Completion = mongoose.model('Completion', completionSchema);

module.exports = Completion;