const express = require('express');

const auth = require('../middleware/auth');
const Completion = require('../models/completion.model');
const Habit = require('../models/habit.model');


const router = express.Router();

router.use(auth);

router.get('/:id', async (req, res) => {
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
});

router.patch('/completions', async (req, res) => {
    const completions = req.body;
    console.log(completions)
    try {
        for (const c of completions) {
            let completion = await Completion.findOne({date: new Date(c.date), habit: c.habit});
            if (!completion) {
                completion = new Completion(c);
                console.log(completion)
                await completion.save();
            } else {
                await Completion.findByIdAndDelete(completion._id);
            }
        }
        res.status(204).send(); // what status code goes here?
    } catch (ex) {
        res.status(400).send();
    }
});

router.get('', async (req, res) => {
    let current, fromDateStamp, toDateStamp;
    const match = {};

    if (req.query.current) {
        current = req.query.current === "true";
    }

    if (req.query.fromDate && req.query.toDate) {
        fromDateStamp = new Date(req.query.fromDate).getTime();
        toDateStamp = new Date(req.query.toDate).getTime();
        match['date'] = { $gte: fromDateStamp, $lte: toDateStamp };
    }

    try {
        let habits = fromDateStamp && toDateStamp 
            ? await Habit.find({owner: req.user._id}).populate({ path: 'completions', match }).exec()
            : await Habit.find({owner: req.user._id});
        if (current) {
            habits = habits.filter(h => !h.thruDate || new Date(h.thruDate).getTime() > new Date().getTime());
        }
        res.send(habits);
    } catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('', async (req, res) => {
    const habit = new Habit({...req.body, owner: req.user._id});
    try {
        await habit.save()
        res.status(201).send(habit);
    } catch (ex) {
        res.status(400).send();
    }
});

module.exports = router;