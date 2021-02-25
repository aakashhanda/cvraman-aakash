const express = require('express');
const app = express();
const port = process.env.PORT || 9700;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient
const bodyParser = require('body-parser');
//const cors = require('cors');
const mongourl = "mongodb+srv://dev:mongo123@cluster0.f8vmc.mongodb.net/aryabhat?retryWrites=true&w=majority";
let dbobj;
let col_name="users"


//middlewareThnaTh
//cross origin resource sharing
//app.use(cors())

//parse data for post call
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//health Check
app.get('/',(req,res) => {
    res.status(200).send("Health Ok")
})

//postUser
app.post('/adduser',(req,res)=>{
    dbobj.collection(col_name).insert(req.body,(err,result) => {
        if(err) throw err;
        res.status(200).send("Data Added")
    })
});


//getUser
app.get('/myuser',(req,res) => {
    dbobj.collection(col_name).find().toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/users',(req,res) => {
    var query = {}
    if(req.query.city && req.query.role){
        query={city:req.query.city,role:req.query.role,isActive:true}
    }
    else if(req.query.city){
        query={city:req.query.city,isActive:true}
    }else if(req.query.role){
        query={role:req.query.role,isActive:true}
    }else{
        query={isActive:true}
    }
    dbobj.collection(col_name).find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/user/:id',(req,res) => {
    var id = mongo.ObjectID(req.params.id)
    var query = {}
    query={_id:id}
    dbobj.collection(col_name).findOne(query,(err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//updateUser
app.put('/editUser',(req,res) => {
    let Id = req.body._id;
    dbobj.collection(col_name).update(
        {_id:mongo.ObjectID(Id)},
        {
            $set:{
                name:req.body.name,
                email:req.body.email,
                city: req.body.city,
                phone: req.body.phone,
                isActive:req.body.isActive,
                role: req.body.role
            }
        },(err,result) => {
            if(err) throw err;
            res.send("Data Updated")
        }
    )
})

//hardDeleteUser
app.delete('/deleteUser',(req,res) => {
    let Id = mongo.ObjectID(req.body._id);
    dbobj.collection(col_name).remove({_id:Id},(err,result) => {
        if(err) throw err;
        res.send("Data Deleted")
    })
});

//deactivate User(soft Delete)
app.put('/deactivateUser',(req,res)=>{
    let Id = mongo.ObjectID(req.body._id);
    dbobj.collection(col_name).update(
        {_id:Id},
        {
            $set:{
                isActive:false
            }
        },(err,result)=> {
            if(err) throw err;
            res.send("User Deactivated")
        }
    )
})

//Activate User(soft Delete)
app.put('/activateUser',(req,res)=>{
    let Id = mongo.ObjectID(req.body._id);
    dbobj.collection(col_name).update(
        {_id:Id},
        {
            $set:{
                isActive:true
            }
        },(err,result)=> {
            if(err) throw err;
            console.log(result)
            res.send(result)
        }
    )
})

//connecting database to nodejs
MongoClient.connect(mongourl,(err,connection) => {
    if(err) console.log(err);
    dbobj = connection.db('aryabhat');
    app.listen(port,(err) => {
        console.log(`Server is running on port ${port}`)
    })
})