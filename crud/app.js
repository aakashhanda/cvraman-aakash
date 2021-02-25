const express = require('express');
const app = express();
const port = process.env.PORT || 9008;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const { db } = require('../jwt/model/UserSchema');
const MongoClient = mongo.MongoClient;
const mongourl = "mongodb://localhost:27017";
let dbObj;
let col_name='users';

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//health check
app.get('/health',(req,res) => {
    res.status(200).send("Health OK")
})

//post user
app.post('/addUser',(req,res) => {
    dbObj.collection(col_name).insert(req.body,(err,result) =>{
        if(err) throw err;
        res.send('Data Added')
    })
})

//get
app.get('/users',(req,res) => {
    var query = {isActive:true};
    if(req.query.city && req.query.role){
        query={city:req.query.city,role:req.query.role,isActive:true}
    }
    else if(req.query.role){
        query={role:req.query.role,isActive:true}
    }
    else if(req.query.city){
        query={city:req.query.city,isActive:true}
    }
    dbObj.collection(col_name).find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//get profile
app.get('/user/:id',(req,res) => {
    var id = mongo.ObjectID(req.params.id)
    var query = {_id:id}
    dbObj.collection(col_name).findOne(query,(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//update profile
app.patch('/updateUser',(req,res) => {
    let id = mongo.ObjectID(req.body._id)
    dbObj.collection(col_name).update(
        {_id:id},
        {
            $set:{
                "name": req.body.name,
                "password": req.body.password,
                "email": req.body.email,
                "city": req.body.city,
                "role":  req.body.role,
                "isActive":req.body.isActive?req.body.isActive:true
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Data update')
        }
    )
})


//connect with mongo db
MongoClient.connect(mongourl,(err,connection) =>{
    if(err) console.log(err);
    dbObj = connection.db('cvraman')
})

//start server
app.listen(port,(err) => {
    if(err) console.log(err);
    console.log(`Server is running on port 9008`)
})

