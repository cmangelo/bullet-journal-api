const express = require('express');

const auth = require('../middleware/auth');
const HabitController = require('../controllers/habit.controller');

const router = express.Router();

router.use(auth);

router.get('/:id', HabitController.getHabitById);

router.get('', HabitController.getAllHabitsForUser);

router.post('', HabitController.createHabit);

router.patch('/completions', HabitController.toggleCompletions);

router.patch('/:id', HabitController.updateHabit)

module.exports = router;