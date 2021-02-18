const express = require('express');
const app = express();
const port = 9870;
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongourl="mongodb://localhost:27017";
let db;
let col_name="users";

//connection with pg
const Pool = require('pg').Pool;
const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'postgres',
    port:5432
})

//connection with mongo
MongoClient.connect(mongourl,(err,connection)=>{
    if(err) console.log(err);
    db=connection.db('febnode');
});

//health check
app.get('/',(req,res) => {
    res.send("Server is running ok")
})

app.get('/users',(req,res) => {
    pool.query('SELECT * from customers ORDER BY first_name ASC',(err,result) =>{
        if(err) throw err;
        res.json(result)
    })
})

app.get('/usermongo', (req,res) => {
    db.collection(col_name).find().toArray((err,result) => {
        if(err) throw err;
        res.json(result)
    })
})

app.get('/usermongo1',async (req,res) => {
    let response = await db.collection(col_name).find().toArray()
    res.json(response)
})

app.get('/user/:id',(req,res) => {
    const id = req.params.id
    pool.query(`SELECT * from customers where id = ${id}`,(err,result) =>{
        if(err) throw err;
        res.json(result.rows)
    })
})

app.post('/addUser',(req,res) => {
    const {first_name,last_name,gender,phone_number} = req.body;
    /*const first_name = req.body.first_name;
    const {first_name} = req.body;*/
    pool.query('Insert into customers (first_name,last_name,gender,phone_number) VALUES ($1,$2,$3,$4)',[first_name,last_name,gender,phone_number],(err,result) => {
        if(err) throw err;
        res.send('Data Added')
    })
})

app.put('/updateUser',(req,res) => {
    
})

app.listen(port,(err) => {
    if(err) throw err;
    console.log(`Server running on port ${port}`)
})