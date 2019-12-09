const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Config = require('../config/dev');
exports.auth = function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return  res.status(422).json({errors: [{title: 'Data missing', details: 'email or paossword is missing'}]});
    }
    User.findOne({email}, (err, user) => {
        console.log(user);
        if (err) {
            return res.status(422).json({'mongoose': 'handle mongoose errors'});
        }
        if (!user) {
            return res.status(404).json({'message': `No user exists with email: ${email}`});
        }
            if (bcrypt.compare(password, user.password)) {
                const token = jwt.sign({
                    userId: user.id,
                    username: user.username
                }, Config.Secret, {expiresIn: '1h'});
                return res.json({
                    token
                });
            } else {
                return  res.status(422).json({errors: [{title: 'Wrong Data', details: 'Email or password are invalid'}]});
            }
    });
}

exports.register = function(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirmation = req.body.passwordConfirmation;

    if (!username || !email) {
        return  res.status(422).json({errors: [{title: 'Data missing', details: 'Username or email is missing'}]});
    }
    if (password !== passwordConfirmation) {
        return res.status(422).json({errors: [{title: 'Invalid Password', details: 'Password doesn\'t match password confirmation'}]});
    }
    User.findOne({email}, (err, existingUser) => {
        if (err) {
          return  res.status(422).json({
                'mongoose': 'handle mongoose errors'
            });
        }
        if (existingUser) {
           return res.status(422).json({errors: [{title: 'Invalid email', details: 'Email already exists'}]});
        }
        const user = new User({
            username,
            email,
            password
        });
        user.save().then(() => {
                if (err) {
                    return res.status(422).json({
                        'mongoose': 'handle mongoose errors'
                    });
                }
                res.json({
                    'message': 'user created',
                    user
                });
        })
        .catch((err) => console.log(err));
    });
}

exports.authMiddleware = function(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        const user = parseToken(token);
        User.findById(user.userId, (err, user) => {
            if (err) {
                return res.status(422).json({
                    'mongoose': 'handle mongoose errors'
                });
            }
            if (user) {
                res.locals.user = user;
                next();
            } else {
                return res.status(401).json({errors: [{title: 'Not authorized', details: 'No provided authorization token in headers'}]});
            }
        })
    }
    else {
        return res.status(401).json({errors: [{title: 'Not authorized', details: 'No provided authorization token in headers'}]});
    }
}

function parseToken(token) {
    console.log(jwt.verify(token.split(' ')[1], Config.Secret));
    return jwt.verify(token.split(' ')[1], Config.Secret);
}