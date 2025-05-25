const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Home route
router.get('/', async (req, res) => {
    try {
        const reviews = await new Promise((resolve, reject) => {
            const query = 'SELECT name, country, review FROM tbl_Reviews ORDER BY created_at DESC LIMIT 3';
            db.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        res.render('home', { reviews });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.render('home', { reviews: [] });
    }
});

module.exports = router;
