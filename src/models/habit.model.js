const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    }, 
    frequency: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;