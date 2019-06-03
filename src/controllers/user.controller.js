const User = require('../models/user.model');

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (ex) {
        res.status(400).send(ex);
    }
}

exports.logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
        await req.user.save();
        res.send();
    } catch (ex) {
        res.status(500).send();
    }
}

exports.getUser = async (req, res) => {
    res.send(req.user);
}

exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (ex) {
        res.status(400).send(ex);
    }
}