const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check')

const User = require('../schemas/User');
const auth = require('../middleware/auth');
const { ObjectId } = require('mongoose');
const users = {};
/**
 * @method - POST
 * @param  - /signup
 * @description - User SignUp
 */

router.post(
    '/signup',
    [
        check('firstName', 'Please enter the first name.').not().isEmpty(),
        check('email', 'Please enter email').isEmail(),
        check('password', 'Please enter the password.').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                data: {},
                errors: errors.array(),
                message: 'Unable to create user'
            });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({
                    data: {},
                    errors: [{
                        value: req.body.email,
                        msg: "User already exists.",
                        param: "email",
                        location: "body"
                    }],
                    message: 'Unable to create user'
                })
            }
            user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName || '',
                email: req.body.email
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);

            await user.save();

            res.status(200).json({
                data: user,
                errors: [],
                message: 'Signed Up successfully!!'
            });
        } catch (e) {
            console.log(e.message);
            res.status(500).send('Error in Saving');
        }

    }
);

/**
 * @method - POST
 * @param  - /login
 * @description - User Login
 */

router.post(
    '/login',
    [
        check('email', 'Please enter a valid email.').isEmail(),
        check('password', 'Please enter a valid password').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                data: {},
                errors: errors.array(),
                message: 'Unable to login'
            });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({
                    data: {},
                    errors: [{
                        value: req.body.email,
                        msg: "User doesn't exists.",
                        param: "email",
                        location: "body"
                    }],
                    message: 'Unable to login'
                })
            }
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    data: {},
                    errors: [{
                        value: req.body.password,
                        msg: "Incorrect password!",
                        param: "password",
                        location: "password"
                    }],
                    message: 'Unable to login'
                })
            }
            jwt.sign(
                { user: { id: user.id } },
                'jwt_secret',
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        data: {token},
                        errors:[],
                        message: 'Loggin success!!'
                    })
                }
            )
        } catch (e) {
            console.log(e.message);
            res.status(500).send('Error in login');
        }
    }
);

/**
 * @method - GET
 * @description - get profile of logged in user
 * @param - /profile  
 */

 router.get(
     '/profile',
     auth,
    async (req,res) => {
        if(users[req.user.id]) {
            return res.json(users[req.user.id])
        } else {
            try {
                // const user = await User.findById(req.user.id);
                const user = await User.aggregate([
                    {
                        $match: {
                            _id: mongoose.Types.ObjectId(req.user.id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'blogs',
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'userBlogs'
                        }
                    }
                ]);
                users[req.user.id] = {
                    data:user,
                    errors:[],
                    message: 'Fetched user profile'
                }
                res.json(users[req.user.id])
            } catch (e) {
                res.send('Error in fetching')
            }
        }
    }    
 );

module.exports = router;
