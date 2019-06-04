const Completion = require('../models/completion.model');
const Habit = require('../models/habit.model');

exports.getHabitById = async (req, res) => {
    const _id = req.params.id;

    try {
        const habit = await Habit.findById(_id);
        if (!habit) {
            res.status(404).send();
        }
        res.send(habit);
    } catch (ex) {
        res.status(500).send(ex);
    }
}

exports.getAllHabitsForUser = async (req, res) => {
    let current, fromDateStamp, toDateStamp;
    const match = {};

    if (req.query.current) {
        current = req.query.current === "true";
    }

    if (req.query.fromDate && req.query.toDate) {
        fromDateStamp = new Date(req.query.fromDate).getTime();
        toDateStamp = new Date(req.query.toDate).getTime();
        match['date'] = {
            $gte: fromDateStamp,
            $lte: toDateStamp
        };
    }

    try {
        let habits = fromDateStamp && toDateStamp ?
            await Habit.find({
                owner: req.user._id
            }).populate({
                path: 'completions',
                match
            }).exec() :
            await Habit.find({
                owner: req.user._id
            });
        if (current) {
            habits = habits.filter(h => !h.thruDate || new Date(h.thruDate).getTime() > new Date().getTime());
        }
        res.send(habits);
    } catch (ex) {
        res.status(400).send(ex);
    }
}

exports.createHabit = async (req, res) => {
    const habit = new Habit({
        ...req.body,
        owner: req.user._id
    });
    try {
        await habit.save()
        res.status(201).send(habit);
    } catch (ex) {
        res.status(400).send();
    }
}

exports.toggleCompletions = async (req, res) => {
    const completions = req.body;
    try {
        for (const c of completions) {
            let completion = await Completion.findOne({
                date: new Date(c.date),
                habit: c.habit
            });
            if (!completion) {
                completion = new Completion(c);
                await completion.save();
            } else {
                await completion.remove();
            }
        }
        res.status(204).send();
    } catch (ex) {
        res.status(400).send();
    }
}

exports.updateHabit = async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    const updates = Object.keys(body);
    const allowedUpdates = ['description', 'frequency', 'thruDate', 'archived'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send();
    }

    try {
        const habit = await Habit.findOne({
            _id,
            owner: req.user._id
        });
        if (!habit) {
            return res.status(404).send();
        }
        updates.forEach(update => {
            habit[update] = req.body[update];
        });
        await habit.save();
        res.send(habit);
    } catch (ex) {
        res.status(400).send();
    }
}