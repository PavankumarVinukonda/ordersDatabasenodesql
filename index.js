const express = require('express');
const mysql = require('mysql');
const app = express();
const {format} = require('date-fns')

app.use(express.json());

let dt = format(new Date(), 'yyyy-MM-dd hh-mm-ss')
let db = "evstudios"

const database = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: db
})


database.connect(function(err, db) {
    if (!!err) {
        console.log('An error occured while connecting to database' + err.message)
    } else {
        console.log('connection established')
    }
})

// first create data base

app.get('/createDb', async (req, res) => {
    let sql = `CREATE DATABASE ${db} ;`
    database.query(sql,(err) => {
        if (err) {
            console.error('Data base error' + err.message)
            res.send('Data base error' + err.message)
        } else {
            res.send("Database created")
        }
        
    })

})

//  create table

app.get('/createTable' ,  (req, res) => {
    let sql =  `CREATE TABLE  orders(orderId int NOT NULL AUTO_INCREMENT PRIMARY KEY,title VARCHAR(200),description VARCHAR(265), createdAt DATETIME);`
    database.query(sql,(err) => {
        if (err) {
            res.send('ann error occured while creatin table: ' + err.message)
        } else {
            res.send('table created successfully')
        }
    })

})

// Insert data into the table

app.post('/insertdata',  (req, res) => {
    const {title, description} = req.body 

    const sql = (`INSERT INTO orders(title,description,createdat) VALUES ('${title}','${description}','${dt}');`)
    database.query(sql, (err) => {
        if (err) {
            res.send('an error occured while inserting data into the table: ' + err.message)
        } else {
            res.send('data inserted successfully')
        }
    })

})


// function to get the latest 7 orders

function getLatestSevenOrders(){
    const sql = `SELECT * FROM orders ORDER BY orderId DESC LIMIT 7;`

    database.query(sql, function(err, result) {
        if (err) {
            console.log('An error occurred while getting data' + err.message)
        }else {
            console.log(result)
        }
    })
}


// api to get data
app.get('/latestOreders',  (req, res) => {
    getLatestSevenOrders()
})


app.listen(process.env.PORT || 3004, () => console.log('Server is running at localhost:3004'))
