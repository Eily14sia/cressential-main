const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authenticateToken');
const crypto = require('crypto');
require('dotenv').config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err);
        throw err;
    }
    console.log('Connected to PostgreSQL database');
});

// router.get('/', (re, res)=> {
//     return res.json("From Backend Server");
// })

// Middleware to check if the user is authenticated

// Secret key for JWT (replace with a long, secure random string)
const secretKey = process.env.TOKEN_SECRET_KEY;

function verifyToken(req, res, next) {
  // Get the token from the request header
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authorizationHeader.split(' ')[1];
  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Failed to authenticate token:", err);
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    // Store the decoded user information in the request for later use
    req.user = decoded;
    next();
  });
  next();
}

// ========================= Login  =========================

  // login with metamask
  router.post('/login-metamask', (req, res) => {
    const { wallet_address } = req.body;
    const sql = "SELECT * FROM user_management WHERE wallet_address = $1";

    db.query(sql, [wallet_address], (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = results.rows[0];

      // Generate a JWT token
      const token = jwt.sign({ userId: user.user_id, role: user.role }, secretKey, {
        expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
      });

      // Include the token in the response
      res.json({ user, token });
    });
  });

  // default login
  router.post('/login', (req, res) => {
    const { email, password } = req.body.loginRecord;
    
    // Hash the password using SHA-256
    const hashedPassword = hashPassword(password);
    
    // Query the database to retrieve user data
    const sql = 'SELECT * FROM user_management WHERE email = $1 AND password = $2';
    const values = [email, hashedPassword];
    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = results.rows[0];
      const userData = {
        user_id: user.user_id,
        role: user.role,
        status: user.status,
      };

      // Generate a JWT token
      const token = jwt.sign(userData, secretKey, {
        expiresIn: '2h', // Token expires in 1 hour (adjust as needed)
      });

      // Include the token in the response
      res.json({ user: userData, token });
    });
  });

// ========================= Verification  =========================

  // for verify, check if txHash is existing
  router.post('/checkTxHash', (req, res) => {
    const { transaction_hash} = req.body;

    // First query to check if a record with the provided transaction_hash exists
    const checkHashSql = 'SELECT * FROM record_per_request WHERE transaction_hash = $1';
    db.query(checkHashSql, [transaction_hash], (checkErr, checkResults) => {
      if (checkErr) {
        console.error('MySQL query error:', checkErr);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      if (checkResults.rows.length === 0) {
        // Transaction hash not found in the database
        return res.status(404).json({ message: 'Transaction hash not found' });
      } else{
        return res.status(200).json({ message: 'Transaction hash found.' });
      }

      
    });
  });

  // for verification portal
  router.post('/verify', (req, res) => {
    const { transaction_hash, password, hash } = req.body;

      // If the transaction hash exists, proceed to the second query
      // Hash the password using SHA-256
      const hashedPassword = hashPassword(password);

      // Query the database to retrieve user data
      const sql = 'SELECT * FROM record_per_request WHERE transaction_hash = $1 AND password = $2';
      db.query(sql, [transaction_hash, hashedPassword], (err, results) => {
        if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
          return;
        }

        if (results.rows.length > 0) {
          // Record found in the database
          const data = results.rows[0];
          res.json({ success: true, record_status: data.record_status, record_expiration: data.is_expired, date_issued: data.date_issued });
        } else {
          // Record not found in the database or invalid password
          res.status(401).json({ success: false }); // Return a 401 status code
        }
      });
    
  });

// ========================= Notification  =========================

  router.get('/notif/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const sql = `
        SELECT *
        FROM notification as n
        WHERE n.user_id = $1
    `;
    
    db.query(sql, [user_id], (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });

  // Add Record
  router.post('/notif/add-record', verifyToken, (req, res) => {
    const { title, description, user_id } = req.body;
    
    const sql = "INSERT INTO notification (title, description, user_id) VALUES ($1, $2, $3)";
    
    db.query(sql, [title, description, user_id], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add record' });
    }
    return res.status(200).json({ message: 'Record added successfully' });
    });
    
  });

// ========================= Email  =========================

router.get('/email/record-issuance', verifyToken, (req, res) => {
  const sql = `
    SELECT *
    FROM record_per_request as rpr
    INNER JOIN record_request as r ON rpr.ctrl_number = r.ctrl_number
    INNER JOIN payment ON rpr.ctrl_number = payment.ctrl_number
    INNER JOIN type_of_record ON rpr.record_type_id = type_of_record.id
    AND rpr.date_issued IS NOT NULL
  `;

  db.query(sql, (err, results) => {
    if (err) return res.json(err);
    const data = results.rows;
    return res.json(data);
  });
});


router.get('/email/record-request', verifyToken, (req, res) => {
  const sql = `
    SELECT *
    FROM record_request AS r
    INNER JOIN payment AS p ON p.ctrl_number = r.ctrl_number
  `;

  db.query(sql, (err, results) => {
    if (err) return res.json(err);
    const data = results.rows;
    return res.json(data);
  });
});

/* ===========================================================
                            REGISTRAR
   =========================================================== */

// ========================= Dashboard  =========================

  router.get('/record-request', verifyToken, (req, res)=> {
    const sql = `SELECT * FROM record_request as r 
    INNER JOIN payment AS p ON r.ctrl_number = p.ctrl_number
    ORDER BY r.date_requested DESC    
    `;
    db.query(sql, (err, results)=> {
        if(err) return res.json(err);
        const data = results.rows;
        return res.json(data);
    })
  })

  router.get('/record-issuance', verifyToken, (req, res)=> {
    const sql = `SELECT * FROM record_per_request as r 
    WHERE r.ipfs IS NOT NULL
    ORDER BY r.date_issued DESC
    LIMIT 7
    `;
    db.query(sql, (err, results)=> {
        if(err) return res.json(err);
        const data = results.rows;
        return res.json(data);
    })
  })

// ========================= Payment  =========================

   
  router.get('/payment', verifyToken, (req, res) => {
    const sql = `
      SELECT *
      FROM record_request AS r
      INNER JOIN payment AS p ON r.ctrl_number = p.ctrl_number      
    `;
  
    db.query(sql, (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });

  // Update Record
  router.put('/payment/update-record/:ctrl_number', verifyToken, (req, res) => {
      const ctrl_number = req.params.ctrl_number;
      const { 
        payment_id,
        payment_date,
        payment_method,
        payment_status, } = req.body;

      const sql = "UPDATE payment SET payment_id = $1, payment_date = $2, payment_method = $3, payment_status = $4 WHERE ctrl_number = $5";

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

  // Update Record Notified
  router.put('/payment/update-record/notify/:ctrl_number', verifyToken, (req, res) => {
    const ctrl_number = req.params.ctrl_number;

    const sql = "UPDATE payment SET is_payment_notified = 1 WHERE ctrl_number = ?";

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

// ================== Alumni Record Issuance  ==================

  router.get('/record-per-request/:ctrl_number', verifyToken, (req, res) => {
    const ctrl_number = req.params.ctrl_number;

    const sql = `
        SELECT *
        FROM record_per_request
        INNER JOIN record_request ON record_per_request.ctrl_number = record_request.ctrl_number
        INNER JOIN payment ON record_per_request.ctrl_number = payment.ctrl_number
        INNER JOIN type_of_record ON record_per_request.record_type_id = type_of_record.id
        WHERE record_per_request.ctrl_number = $1
    `;
    
    db.query(sql, [ctrl_number], (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });


// ======================= Student Record Request =========================== 

  router.get('/payment-student-record-request', verifyToken, (req, res) => {
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
  
    db.query(sql, (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });

  router.get('/payment-signature-request', verifyToken, (req, res) => {
    const sql = `
      SELECT *
      FROM signature_request AS sr
      INNER JOIN signature_payment AS sp ON sr.ctrl_number = sp.ctrl_number
    `;
  
    db.query(sql, (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });

  router.get('/payment-signature-request/:user_id', verifyToken, (req, res) => {
    const user_id = req.params.user_id;

    const sql = `
    SELECT *
    FROM signature_request AS sr
    INNER JOIN signature_payment AS sp ON sr.ctrl_number = sp.ctrl_number
    WHERE sr.student_id = (
      SELECT id
      FROM student_management
      WHERE user_id = $1
      LIMIT 1
    )
  `;

    db.query(sql, [user_id], (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });

  router.get('/student/record-issuance', verifyToken, (req, res) => {
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
      AND rpr.date_issued IS NOT NULL
    `;
  
    db.query(sql, (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });


// ======================= Alumni Record Request =========================== 

  router.get('/payment-alumni-record-request', verifyToken, (req, res) => {
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
  
    db.query(sql, (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });

  // Update Record
  router.put('/update-record-request/:new_ctrl_number', verifyToken, (req, res) => {
    const new_ctrl_number = req.params.new_ctrl_number;
    const { date_releasing, processing_officer, request_status } = req.body;

    const sql = "UPDATE record_request SET date_releasing = $1, processing_officer = $2, request_status = $3 WHERE ctrl_number = $4";

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

  // Update Record - automatically update the request status to completed
  router.put('/update-record-request/request_status/:new_ctrl_number', verifyToken, (req, res) => {
    const new_ctrl_number = req.params.new_ctrl_number;
    const request_status = 'Completed'
    const sql = "UPDATE record_request SET request_status = $1 WHERE ctrl_number = $2";

    db.query(sql, [request_status, new_ctrl_number], (err, result) => {
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
  router.get('/alumni/record-issuance', verifyToken, (req, res) => {
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
      AND rpr.date_issued IS NOT NULL
    `;

    db.query(sql, (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });

   // Add Record
  router.post('/record-per-request/add-record', verifyToken, (req, res) => {
    const { ctrl_number, recordType, recordPassword, uploadedCID, hash, dateIssued, transactionHash } = req.body;

    // Hash the password using SHA-256
    const hashedPassword = hashPassword(recordPassword);

    const sql = "INSERT INTO record_per_request (ctrl_number, password, record_type_id, ipfs, hash, date_issued, transaction_hash) VALUES ($1, $2, $3, $4, $5, $6, $7)";

    db.query(sql, [ctrl_number, hashedPassword, recordType, uploadedCID, hash, dateIssued, transactionHash], (err, result) => {
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
  router.put('/upload-record-per-request/:recordID', verifyToken, (req, res) => {
    const recordID = req.params.recordID;
    const { recordPassword, uploadedCID, hash, dateIssued, transactionHash } = req.body;

    // Hash the password using SHA-256
    const hashedPassword = hashPassword(recordPassword);

    const sql = "UPDATE record_per_request SET password = $1, ipfs = $2, hash = $3 , date_issued = $4, transaction_hash = $5 WHERE rpr_id = $6";

    db.query(sql, [hashedPassword, uploadedCID, hash, dateIssued, transactionHash, recordID], (err, result) => {
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
  router.put('/update-record-per-request/:recordID', verifyToken, (req, res) => {
    const recordID = req.params.recordID;
    const { recordStatus } = req.body;

    const sql = "UPDATE record_per_request SET record_status = $1 WHERE rpr_id = $2";

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

   // Update Record Expiration
   router.put('/update-record-per-request/is_expired/:recordID', verifyToken, (req, res) => {
    const recordID = req.params.recordID;
  
      sql = "UPDATE record_per_request SET is_expired = 1 WHERE rpr_id = ?";
    
    db.query(sql, [recordID], (err, result) => {
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
  
  // Update Record Notify
  router.put('/update-record-per-request/is_notified/:recordID', verifyToken, (req, res) => {
    const recordID = req.params.recordID;
  
      sql = "UPDATE record_per_request SET is_notified = 1 WHERE rpr_id = ?";
    
    db.query(sql, [recordID], (err, result) => {
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

// ======================= Student Record Request =========================== 

  router.get('/due-request', verifyToken, (req, res) => {
    const today = new Date();
    const sql = `
      SELECT *
      FROM record_request AS r
      INNER JOIN payment AS p ON p.ctrl_number = r.ctrl_number
      WHERE r.date_releasing <= $1 AND r.request_status IN ('Pending', 'Received'); 
    `;

    db.query(sql, [today], (err, results) => {
      if (err) return res.json(err);
      const data = results.rows;
      return res.json(data);
    });
  });

// ================ Type of Record Tab =======================

    router.get('/type-of-record', verifyToken, (req, res)=> {
        const sql = "SELECT * FROM type_of_record";
        db.query(sql, (err, results)=> {
            if(err) return res.json(err);
            const data = results.rows;
            return res.json(data);
        })
    })

    // Add Record
    router.post('/add-record', verifyToken, (req, res) => {
        const { type, price } = req.body;
        const is_for_alumni = false;
        // Check if required fields are present
        if (!type || !price) {
            return res.status(400).json({ message: 'Type and price are required' });
        } 
        else {
            const sql = "INSERT INTO type_of_record (type, price, is_for_alumni) VALUES ($1, $2, $3)";
            
            db.query(sql, [type, price, is_for_alumni], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to add record' });
            }
            return res.status(200).json({ message: 'Record added successfully' });
            });
        }
    });

    // Update Record
    router.put('/update-record/:recordId', verifyToken, (req, res) => {
        const recordId = req.params.recordId;
        const { type, price } = req.body;

        const sql = "UPDATE type_of_record SET type = $1, price = $2 WHERE id = $3";

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
    router.put('/delete-record/:recordId', verifyToken, (req, res) => {
        const recordId = req.params.recordId;
        const { type, price } = req.body;

        const sql = "DELETE FROM type_of_record WHERE id = $1";

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
  router.get('/users', verifyToken, (req, res)=> {
        
      const sql = `
          SELECT *
          FROM user_management;      
              
      `;
      db.query(sql, (err, results)=> {
          if(err) return res.json(err);
          const data = results.rows;
          return res.json(data);
      })
  })

// ================ Student Management =======================

  // Student Management Tab
    router.get('/student-management', verifyToken, (req, res)=> {
        
        const sql = `
            SELECT *
            FROM student_management 
            JOIN user_management ON student_management.user_id = user_management.user_id;              
        `;

        db.query(sql, (err, results)=> {
            if(err) return res.json(err);
            const data = results.rows;
            return res.json(data);
        })
    })

  // Student Management with UserID
  router.get('/student-management/:user_id', verifyToken, (req, res) => {
    const user_id = req.params.user_id;
        
        const sql = `
            SELECT *
            FROM student_management 
            JOIN user_management ON student_management.user_id = user_management.user_id
            WHERE student_management.user_id = $1;              
        `;

        db.query(sql, [user_id], (err, results)=> {
            if(err) return res.json(err);
            const data = results.rows;
            return res.json(data);
        })
    })

    // Add Record
  router.post('/student-management/add-record', verifyToken, (req, res) => {
    const formData = req.body;

    const email = formData.emailAddress;
    const password = hashPassword(formData.studentNumber);
    const wallet_address = formData.walletAddress.toLowerCase();
    
    const user_management_sql = "INSERT INTO user_management (email, password, wallet_address, role) VALUES ($1, $2, $3, 2) RETURNING user_id";
    
    db.query(user_management_sql, [email, password, wallet_address], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add record' });
    }

    const user_id = result.rows[0].user_id;
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
      date_of_graduation, permanent_address, mobile_number, email, is_alumni) VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;

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
  router.get('/registrar-management', verifyToken, (req, res)=> {
      
      const sql = `
          SELECT *
          FROM registrar_management 
          JOIN user_management ON registrar_management.user_id = user_management.user_id;              
      `;

      db.query(sql, (err, results)=> {
          if(err) return res.json(err);
          const data = results.rows;
          return res.json(data);
      })
  })

  // Student Management with UserID
  router.get('/registrar-management/:user_id', verifyToken, (req, res) => {
    const user_id = req.params.user_id;
        
        const sql = `
            SELECT *
            FROM registrar_management 
            JOIN user_management ON registrar_management.user_id = user_management.user_id
            WHERE registrar_management.user_id = $1;              
        `;

        db.query(sql, [user_id], (err, results)=> {
            if(err) return res.json(err);
            const data = results.rows;
            return res.json(data);
        })
    })

  // Add Record
  router.post('/registrar-management/add-record', verifyToken, (req, res) => {
    const formData = req.body;

    const email = formData.emailAddress;
    const password = hashPassword('Registrar123');
    const wallet_address = formData.walletAddress;
  
    const user_management_sql = "INSERT INTO user_management (email, password, wallet_address, role) VALUES ($1, $2, $3, 1) RETURNING user_id";
    
    db.query(user_management_sql, [email, password, wallet_address], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to add record' });
    }
    
    const user_id = result.rows[0].user_id;
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
      ($1, $2, $3, $4, $5, $6)`;

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

router.get('/student-record-request/:user_id', verifyToken, (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
    SELECT *
    FROM record_request AS r
    INNER JOIN payment AS p ON p.ctrl_number = r.ctrl_number
    WHERE r.student_id IN (
      SELECT id
      FROM student_management
      WHERE user_id = $1
    )
  `;
  
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.json(err);
    const data = results.rows;
    return res.json(data);
  });
});

// Add Record
router.post('/signature-request/add-record', verifyToken, (req, res) => {
  const { student_id, total_amount, transient_id, agreement_id } = req.body;

  // Calculate the date_releasing 15 days after the date_requested
  const date_requested = new Date();
  const date_releasing = new Date(date_requested);
  date_releasing.setDate(date_releasing.getDate() + 15);

  const recordRequestSQL = "INSERT INTO signature_request (transient_id, agreement_id, student_id, date_requested, date_releasing) VALUES ($1, $2, $3, $4, $5) RETURNING ctrl_number";
  const paymentSQL = "INSERT INTO signature_payment (ctrl_number, total_amount) VALUES ($1, $2)";

  db.query('BEGIN', async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to start transaction' });
    }
  
    try {
      const recordResult = await db.query(recordRequestSQL, [transient_id, agreement_id, student_id, date_requested, date_releasing]);
      const ctrl_number = recordResult.rows[0].ctrl_number;
  
      const paymentResult = await db.query(paymentSQL, [ctrl_number, total_amount]);
  
      // Commit the transaction if all queries were successful
      db.query('COMMIT', (commitErr) => {
        if (commitErr) {
          console.error(commitErr);
          return res.status(500).json({ message: 'Failed to commit transaction' });
        }
  
        return res.status(200).json({ message: 'Record added successfully', ctrl_number });
      });
    } catch (error) {
      // Rollback the transaction if any error occurs
      db.query('ROLLBACK', () => {
        console.error(error);
        return res.status(500).json({ message: 'Failed to add record' });
      });
    }
  });

});

router.post('/record-request/add-record', verifyToken, (req, res) => {
  const { record_id, student_id, purpose, total_amount } = req.body;

  // Split the comma-separated record_ids into an array
  const recordIds = record_id.split(',');

  // Calculate the date_releasing 15 days after the date_requested
  const date_requested = new Date();
  const date_releasing = new Date(date_requested);
  date_releasing.setDate(date_releasing.getDate() + 15);

  const recordRequestSQL = "INSERT INTO record_request (student_id, request_record_type_id, purpose, date_requested, date_releasing) VALUES ($1, $2, $3, $4, $5) RETURNING ctrl_number";
  const paymentSQL = "INSERT INTO payment (ctrl_number, total_amount) VALUES ($1, $2)";
  const recordPerRequestSQL = "INSERT INTO record_per_request (ctrl_number, record_type_id) VALUES ($1, $2)";

  db.query('BEGIN', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to add record' });
    }

    // Insert into record_request table
    db.query(recordRequestSQL, [student_id, record_id, purpose, date_requested, date_releasing], (err, result) => {
      if (err) {
        db.query('ROLLBACK', () => {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
        });
      }

      const ctrl_number = result.rows[0].ctrl_number; // Get the auto-generated ctrl_number from the record_request

      // Insert into payment table using the ctrl_number
      db.query(paymentSQL, [ctrl_number, total_amount], (err, paymentResult) => {
        if (err) {
          db.query('ROLLBACK', () => {
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
                db.query('ROLLBACK', () => {
                  console.error(err);
                  return res.status(500).json({ message: 'Failed to add record' });
                });
              }

              // Check if all insertions into record_per_request are complete
              if (index === recordIds.length - 1) {
                db.query('COMMIT', (err) => {
                  if (err) {
                    db.query('ROLLBACK', () => {
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
router.put('/cancel-record-request/:ctrl_number', verifyToken, (req, res) => {
  const ctrl_number = req.params.ctrl_number;

  const sql = "UPDATE record_request SET request_status = 'Cancelled' WHERE ctrl_number = $1";

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
router.put('/update-payment/:ctrl_number', verifyToken, (req, res) => {
  const ctrl_number = req.params.ctrl_number;
  const {total_amount, payment_method, payment_id } = req.body;

  const payment_date = new Date();
  const sql = "UPDATE payment SET payment_id = $1, payment_date = $2, total_amount = $3, payment_method = $4, payment_status = 'Paid'  WHERE ctrl_number = $5";

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

router.put('/signature/update-payment/:ctrl_number', verifyToken, (req, res) => {
  const ctrl_number = req.params.ctrl_number;
  const {total_amount, payment_method, payment_id } = req.body;

  const payment_date = new Date();
  const sql = "UPDATE signature_payment SET payment_id = $1, payment_date = $2, total_amount = $3, payment_method = $4, payment_status = 'Paid'  WHERE ctrl_number = $5";

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