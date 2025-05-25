const express = require('express');
const router = express.Router();

// EJS view routes
router.get('/', (req, res) => res.render('home'));
router.get('/activities', (req, res) => res.render('activities'));
router.get('/activities/safari', (req, res) => res.render('safari'));
router.get('/activities/canoeing', (req, res) => res.render('canoening'));
router.get('/activities/sunsets', (req, res) => res.render('sunsets'));
router.get('/activities/tharu', (req, res) => res.render('tharu'));
router.get('/activities/birdwatching', (req, res) => res.render('birdwatching'));
router.get('/activities/homestay', (req, res) => res.render('homestay'));
router.get('/activities/jungle-walk', (req, res) => res.render('jungle-walk'));
router.get('/activities/jatayou-restaurant', (req, res) => res.render('jatayou-restaurant'));
router.get('/booking', (req, res) => res.render('booking'));
router.get('/bookings', (req, res) => res.render('booking-success'));
router.get('/testimonials', (req, res) => res.render('testimonials'));

module.exports = router;
