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
}

// ========================= Login  =========================

  // forgot password
  router.post('/check-email', (req, res) => {
    const { email } = req.body.record;

    const sql = "SELECT email, user_id FROM user_management WHERE email = $1";
    
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ message: 'Email not found' });
      }

      const user = results.rows[0];
      // Generate a JWT token
      const token = jwt.sign({ email: user.email, user_id: user.user_id }, secretKey, {
        expiresIn: '1h', // Token expires in 10 minutes
      });

      // Include the token in the response
      res.json({ user, token });
    });
  });

  router.post('/reset-password', (req, res) => {
    const { token } = req.body.record;

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        return res.status(500).json({ message: 'Token expired.' });
      } else {
        const user_id = decoded.user_id;
        return res.status(200).json({ message: 'Token verified.', user_id: user_id });
      }
    });

  });

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

    function updateLoginAttempts(email) {
      const incrementAttemptsSql = 'UPDATE user_management SET login_attempts = login_attempts + 1 WHERE email = $1';
      const incrementAttemptsValues = [email];
      db.query(incrementAttemptsSql, incrementAttemptsValues, (err) => {
        if (err) {
          console.error('MySQL query error:', err);
        } else {
          // Check if attempts reach five
          const checkAttemptsSql = 'SELECT login_attempts FROM user_management WHERE email = $1';
          const checkAttemptsValues = [email];
          db.query(checkAttemptsSql, checkAttemptsValues, (err, attemptsResults) => {
            if (err) {
              console.error('MySQL query error:', err);
            } else if (attemptsResults.rows[0].login_attempts === 4) {
              // Lock the account
              lockAccount(email);
            }
          });
        }
      });
    }
  
    function lockAccount(email) {
      const lockAccountSql = 'UPDATE user_management SET is_locked = true, login_attempts = 0 WHERE email = $1';
      const lockAccountValues = [email];
      db.query(lockAccountSql, lockAccountValues, (err) => {
        if (err) {
          console.error('MySQL query error:', err);
        } else {
          console.log('Account locked and login attempts reset for user:', email);
        }
      });
    }
  
    // Hash the password using SHA-256
    const hashedPassword = hashPassword(password);
  
    // Check if the user is already locked
    const checkLockSql = 'SELECT is_locked FROM user_management WHERE email = $1';
    const checkLockValues = [email];
    db.query(checkLockSql, checkLockValues, (err, lockResults) => {
      if (err) {
        console.error('MySQL query error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }
  
      if (lockResults.rows[0].is_locked) {
        return res.status(403).json({ message: 'Account locked due to multiple failed attempts' });
      }
  
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
          // Increment login attempts
          updateLoginAttempts(email);
          return res.status(401).json({ message: 'Incorrect email or password' });
        }
  
        const user = results.rows[0];
        const userData = {
          user_id: user.user_id,
          role: user.role,
          status: user.status,
        };
  
        // Generate a JWT token
        const token = jwt.sign(userData, secretKey, {
          expiresIn: '2h', // Token expires in 2 hours (adjust as needed)
        });
  
        // Include the token in the response
        res.json({ user: userData, token });
      });
    });
  });
  
// ========================= Profile  =========================

  // Update Record
  router.put('/change-password/:user_id', verifyToken, (req, res) => {
    const user_id = req.params.user_id;
    const { password } = req.body;

    const hashedPassword = hashPassword(password);

    const sql = "UPDATE user_management SET password = $1 WHERE user_id = $2";

    db.query(sql, [hashedPassword, user_id], (err, result) => {
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
        return res.json({ rpr_id: checkResults.rows[0].rpr_id})
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
      const sql = `
      SELECT *
      FROM record_per_request as rpr
      INNER JOIN record_request as r ON rpr.ctrl_number = r.ctrl_number
      INNER JOIN type_of_record as tor ON rpr.record_type_id = tor.id
      INNER JOIN student_management as sm ON r.student_id = sm.id
      WHERE rpr.transaction_hash = $1 AND rpr.password = $2;
      `;     

      db.query(sql, [transaction_hash, hashedPassword], (err, results) => {
        if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
          return;
        }

        if (results.rows.length > 0) {
          // Record found in the database
          const data = results.rows[0];

          res.json({ 
            success: true, 
            record_status: data.record_status, 
            record_expiration: data.is_expired, 
            date_issued: data.date_issued,
            student_name: data.first_name + ' ' + data.middle_name + ' ' + data.last_name,
            record_type: data.type,
            rpr_id: data.rpr_id,
          });
        } else {
          // Record not found in the database or invalid password
          res.status(401).json({ success: false }); // Return a 401 status code
        }
      });
    
  }); 

  router.get('/verification-table', verifyToken, (req, res) => {

      // Query the database to retrieve user data
      const sql = `
      SELECT *, 
        v.id as v_id,
        v.last_name as v_last_name, 
        v.first_name as v_first_name, 
        v.middle_name as v_middle_name 
      FROM verification as v
      ORDER BY v.id DESC
      `;     

      db.query(sql, (err, results)=> {
        if(err) return res.json(err);
        const data = results.rows;
        return res.json(data);
    })
    
  }); 
  router.get('/verification-student/:student_id', verifyToken, (req, res) => {

    const student_id = req.params.student_id;
      // Query the database to retrieve user data
      const sql = `
      SELECT *, 
        v.id as v_id,
        v.last_name as v_last_name, 
        v.first_name as v_first_name, 
        v.middle_name as v_middle_name 
      FROM verification as v
      INNER JOIN record_per_request as rpr ON rpr.rpr_id = v.record_per_request_id
      INNER JOIN record_request as r ON rpr.ctrl_number = r.ctrl_number
      INNER JOIN type_of_record as tor ON rpr.record_type_id = tor.id
      INNER JOIN student_management as sm ON r.student_id = sm.id
      WHERE sm.id = $1
      ORDER BY v.id DESC
      `;     

      db.query(sql, [student_id], (err, results)=> {
        if(err) return res.json(err);
        const data = results.rows;
        return res.json(data);
    })
    
  }); 

  

  // for verification portal
  router.get('/verification/getData', verifyToken, (req, res) => {

      // Query the database to retrieve user data
      const sql = `
      SELECT *, tor.type as record_type, rpr.ctrl_number as control_number
      FROM record_per_request as rpr
      INNER JOIN record_request as r ON rpr.ctrl_number = r.ctrl_number
      INNER JOIN type_of_record as tor ON rpr.record_type_id = tor.id
      INNER JOIN student_management as sm ON r.student_id = sm.id;
      `;     

      db.query(sql, (err, results) => {
        if (err) {
          console.error('MySQL query error:', err);
          res.status(500).json({ success: false, message: 'Internal server error' });
          return;
        }

        if (results.rows.length > 0) {
          // Record found in the database
          const data = results.rows;
          return res.json(data);
        } else {
          // Record not found in the database or invalid password
          res.status(401).json({ success: false }); // Return a 401 status code
        }
        
      });
    
  }); 


  router.post('/verify/add-record', (req, res) => {
    const formData = req.body;

    const currentTimestamp = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Manila', // Set the time zone to Philippines
    };
    
    const formattedTimestamp = currentTimestamp.toLocaleString('en-US', options);
    const timestamp = currentTimestamp.toISOString(); // Format compatible with PostgreSQL
    

    const values = [
      formData.rpr_id,
      formData.lastName,
      formData.firstName,
      formData.middleName,
      formData.institution,
      formData.isSuccess,
      formData.verificationResult,
      timestamp
    ];

    const verification_sql = `INSERT INTO verification (record_per_request_id, last_name, 
      first_name, middle_name, institution, is_success, verification_result, timestamp) VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;

    db.query(verification_sql, values, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
      }      

      const verificationID = result.rows[0].id;
      res.status(200).json({ 
        verificationID: verificationID,
        message: 'Record added successfully',
      });
    });
  
});

// ========================= Notification  =========================

  router.get('/notif/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const sql = `
        SELECT *
        FROM notification as n
        WHERE n.user_id = $1
        ORDER BY n.timestamp DESC
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

router.get('/email/signature-request', verifyToken, (req, res) => {
  const sql = `
    SELECT *
    FROM signature_request AS r
    INNER JOIN signature_payment AS p ON p.ctrl_number = r.ctrl_number
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
    ORDER BY r.ctrl_number DESC  
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
    ORDER BY r.ctrl_number DESC
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
      ORDER BY r.ctrl_number DESC    
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

    const sql = "UPDATE payment SET is_payment_notified = TRUE WHERE ctrl_number = $1";

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
  // Update Record Notified
  router.put('/payment/update-signature/notify/:ctrl_number', verifyToken, (req, res) => {
    const ctrl_number = req.params.ctrl_number;

    const sql = "UPDATE signature_payment SET is_payment_notified = TRUE WHERE ctrl_number = $1";

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
        SELECT *,
        type_of_record.id AS type_of_record_id
        FROM record_per_request
        INNER JOIN record_request ON record_per_request.ctrl_number = record_request.ctrl_number
        INNER JOIN payment ON record_per_request.ctrl_number = payment.ctrl_number
        INNER JOIN type_of_record ON record_per_request.record_type_id = type_of_record.id
        WHERE record_per_request.ctrl_number = $1
        ORDER BY record_per_request.rpr_id DESC
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
      ORDER BY r.ctrl_number DESC
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
      ORDER BY sr.ctrl_number DESC
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
    ORDER BY sr.ctrl_number DESC
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
      ORDER BY r.ctrl_number DESC
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
      ORDER BY r.ctrl_number DESC
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
      ORDER BY r.ctrl_number DESC
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

    const sql = "INSERT INTO record_per_request (ctrl_number, password, record_type_id, ipfs, date_issued, transaction_hash) VALUES ($1, $2, $3, $4, $5, $6)";

    db.query(sql, [ctrl_number, hashedPassword, recordType, uploadedCID, dateIssued, transactionHash], (err, result) => {
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

    const sql = "UPDATE record_per_request SET password = $1, ipfs = $2, date_issued = $3, transaction_hash = $4 WHERE rpr_id = $5";

    db.query(sql, [hashedPassword, uploadedCID, dateIssued, transactionHash, recordID], (err, result) => {
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

    const year = today.getFullYear(); // Get the year (YYYY)
    let month = today.getMonth() + 1; // Get the month (MM)
    let day = today.getDate(); // Get the day (DD)
    
    // Adjust month and day formatting to ensure they have leading zeros if necessary
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    
    // Construct the formatted date string in "YYYY-MM-DD" format
    const formattedDate = `${year}-${month}-${day}`;

    const sql = `
      SELECT *
      FROM record_request AS r
      INNER JOIN payment AS p ON p.ctrl_number = r.ctrl_number
      WHERE r.date_releasing <= $1 AND r.request_status IN ('Pending', 'Received')
      ORDER BY r.ctrl_number DESC
    `;

    db.query(sql, [formattedDate], (err, results) => {
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
            JOIN user_management ON student_management.user_id = user_management.user_id
            ORDER BY student_management.user_id DESC;             
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
      0
    ];

    const student_management_sql = `INSERT INTO student_management (user_id, student_number, last_name, 
      first_name, middle_name, college, course, entry_year_from,  entry_year_to, 
      date_of_graduation, permanent_address, mobile_number, is_alumni) VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;

    db.query(student_management_sql, values, (err, result2) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
      }      

      return res.status(200).json({ message: 'Record added successfully' });
    });
  });
});

// Update Student Record
router.put('/student-management/update-record/:user_id', verifyToken, (req, res) => {
  const user_id = req.params.user_id;
  const formData = req.body;

  const values = [
    formData.lastName,
    formData.firstName,
    formData.middleName,
    formData.college,
    formData.course,
    formData.entryYearFrom,
    formData.entryYearTo,
    formData.graduationDate,
    formData.permanentAddress,
    formData.is_alumni,  // is_alumni
    user_id,  // user_id for WHERE clause
  ];
  
  const student_management_update_sql = `
    UPDATE student_management
    SET
      last_name = $1,
      first_name = $2,
      middle_name = $3,
      college = $4,
      course = $5,
      entry_year_from = $6,
      entry_year_to = $7,
      date_of_graduation = $8,
      permanent_address = $9,
      is_alumni = $10
    WHERE
      user_id = $11
  `;
  
  db.query(student_management_update_sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update student record' });
    }
  
    if (result.rowCount === 0) {
      // No rows were affected, meaning the record with the given user_id doesn't exist
      return res.status(404).json({ message: 'Student record not found' });
    }
  
    // Now, update user_management
    const status = formData.is_active == 1 ? 'active' : 'inactive';  // Convert is_active to 1 or 0
    const user_management_values = [formData.is_locked, status, user_id];
  
    const user_management_update_sql = `
      UPDATE user_management
      SET
        is_locked = $1,
        status = $2
      WHERE
        user_id = $3
    `;
  
    db.query(user_management_update_sql, user_management_values, (err, userManagementResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update user record' });
      }
  
      if (userManagementResult.rowCount === 0) {
        // No rows were affected, meaning the user record with the given user_id doesn't exist
        return res.status(404).json({ message: 'User record not found' });
      }
  
      return res.status(200).json({ message: 'Record updated successfully' });
    });
  });
});

// ================ Registrar Management =======================

  // Registrar Management Tab
  router.get('/registrar-management', verifyToken, (req, res)=> {
      
      const sql = `
          SELECT *
          FROM registrar_management 
          JOIN user_management ON registrar_management.user_id = user_management.user_id
          ORDER BY registrar_management.user_id DESC;              
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
    const wallet_address = formData.walletAddress.toLowerCase();
  
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
      formData.mobileNumber
    ];

    const registrar_management_sql = `INSERT INTO registrar_management (user_id, last_name, 
      first_name, middle_name, mobile_number) VALUES 
      ($1, $2, $3, $4, $5)`;

    db.query(registrar_management_sql, values, (err, result2) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
      }      

      return res.status(200).json({ message: 'Record added successfully' });
    });
  });
});

// Update Student Record
router.put('/registrar-management/update-record/:user_id', verifyToken, (req, res) => {
  const user_id = req.params.user_id;
  const formData = req.body;

  const values = [
    formData.lastName,
    formData.firstName,
    formData.middleName,
    user_id,  // user_id for WHERE clause
  ];
  
  const student_management_update_sql = `
    UPDATE registrar_management
    SET
      last_name = $1,
      first_name = $2,
      middle_name = $3a       
    WHERE
      user_id = $4
  `;
  
  db.query(student_management_update_sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to update student record' });
    }
  
    if (result.rowCount === 0) {
      // No rows were affected, meaning the record with the given user_id doesn't exist
      return res.status(404).json({ message: 'Student record not found' });
    }
  
    // Now, update user_management
    const status = formData.is_active == 1 ? 'active' : 'inactive';  // Convert is_active to 1 or 0
    const user_management_values = [formData.is_locked, status, user_id];
  
    const user_management_update_sql = `
      UPDATE user_management
      SET
        is_locked = $1,
        status = $2
      WHERE
        user_id = $3
    `;
  
    db.query(user_management_update_sql, user_management_values, (err, userManagementResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to update user record' });
      }
  
      if (userManagementResult.rowCount === 0) {
        // No rows were affected, meaning the user record with the given user_id doesn't exist
        return res.status(404).json({ message: 'User record not found' });
      }
  
      return res.status(200).json({ message: 'Record updated successfully' });
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
    ORDER BY r.ctrl_number DESC
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

// Update Signature Record
router.put('/update-signature-request/:new_ctrl_number', verifyToken, (req, res) => {
  const new_ctrl_number = req.params.new_ctrl_number;
  const { date_releasing, request_status } = req.body;

  const sql = "UPDATE signature_request SET date_releasing = $1, request_status = $2 WHERE ctrl_number = $3";

  db.query(sql, [date_releasing, request_status, new_ctrl_number], (err, result) => {
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

// Cancel signature Request
router.put('/cancel-signature-request/:ctrl_number', verifyToken, (req, res) => {
  const ctrl_number = req.params.ctrl_number;

  const sql = "UPDATE signature_request SET request_status = 'Cancelled' WHERE ctrl_number = $1";

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

router.post('/record-request/add-record', verifyToken, (req, res) => {
  const { record_id, student_id, purpose, total_amount } = req.body;

  // Split the comma-separated record_ids into an array
  const recordIds = record_id.split(',');

  // Calculate the date_releasing 15 days after the date_requested
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const date_requested = formatDate(new Date());
  const date_releasing = new Date(date_requested);
  date_releasing.setDate(date_releasing.getDate() + 15);
  const formattedDate = formatDate(date_releasing);

  const recordRequestSQL = "INSERT INTO record_request (student_id, request_record_type_id, purpose, date_requested, date_releasing) VALUES ($1, $2, $3, $4, $5) RETURNING ctrl_number";
  const paymentSQL = "INSERT INTO payment (ctrl_number, total_amount) VALUES ($1, $2)";
  const recordPerRequestSQL = "INSERT INTO record_per_request (ctrl_number, record_type_id) VALUES ($1, $2)";

  db.query('BEGIN', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to add record' });
    }

    db.query(recordRequestSQL, [student_id, record_id, purpose, date_requested, formattedDate], (err, result) => {
      if (err) {
        db.query('ROLLBACK', () => {
          console.error(err);
          return res.status(500).json({ message: 'Failed to add record' });
        });

      } else {
        db.query('COMMIT', (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to commit transaction' });
          }
          const ctrl_number = result.rows[0].ctrl_number;
          
          db.query(paymentSQL, [ctrl_number, total_amount], (err, paymentResult) => {
            if (err) {
              db.query('ROLLBACK', () => {
                console.error(err);
                return res.status(500).json({ message: 'Failed to add payment' });
              });
            } else {
              // Use Promise.all to handle multiple recordPerRequestSQL queries
              Promise.all(recordIds.map(recordId => {
                return new Promise((resolve, reject) => {
                  db.query(recordPerRequestSQL, [ctrl_number, recordId], (err, recordPerRequestResult) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(recordPerRequestResult);
                    }
                  });
                });
              })).then(() => {
                db.query('COMMIT', (err) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to commit transaction' });
                  }
                  return res.status(200).json({ message: 'Your request has been submitted.', ctrl_number: ctrl_number });
                });
              }).catch((error) => {
                db.query('ROLLBACK', () => {
                  console.error(error);
                  return res.status(500).json({ message: 'Failed to add record per request' });
                });
              });
            }
          });

          // return res.status(200).json({ message: 'Your request has been submitted.', ctrl_number: ctrl_number });
        });
      }
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