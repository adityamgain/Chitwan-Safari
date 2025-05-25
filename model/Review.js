const db = require('../config/database');

const getReviewsByPage = (page = 1, reviewsPerPage = 6) => {
    const offset = (page - 1) * reviewsPerPage;
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM tbl_Reviews 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?`;
        db.query(query, [reviewsPerPage, offset], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

const getTotalReviewsCount = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM tbl_Reviews';
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results[0].count);
        });
    });
};

const addReview = (name, country, rating, reviewText) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO tbl_Reviews (name, country, stars, review, created_at) VALUES (?, ?, ?, ?, NOW())';
        db.query(query, [name, country, rating, reviewText], (err, results) => {
            if (err) reject(err);
            else resolve(results.insertId);
        });
    });
};

module.exports = { getReviewsByPage, getTotalReviewsCount, addReview };
