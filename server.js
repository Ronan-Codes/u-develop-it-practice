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

// make SQL query to database. Returns rows matching query
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// })

// GET a single candidate 
// db.query(`Select * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// })

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

// Default response for any other request (NOT FOUND) 
    // Make sure this is the last route
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});