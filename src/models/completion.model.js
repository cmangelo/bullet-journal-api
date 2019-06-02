const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema({
    completionDate: {
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


const Completion = mongoose.model('Completion', completionSchema);

module.exports = Completion;