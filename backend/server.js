const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'cressential'
})

app.get('/', (re, res)=> {
    return res.json("From Backend Server");
})

//================= REGISTRAR =======================


//Type of Record Tab
app.get('/type-of-record', (req, res)=> {
    const sql = "SELECT * FROM type_of_record";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//Add Record
app.post('/add-record', (req, res) => {
    const { type, price } = req.body;
    
    // Check if required fields are present
    if (!type || !price) {
        return res.status(400).json({ message: 'Type and price are required' });
    }
    const sql = "INSERT INTO type_of_record (type, price) VALUES (?, ?)";
    
    db.query(sql, [type, price], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add record' });
      }
      return res.status(200).json({ message: 'Record added successfully' });
    });
  });

//User Management Tab
app.get('/users', (req, res)=> {
    const sql = "SELECT * FROM user_management";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, ()=> {
    console.log("listening");
})