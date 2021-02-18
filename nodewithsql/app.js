const express = require('express');
const app = express();
const port = 9870;
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//connection with pg
const Pool = require('pg').Pool;
const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'postgres',
    port:5432
})


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

app.get('/user/:id',(req,res) => {
    const id = req.params.id
    pool.query(`SELECT * from customers where id = ${id}`,(err,result) =>{
        if(err) throw err;
        res.json(result.rows)
    })
})

app.post('/addUser',(req,res) => {
    const {first_name,last_name,gender,phone_number} = req.body;
    pool.query('Insert into customers (first_name,last_name,gender,phone_number) VALUES ($1,$2,$3,$4)',[first_name,last_name,gender,phone_number],(err,result) => {
        if(err) throw err;
        res.send('Data Added')
    })
})

app.put('/updateUser',(req,res) => {
    const id = req.body.id;
    const {first_name,last_name,gender,phone_number} = req.body;
    pool.query('Update customers SET first_name=$1, last_name=$2,gender=$3,phone_number=$4 where id=$5',[first_name,last_name,gender,phone_number,id],(err,result) => {
        if(err) throw err;
        res.send('Data Updated')
    })
});

app.delete('/deleteUser',(req,res) => {
    const {id} = req.body
    pool.query('DELETE from customers where id=$1',[id],(err,result) => {
        if(err) throw err;
        res.send('data deleted')
    })

})

app.listen(port,(err) => {
    if(err) throw err;
    console.log(`Server running on port ${port}`)
})