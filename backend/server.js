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

// Define a route to get user data by wallet_address
router.post('/login-metamask', (req, res) => {
  const { wallet_address } = req.body;
  const sql = "SELECT * FROM user_management WHERE wallet_address = ?";

  db.query(sql, [wallet_address], (err, results) => {
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


router.post('/login', (req, res) => {
  const { email, password } = req.body.loginRecord;

  // Hash the password using SHA-256
  const hashedPassword = hashPassword(password);
  
  // Query the database to retrieve user data
  const sql = 'SELECT * FROM user_management WHERE email = ? AND password = ?';
  db.query(sql, [email, hashedPassword], (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    const userData = {
      user_id: user.user_id,
      role: user.role,
      status: user.status,
    };

    // Generate a JWT token
    const token = jwt.sign(userData, secretKey, {
      expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
    });

    // Include the token in the response
    res.json({ user: userData, token });
  });
});

router.post('/verify', (req, res) => {
  const { password, hash } = req.body;

  // Hash the password using SHA-256
  const hashedPassword = hashPassword(password);

  // Query the database to retrieve user data
  const sql = 'SELECT * FROM record_per_request WHERE hash = ? AND password = ?';
  db.query(sql, [hash, hashedPassword], (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      // Record found in the database
      const data = results[0];
      res.json({ success: true, record_status: data.record_status, date_issued: data.date_issued });
    } else {
      // Record not found in the database
      res.status(401).json({ success: false }); // Return a 401 status code
    }
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

    // Update Record
    router.put('/payment/update-record/:ctrl_number', (req, res) => {
      const ctrl_number = req.params.ctrl_number;
      const { 
        payment_id,
        payment_date,
        payment_method,
        payment_status, } = req.body;

      const sql = "UPDATE payment SET payment_id = ?, payment_date = ?, payment_method = ?, payment_status = ? WHERE ctrl_number = ?";

      db.query(sql, [payment_id, payment_date, payment_method, payment_status, ctrl_number], (err, result) => {
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

  router.get('/student/record-issuance', (req, res) => {
    const sql = `
      SELECT *
      FROM record_per_request as rpr
      INNER JOIN record_request as r ON rpr.ctrl_number = r.ctrl_number
      INNER JOIN payment ON rpr.ctrl_number = payment.ctrl_number
      INNER JOIN type_of_record ON rpr.record_type_id = type_of_record.id
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

  

 // Define the GET route for '/mysql/record-issuance'
router.get('/alumni/record-issuance', (req, res) => {
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

   // Add Record
  router.post('/record-per-request/add-record', (req, res) => {
  const { ctrl_number, recordType, recordPassword, uploadedCID, hash, dateIssued } = req.body;

  // Hash the password using SHA-256
  const hashedPassword = hashPassword(recordPassword);

  const sql = "INSERT INTO record_per_request (ctrl_number, password, record_type_id, ipfs, hash, date_issued) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [ctrl_number, hashedPassword, recordType, uploadedCID, hash, dateIssued], (err, result) => {
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
   // Update Record
  router.put('/upload-record-per-request/:recordID', (req, res) => {
  const recordID = req.params.recordID;
  const { recordPassword, uploadedCID, hash, dateIssued } = req.body;

  // Hash the password using SHA-256
  const hashedPassword = hashPassword(recordPassword);

  const sql = "UPDATE record_per_request SET password = ?, ipfs = ?, hash = ? , date_issued = ? WHERE rpr_id = ?";

  db.query(sql, [hashedPassword, uploadedCID, hash, dateIssued, recordID], (err, result) => {
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
   // Update Record
router.put('/update-record-per-request/:recordID', (req, res) => {
  const recordID = req.params.recordID;
  const { recordStatus } = req.body;

  const sql = "UPDATE record_per_request SET record_status = ? WHERE rpr_id = ?";

  db.query(sql, [recordStatus, recordID], (err, result) => {
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

// ================ User Management =======================

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

// ================ Student Management =======================

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

  // Student Management with UserID
  router.get('/student-management/:user_id', (req, res) => {
    const user_id = req.params.user_id;
        
        const sql = `
            SELECT *
            FROM student_management 
            JOIN user_management ON student_management.user_id = user_management.user_id
            WHERE student_management.user_id = ?;              
        `;

        db.query(sql, [user_id], (err, data)=> {
            if(err) return res.json(err);
            return res.json(data);
        })
    })

    // Add Record
    router.post('/student-management/add-record', (req, res) => {
    const formData = req.body;

    const email = formData.emailAddress;
    const password = hashPassword(formData.studentNumber);
    const wallet_address = formData.walletAddress;
  
    const user_management_sql = "INSERT INTO user_management (email, password, wallet_address, role) VALUES (?, ?, ?, 2)";
    
    db.query(user_management_sql, [email, password, wallet_address], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add record' });
    }
    

    const user_id = result.insertId;
    const values = [
      user_id,
      formData.studentNumber,
      formData.lastName,
      formData.firstName,
      formData.middleName,
      formData.college,
      formData.course,
      formData.entryYearFrom,
      formData.entryYearTo,
      formData.graduationDate,
      formData.permanentAddress,
      formData.mobileNumber,
      formData.emailAddress,
      0
    ];

    const student_management_sql = `INSERT INTO student_management (user_id, student_number, last_name, 
      first_name, middle_name, college, course, entry_year_from,  entry_year_to, 
      date_of_graduation, permanent_adddress, mobile_number, email, is_alumni) VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(student_management_sql, values, (err, result2) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
      }      

      return res.status(200).json({ message: 'Record added successfully' });
    });
  });
});

// ================ Registrar Management =======================

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

      // Student Management with UserID
  router.get('/registrar-management/:user_id', (req, res) => {
    const user_id = req.params.user_id;
        
        const sql = `
            SELECT *
            FROM registrar_management 
            JOIN user_management ON registrar_management.user_id = user_management.user_id
            WHERE registrar_management.user_id = ?;              
        `;

        db.query(sql, [user_id], (err, data)=> {
            if(err) return res.json(err);
            return res.json(data);
        })
    })

  // Add Record
  router.post('/registrar-management/add-record', (req, res) => {
    const formData = req.body;

    const email = formData.emailAddress;
    const password = hashPassword('Registrar123');
    const wallet_address = formData.walletAddress;
  
    const user_management_sql = "INSERT INTO user_management (email, password, wallet_address, role) VALUES (?, ?, ?, 1)";
    
    db.query(user_management_sql, [email, password, wallet_address], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add record' });
    }
    

    const user_id = result.insertId;
    const values = [
      user_id,
      formData.lastName,
      formData.firstName,
      formData.middleName,      
      formData.emailAddress,
      formData.mobileNumber,
      0
    ];

    const registrar_management_sql = `INSERT INTO registrar_management (user_id, last_name, 
      first_name, middle_name, email, mobile_number) VALUES 
      (?, ?, ?, ?, ?, ?)`;

    db.query(registrar_management_sql, values, (err, result2) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
      }      

      return res.status(200).json({ message: 'Record added successfully' });
    });
  });
});

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

router.get('/student-record-request/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
    SELECT *
    FROM record_request AS r
    INNER JOIN payment AS p ON p.ctrl_number = r.ctrl_number
    WHERE r.student_id IN (
      SELECT id
      FROM student_management
      WHERE user_id = ?
    )
  `;
  
  db.query(sql, [user_id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add Record
router.post('/record-request/add-record', (req, res) => {
  const { record_id, student_id, purpose, total_amount } = req.body;

  // Split the comma-separated record_ids into an array
  const recordIds = record_id.split(',');

  // Calculate the date_releasing 15 days after the date_requested
  const date_requested = new Date();
  const date_releasing = new Date(date_requested);
  date_releasing.setDate(date_releasing.getDate() + 15);

  const recordRequestSQL = "INSERT INTO record_request (student_id, request_record_type_id, purpose, date_requested, date_releasing) VALUES (?, ?, ?, ?, ?)";
  const paymentSQL = "INSERT INTO payment (ctrl_number, total_amount) VALUES (?, ?)";
  const recordPerRequestSQL = "INSERT INTO record_per_request (ctrl_number, record_type_id) VALUES (?, ?)";

  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to add record' });
    }

    // Insert into record_request table
    db.query(recordRequestSQL, [student_id, record_id, purpose, date_requested, date_releasing], (err, result) => {
      if (err) {
        db.rollback(() => {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
        });
      }

      const ctrl_number = result.insertId; // Get the auto-generated ctrl_number from the record_request

      // Insert into payment table using the ctrl_number
      db.query(paymentSQL, [ctrl_number, total_amount], (err, paymentResult) => {
        if (err) {
          db.rollback(() => {
            console.error(err);
            return res.status(500).json({ message: 'Failed to add record' });
          });
        }

        // Iterate through recordIds and insert into record_per_request for each ID
        recordIds.forEach((recordId, index) => {
          // Replace 'recordTypeId' with the actual record type ID for each recordId
          const recordTypeId = 'your_record_type_id'; // Replace with the actual value

          db.query(
            recordPerRequestSQL,
            [ctrl_number, recordId],
            (err, recordPerRequestResult) => {
              if (err) {
                db.rollback(() => {
                  console.error(err);
                  return res.status(500).json({ message: 'Failed to add record' });
                });
              }

              // Check if all insertions into record_per_request are complete
              if (index === recordIds.length - 1) {
                db.commit((err) => {
                  if (err) {
                    db.rollback(() => {
                      console.error(err);
                      return res.status(500).json({ message: 'Failed to add record' });
                    });
                  }

                  return res.status(200).json({ message: 'Your request has been submitted.', ctrl_number:  ctrl_number});
                });
              }
            }
          );
        });
      });
    });
  });
});

// Cancel Request
router.put('/cancel-record-request/:ctrl_number', (req, res) => {
  const ctrl_number = req.params.ctrl_number;
  const { type, price } = req.body;

  const sql = "UPDATE record_request SET request_status = 'Cancelled' WHERE ctrl_number = ?";

  db.query(sql, [ctrl_number], (err, result) => {
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

// Update Record
router.put('/update-payment/:ctrl_number', (req, res) => {
  const ctrl_number = req.params.ctrl_number;
  const {total_amount, payment_method, payment_id } = req.body;

  const payment_date = new Date();
  const sql = "UPDATE payment SET payment_id = ?, payment_date = ?, total_amount = ?, payment_method = ?, payment_status = 'Paid'  WHERE ctrl_number = ?";

  db.query(sql, [payment_id, payment_date, total_amount, payment_method, ctrl_number], (err, result) => {
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

module.exports = router;