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
router.post('/login',(req,res) => {
    User.findOne({email:req.body.email},(err,data) => {
        if(err) return res.status(500).send("Error while Login");
        // in case user not found
        if(!data) return res.send({auth:false,token:'No User Found Register First'});
        else{
            // compare password if user found
            // (userinput, password in db)
            const passIsValid = bcrypt.compareSync(req.body.password,data.password);
            // if password not match
            if(!passIsValid) return res.send({auth:false,token:'Invalid Password'});
            // generate token
            // (tell on which unqiue key, secret, expire time(3600 1 hrs))
            var token = jwt.sign({id:data._id},config.secret,{expiresIn:3600})
            res.send({auth:true,token:token})
        }
    })
})

//user info
// token to pass
// getting the data
// get with header
router.get('/userInfo',(req,res) =>{
    var token = req.headers['x-access-token'];
    // if token not provided
    if(!token) res.send({auth:false,token:'No Token Provided'})
    //if token provided ask jwt to check
    jwt.verify(token,config.secret,(err,data) => {
        if(err) res.send('Error while fetching')
        // get id from jwt token
        // find user on basis of id
        User.findById(data.id,(err,result) => {
            res.send(result)
        })
    })
})

// get all users
router.get('/users',(req,res) =>{
    User.find({},(err,user) => {
        if(err) throw err;
        res.status(200).send(user)
    })
})

module.exports = router;