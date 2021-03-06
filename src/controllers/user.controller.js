const User = require('../models/user.model');

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        });
    } catch (ex) {
        res.status(400).send(ex.message);
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
        res.status(201).send({
            user,
            token
        });
    } catch (ex) {
        let message = ex.code === 11000 ?
            "An account with this email address already exists." :
            "Something went wrong."
        res.status(400).send(message);
    }
}

exports.updateUser = async (req, res) => {
    const body = req.body;
    const oldPassword = body['oldPassword'];
    delete body['oldPassword'];
    const updates = Object.keys(body);
    const allowedUpdates = ['name', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send();
    }

    try {
        const user = await User.findByCredentials(req.user.email, oldPassword);

        updates.forEach(update => user[update] = body[update]);
        await user.save();
        res.send(user);
    } catch (ex) {
        res.status(400).send(ex);
    }
}