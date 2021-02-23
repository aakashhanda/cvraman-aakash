const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

// object of mongoose model
const User = require('../model/UserSchema');

// middleware to parse post data
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

//register User
router.post('/register',(req,res) => {
    var hashpassword = bcrypt.hashSync(req.body.password,8);
    // write on condition check if email already exist
    User.create({
        name: req.body.name,
        password: hashpassword,
        email: req.body.email,
        role: req.body.role?req.body.role:'User',
        isActive: true
    },(err,user) => {
        if(err) throw err;
        res.status(200).send('Registration Success')
    })
})

//login user

// get all users
router.get('/users',(req,res) =>{
    User.find({},(err,user) => {
        if(err) throw err;
        res.status(200).send(user)
    })
})

module.exports = router;