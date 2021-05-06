// transferred to db/connection.js
    // const mysql = require('mysql2');

const db = require('./db/connection.js');

// Add near the top of file
const apiRoutes = require('./routes/apiRoutes');
// don't need to include index.js in route (automatic)

// Express
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes - Add after Express middleware
app.use('/api', apiRoutes);
// By adding the /api prefix here, we can remove it from the individual 
//  route expressions after we move them to their new home.

// transferred to db/connection.js
    // Connect to MySQL Database
    // const db = mysql.createConnection(
    //     {
    //         host: 'localhost',
    //         // Your MySQL username,
    //         user: 'root',
    //         // Your MySQL password
    //         password: '26signs!!',
    //         database: 'election'
    //     },
    //     console.log('Connected to the election database.')
    // );
    // replace the values of user and password with your MySQL username and password.

    // Used in candidateRoutes.js instead
// const inputCheck = require('./utils/inputCheck');

// Get all candidates 
// app.get('/api/candidates', (req, res) => {
    // const sql = `SELECT candidates.*, parties.name
    //             AS party_name
    //             FROM candidates
    //             LEFT JOIN parties
    //             ON candidates.party_id = parties.id`;

    // db.query(sql, (err, rows) => {
    //     if(err) {
    //         res.status(500).json({ error: err.message });
    //         return; 
    //     }
    //     res.json({
    //         message: 'success',
    //         data: rows
    //     });
    // });
// });

// GET a single candidate
// ParamsNote: can change params :id into anythin. Ex: age.
    // Format: /api/candidates/7 
// app.get('/api/candidate/:id', (req, res) => {
    // const sql = `SELECT candidates.*, parties.name
    //             AS party_name
    //             FROM candidates
    //             LEFT JOIN parties
    //             ON candidates.party_id = parties.id
    //             WHERE candidates.id = ?`;
    // const params = [req.params.id];

    // db.query(sql, params, (err, row) => {
    //     if(err) {
    //         res.status(400).json({ error: err.message });
    //         return;
    //     }
    //     res.json({
    //         message: 'success',
    //         data: row
    //     })
    // })
// })
// Because params can be accepted in the database call as an array, 
// params is assigned as an array with a single element, req.params.id.

// Delete a candidate 
// app.delete('/api/candidate/:id', (req, res) => {
    // const sql = `DELETE FROM candidates WHERE id = ?`;
    // const params = [req.params.id];

    // db.query(sql, params, (err, result) => {
    //     if(err) {
    //         // ?? why is error message different from ones above?
    //         res.statusMessage(400).json({ error: res.message });
    //     } else if (!result.affectedRows) {
    //         res.json({
    //             message: 'Candidate not found'
    //         });
    //     } else {
    //         res.json({
    //             message: 'deleted',
    //             // number of rows affected
    //             changes: result.affectedRows,
    //             id: req.params.id
    //         });
    //     }
    // });
// });

// Create a candidate 
// app.post('/api/candidate', ({ body }, res) => {
    // // !!! REVIEW this inputCheck function
    // const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')

    // if (errors) {
    //     res.status(400).json({ error: errors });
    //     return;
    // }

    // // id is auto-generated here
    // const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    //             VALUES (?,?,?)`;
    // const params = [body.first_name, body.last_name, body.industry_connected];

    // db.query(sql, params, (err, result) => {
    //     if(err) {
    //         res.status(400).json({ error: err.message });
    //         return;
    //     }
    //     res.json({
    //         message: 'success',
    //         data: body
    //     })
    // })
// })
// Review: Notice that we're using object destructuring to pull the 
    // body property out of the request object. (req.body)  
// This inputCheck module was provided by a helpful U Develop It member. We'll use this module to verify that user info in the request can create a candidate.
    // import inputCheck first near top of server

// UPDATE a candidate's party 
// app.put('/api/candidate/:id', (req, res) => {
    // const errors = inputCheck(req.body, 'party_id');
    // if(errors) {
    //     res.status(400).json({ error: errors });
    //     return;
    // }
    // // This now forces any PUT request to /api/candidate/:id to 
    // // include a party_id property. Even if the intention is to 
    // // remove a party affiliation by setting it to null, the party_id 
    // // property is still required.

    // const sql = `UPDATE candidates SET party_id = ?
    //             WHERE id = ?`;

    // const params = [req.body.party_id, req.params.id];
    
    // db.query(sql, params, (err, result) => {
    //     if(err) {
    //         res.status(400).json({ error: err.message });
    //         // check if a record was found
    //     } else if (!result.affectedRows) {
    //         res.json({
    //             message: 'Candidate not found'
    //         });
    //     } else {
    //         res.json({
    //             message: 'success',
    //             data: req.body,
    //             changes: result.affectedRows
    //         });
    //     }
    // });
// });

// GET all parties rows
// app.get('/api/parties', (req, res) => {
//     const sql = `SELECT * FROM parties`;
//     db.query(sql, (err, rows) => {
//         if(err) {
//             res.status(500).json({ error: err.message }); 
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: rows
//         });
//     });
// });

// GET single party
// app.get('/api/party/:id', (req, res) => {
//     const sql = 'SELECT * FROM parties WHERE id = ?';
//     const params = [req.params.id];
    
//     db.query(sql, params, (err, row) => {
//         if(err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data:row
//         });
//     });
// });

// DELETE from parties table
// app.delete('/api/party/:id', (req, res) => {
//     const sql = `DELETE FROM parties WHERE id = ?`;
//     const params = [req.params.id];

//     db.query(sql, params, (err, result) => {
//         if(err) {
//             res.status(400).json({ error: err.message });
//             // checks if anything was deleted 
//         } else if(!result.affectedRows) {
//             res.json({
//                 message: 'Party not found'
//             })
//         } else {
//             res.json({
//                 message: 'deleted',
//                 changes: result.affectedRows,
//                 id: req.params.id
//             });
//         }
//     });
// });

// Default response for any other request (NOT FOUND) 
    // Make sure this is the last route
app.use((req, res) => {
    res.status(404).end();
})

// Start server after DB connection
db.connect(err => {
    if(err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}); 
