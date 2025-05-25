const Review = require('../model/Review');
const db = require('../config/database');

const fetchReviews = async (page = 1, sort = 'newest') => {
    const reviewsPerPage = 6;

    let sortQuery;
    switch (sort) {
        case 'highest':
            sortQuery = 'ORDER BY stars DESC, created_at DESC';
            break;
        case 'lowest':
            sortQuery = 'ORDER BY stars ASC, created_at DESC';
            break;
        case 'newest':
        default:
            sortQuery = 'ORDER BY created_at DESC';
    }

    const offset = (page - 1) * reviewsPerPage;

    const reviews = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM tbl_Reviews ${sortQuery} LIMIT ? OFFSET ?`;
        db.query(query, [reviewsPerPage, offset], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });

    const totalReviews = await Review.getTotalReviewsCount();

    const averageRatingResult = await new Promise((resolve, reject) => {
        const query = 'SELECT AVG(stars) AS average FROM tbl_Reviews';
        db.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results[0].average || 0);
        });
    });

    const averageRating = parseFloat(averageRatingResult).toFixed(1);
    const totalPages = Math.ceil(totalReviews / reviewsPerPage);

    return {
        reviews,
        totalPages,
        currentPage: page,
        totalReviews,
        averageRating
    };
};

const createReview = async (req, res) => {
    const { reviewerName, country, rating, reviewText } = req.body;
    try {
        await Review.addReview(reviewerName, country, rating, reviewText);
        res.redirect('/testimonials');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to submit review.');
    }
};

module.exports = { fetchReviews, createReview };
