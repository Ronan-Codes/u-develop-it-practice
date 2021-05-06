const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck.js');

// app object should be changed to router, and route URLs don't need to
// include '/api' anymore because that prefix is defined in server.js.

// originally app.get('/api/candidates')
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// originally app.get('/api/candidate/:id')
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            return;
        }
        res.json({
            message: 'success',
            data: row
        })
    })
});

// originally app.post('/api/candidate')
router.post('/candidate', ({
    body
}, res) => {
    // !!! REVIEW this inputCheck function
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')

    if (errors) {
        res.status(400).json({
            error: errors
        });
        return;
    }

    // id is auto-generated here
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            return;
        }
        res.json({
            message: 'success',
            data: body
        })
    })
})

// originally app.put('/api/candidate/:id')
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
        res.status(400).json({
            error: errors
        });
        return;
    }
    // This now forces any PUT request to /api/candidate/:id to 
    // include a party_id property. Even if the intention is to 
    // remove a party affiliation by setting it to null, the party_id 
    // property is still required.

    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;

    const params = [req.body.party_id, req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({
                error: err.message
            });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// originally app.delete('/api/candidate/:id')
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            // ?? why is error message different from ones above?
            res.statusMessage(400).json({
                error: res.message
            });
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

module.exports = router;