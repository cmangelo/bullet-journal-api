const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const auth = async (req, res, next) => {
    console.log(req.header('Authorization'))
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token)
        const decoded = jwt.verify(token, 'bulletjournalapi');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
}

module.exports = auth;