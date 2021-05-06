const { response } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../../db/connection')
const inputCheck = require('../../utils/inputCheck');

router.get('/voters', (req, res) => {
    // Could also use `Array.ptototype.sort()` to sort in JS
    const sql = `SELECT * FROM voters ORDER BY last_name`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        });
    });
});

// GET single voter 
router.get('/voters/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

router.post('/voter', ({ body }, res) => {
    // Data validation - !!! REVIEW !!! 
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }
    
    const sql = `INSERT INTO voters (first_name, last_name, email)
                VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

router.put('/voter/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, 'email');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({ 
                message: 'Voter not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        };
    });
});

router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
    
    db.query(sql, req.params.id, (err, result) => {
        if(err) {
            res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Voter not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
    // Without the params array, the code is just as legible without the extra expenditure.
});

module.exports = router;

// Other options for SQL other than sorting data
    // -- get all voters who do not have a last name of Cooper or Jarman
    // SELECT * FROM voters WHERE last_name != 'Cooper' AND last_name != 'Jarman';

    // -- get all voters who have a .edu email address
    // SELECT * FROM voters WHERE email LIKE '%.edu';

    // -- get only the last created voter
    // SELECT * FROM voters ORDER BY created_at DESC LIMIT 1;