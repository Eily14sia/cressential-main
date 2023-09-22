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

// ================== Alumni Record Issuance  ==================

router.get('/record-per-request/:ctrl_number', (req, res) => {
    const ctrl_number = req.params.ctrl_number;

    const sql = `
        SELECT *
        FROM record_per_request
        INNER JOIN record_request ON record_per_request.ctrl_number = record_request.ctrl_number
        INNER JOIN payment ON record_per_request.ctrl_number = payment.ctrl_number
        INNER JOIN type_of_record ON record_per_request.record_type_id = type_of_record.id
        WHERE record_per_request.ctrl_number = ?
    `;
    
    db.query(sql, [ctrl_number], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });


// ======================= Student Record Request =========================== 

  router.get('/payment-student-record-request', (req, res) => {
    const sql = `
      SELECT *
      FROM payment AS p
      INNER JOIN record_request AS r ON p.ctrl_number = r.ctrl_number
      WHERE p.student_id IN (
        SELECT id
        FROM student_management
        WHERE is_alumni = 0
      )
    `;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

// ======================= Alumni Record Request =========================== 
  router.get('/payment-record-request', (req, res) => {
    const sql = `
      SELECT *
      FROM payment AS p
      INNER JOIN record_request AS r ON p.ctrl_number = r.ctrl_number
      WHERE p.student_id IN (
        SELECT id
        FROM student_management
        WHERE is_alumni = 1
      )
    `;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  // Update Record
  router.put('/update-record-request/:new_ctrl_number', (req, res) => {
    const new_ctrl_number = req.params.new_ctrl_number;
    const { date_releasing, processing_officer, request_status } = req.body;

    const sql = "UPDATE record_request SET date_releasing = ?, processing_officer = ?, request_status = ? WHERE ctrl_number = ?";

    db.query(sql, [date_releasing, processing_officer, request_status, new_ctrl_number], (err, result) => {
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

  

  router.get('/record-per-request', (req, res) => {
    const sql = `
    SELECT *
    FROM record_per_request
    INNER JOIN record_request as r ON record_per_request.ctrl_number = r.ctrl_number
    INNER JOIN payment ON record_per_request.ctrl_number = payment.ctrl_number
    INNER JOIN type_of_record ON record_per_request.record_type_id = type_of_record.id
    WHERE r.student_id IN (
        SELECT id
        FROM student_management
        WHERE is_alumni = 1
      )
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


    // User Management Tab
    router.get('/users', (req, res)=> {
        
        const sql = `
            SELECT *
            FROM user_management;      
                
        `;
        db.query(sql, (err, data)=> {
            if(err) return res.json(err);
            return res.json(data);
        })
    })

  // Student Management Tab
    router.get('/student-management', (req, res)=> {
        
        const sql = `
            SELECT *
            FROM student_management 
            JOIN user_management ON student_management.user_id = user_management.user_id;              
        `;

        db.query(sql, (err, data)=> {
            if(err) return res.json(err);
            return res.json(data);
        })
    })

  // Registrar Management Tab
    router.get('/registrar-management', (req, res)=> {
        
        const sql = `
            SELECT *
            FROM registrar_management 
            JOIN user_management ON registrar_management.user_id = user_management.user_id;              
        `;

        db.query(sql, (err, data)=> {
            if(err) return res.json(err);
            return res.json(data);
        })
    })

/* ===========================================================
                            STUDENT
   =========================================================== */

//Record Request Tab
router.get('/record-request', (req, res)=> {
    const sql = "SELECT * FROM record_request";
    db.query(sql, (err, data)=> {
        if(err) return res.json(err);
        return res.json(data);
    })
})

module.exports = router;