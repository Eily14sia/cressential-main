const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authenticateToken');
const crypto = require('crypto');

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


// Secret key for JWT (replace with a long, secure random string)
const secretKey = 'your-secret-key';

// Login route
// router. post('/login', async (req, res) => {
//   const { walletAddress } = req.body;
//   // const wallet_address = '0x7116dc333ce11831a3c84a6079a657e849b35e5f';
//   try {

//     // Find the user by email (you would typically query your user database here)
//     // const user = users.find((u) => u.email === email);
//     const sql = "SELECT * FROM user_management WHERE wallet_address = ?";
//     const { rows } = await pool.query(sql, [walletAddress]);
  
//     if (rows.length === 0) {
//       return res.status(401).json({ message: 'Authentication failed' });
//     }
  
//     const user = rows[0];
  
//     // Generate a JWT token for authentication
//     const token = jwt.sign({ userId: user.user_id, role: user.role }, secretKey, {
//       expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
//     });
  
//     // Return the token to the client
//     res.json({ token });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// Define a route to get user data by wallet_address
router.post('/login', (req, res) => {
  const { walletAddress } = req.body;
  const sql = "SELECT * FROM user_management WHERE wallet_address = ?";

  db.query(sql, [walletAddress], (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Generate a JWT token
    const token = jwt.sign({ userId: user.user_id, role: user.role }, secretKey, {
      expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
    });

    // Include the token in the response
    res.json({ user, token });
  });
});
/* ===========================================================
                            REGISTRAR
   =========================================================== */

// ========================= Payment  =========================

   
  router.get('/payment', (req, res) => {
    const sql = `
      SELECT *
      FROM record_request AS r
      INNER JOIN payment AS p ON r.ctrl_number = p.ctrl_number      
    `;
  
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

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
      FROM record_request AS r
      INNER JOIN payment AS p ON r.ctrl_number = p.ctrl_number
      WHERE r.student_id IN (
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
  router.get('/payment-alumni-record-request', (req, res) => {
    const sql = `
      SELECT *
      FROM record_request AS r
      INNER JOIN payment AS p ON p.ctrl_number = r.ctrl_number
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
    FROM record_per_request as rpr
    INNER JOIN record_request as r ON rpr.ctrl_number = r.ctrl_number
    INNER JOIN payment ON rpr.ctrl_number = payment.ctrl_number
    INNER JOIN type_of_record ON rpr.record_type_id = type_of_record.id
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

   // Update Record
router.put('/update-record-per-request/:recordID', (req, res) => {
  const recordID = req.params.recordID;
  const { recordPassword, uploadedCID, recordStatus, dateIssued } = req.body;

  // Hash the password using SHA-256
  const hashedPassword = hashPassword(recordPassword);

  const sql = "UPDATE record_per_request SET password = ?, ipfs = ?, record_status = ?, date_issued = ? WHERE rpr_id = ?";

  db.query(sql, [hashedPassword, uploadedCID, recordStatus, dateIssued, recordID], (err, result) => {
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

// Function to hash a password using SHA-256
function hashPassword(password) {
  const sha256 = crypto.createHash('sha256');
  sha256.update(password);
  return sha256.digest('hex');
}

// ================ Type of Record Tab =======================

    router.get('/type-of-record', authenticateToken, (req, res)=> {
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

// Add Record
router.post('/record-request/add-record', (req, res) => {
  const { record_id, student_id, purpose } = req.body;

  const recordRequestSQL = "INSERT INTO record_request (student_id, request_record_type_id, purpose) VALUES (?, ?, ?)";
  const paymentSQL = "INSERT INTO payment (ctrl_number) VALUES (?)";

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to add record' });
    }

    db.query(recordRequestSQL, [student_id, record_id, purpose], (err, result) => {
      if (err) {
        db.rollback(() => {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
        });
      }

      const ctrl_number = result.insertId; // Get the auto-generated ctrl_number from the record_request

      // Now, insert into the payment table using the ctrl_number
      db.query(paymentSQL, [ctrl_number], (err, paymentResult) => {
        if (err) {
          db.rollback(() => {
            console.error(err);
            return res.status(500).json({ message: 'Failed to add record' });
          });
        }

        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              console.error(err);
              return res.status(500).json({ message: 'Failed to add record' });
            });
          }

          return res.status(200).json({ message: 'Your request has been submitted.' });
        });
      });
    });
  });
});


module.exports = router;