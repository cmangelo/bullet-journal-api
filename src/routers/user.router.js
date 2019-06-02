const express = require('express');

const auth = require('../middleware/auth');
const User = require('../models/user.model');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (ex) {
        res.status(400).send(ex);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
        await req.user.save();
        res.send();
    } catch (ex) {
        res.status(500).send();
    }
});

router.post('', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (ex) {
        res.status(400).send(ex);
    }
});

router.get('', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;