const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    frequency: {
        type: Number,
        required: true
    },
    thruDate: {
        type: Date,
        required: false
    },
    archived: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

habitSchema.virtual('completions', {
    ref: 'Completion',
    localField: '_id',
    foreignField: 'habit'
});

// habitSchema.set('toObject', { virtuals: true });
habitSchema.set('toJSON', {
    virtuals: true
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;