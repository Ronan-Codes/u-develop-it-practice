const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.post('/vote', ({ body }, res) => {
    // Data validation
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO votes (voter_id, candidate_id)
                VALUES (?, ?)`;
    const params = [body.voter_id, body.candidate_id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            changes: result.affectedRows
        });
    });
});

router.get('/votes', (req, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
                FROM votes
                LEFT JOIN candidates ON votes.candidate_id = candidates.id
                LEFT JOIN parties ON candidates.party_id = parties.id
                GROUP BY candidate_id ORDER BY count DESC;`
    
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

module.exports = router;

// The front end will need to send us IDs for the voter and candidate. 
// Both fields are required, meaning we should probably use our friend's 
    // inputCheck() function again. 
// We also want to avoid malicious SQL injection, which warrants 
    // using `prepared statements`.

// Aggregate functions of SQL
    // COUNT() - count how many times a certain field value appears
    // AVG() - return average value within a group 
    // SUM() - add up all of the values in a group
    // MIN() - return the minimum value of a group
// https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html

// GROUP BY can consolidate several rows of data, grouping by a shared 
// value (e.g., candidate_id). The nice thing about GROUP BY is that you 
// can then run an aggregate function to retrieve an average, sum, or 
// minimum value from the group.


// The candidate_id field is a foreign key, so we can still join this table with the candidates table. While we're at it, we can also join the candidates table with the parties table to pull in their party affiliation.

