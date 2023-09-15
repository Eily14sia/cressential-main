const express = require('express');
const router = express.Router();
const mysql = require('mysql');


const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'cressential'
})

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        throw err;
    }
    console.log('Connected to MySQL database');
});

router.get('/', (re, res)=> {
    return res.json("From Backend Server");
})

/* ===========================================================
                            REGISTRAR
   =========================================================== */

// ======================= Payment ===========================

router.get('/payment-record-request', (req, res) => {
    const sql = `
      SELECT *
      FROM payment
      INNER JOIN record_request ON payment.ctrl_number = record_request.ctrl_number
    `;
    
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

// ================ Type of Record Tab =======================

    router.get('/type-of-record', (req, res)=> {
        const sql = "SELECT * FROM type_of_record";
        db.query(sql, (err, data)=> {
            if(err) return res.json(err);
            return res.json(data);
        })
    })

    // Add Record
    router.post('/add-record', (req, res) => {
        const { type, price } = req.body;
        
        // Check if required fields are present
        if (!type || !price) {
            return res.status(400).json({ message: 'Type and price are required' });
        } 
        else {
            const sql = "INSERT INTO type_of_record (type, price) VALUES (?, ?)";
            
            db.query(sql, [type, price], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to add record' });
            }
            return res.status(200).json({ message: 'Record added successfully' });
            });
        }
    });

    // Update Record
    router.put('/update-record/:recordId', (req, res) => {
        const recordId = req.params.recordId;
        const { type, price } = req.body;

        const sql = "UPDATE type_of_record SET type = ?, price = ? WHERE id = ?";

        db.query(sql, [type, price, recordId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to update record' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Record not found' });
            }
            return res.status(200).json({ message: 'Record updated successfully' });
        });
    });

    // Delete Record
    router.put('/delete-record/:recordId', (req, res) => {
        const recordId = req.params.recordId;
        const { type, price } = req.body;

        const sql = "DELETE FROM type_of_record WHERE id = ?";

        db.query(sql, [recordId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to delete record' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Record not found' });
            }
            return res.status(200).json({ message: 'Record deleted successfully' });
        });
    });


//User Management Tab
router.get('/users', (req, res)=> {
    const sql = "SELECT * FROM user_management";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})


//User Management Tab
router.get('/record-request', (req, res)=> {
    const sql = "SELECT * FROM record_request";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

module.exports = router;