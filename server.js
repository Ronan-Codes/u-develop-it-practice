// MySQL 
const mysql = require('mysql2');

// Express
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MySQL Database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: '26signs!!',
        database: 'election'
    },
    console.log('Connected to the election database.')
);
// replace the values of user and password with your MySQL username and password.

const inputCheck = require('./utils/inputCheck');

// Get all candidates 
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return; 
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
// ParamsNote: can change params :id into anythin. Ex: age.
    // Format: /api/candidates/7 
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        })
    })
})
// Because params can be accepted in the database call as an array, 
// params is assigned as an array with a single element, req.params.id.

// Delete a candidate 
    // ? placeholder makes this a `prepared statement` 
    // 1 is a hardcoded param. Param argument can be array.
    // result shows which one got deleted?
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result)
// })

// Delete a candidate 
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if(err) {
            // ?? why is error message different from ones above?
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                // number of rows affected
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Create a candidate
    // Not setting id will create new id automatically 
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//                 Values (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Create a candidate 
app.post('/api/candidate', ({ body }, res) => {
    // !!! REVIEW this inputCheck function
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    // id is auto-generated here
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        })
    })
})
// Review: Notice that we're using object destructuring to pull the 
    // body property out of the request object. (req.body)  
// This inputCheck module was provided by a helpful U Develop It member. We'll use this module to verify that user info in the request can create a candidate.
    // import inputCheck first near top of server

// Default response for any other request (NOT FOUND) 
    // Make sure this is the last route
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});