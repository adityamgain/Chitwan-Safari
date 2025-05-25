const express = require('express');
const router = express.Router();
const { fetchReviews, createReview } = require('../controller/reviewController');

router.get('/testimonials', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || 'newest';

    try {
        const {
            reviews,
            totalPages,
            currentPage,
            totalReviews,
            averageRating
        } = await fetchReviews(page, sort);

        res.render('testimonials', {
            reviews,
            totalPages,
            currentPage,
            totalReviews,
            averageRating,
            sort  // send sort back to EJS for UI state
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching reviews');
    }
});

router.post('/testimonials', createReview);

module.exports = router;
