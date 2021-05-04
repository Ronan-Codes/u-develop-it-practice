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


// Default response for any other request (NOT FOUND) 
    // Make sure this is the last route
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});