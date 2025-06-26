// routes/viewRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const db = require('../config/database');

// Utility: shuffle an array in place
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Home route (GET '/')
router.get('/', async (req, res) => {
    try {
        // 1) Fetch  reviews from the database
        const reviews = await new Promise((resolve, reject) => {
            const query = `
                SELECT name, country, review, stars, created_at
                FROM tbl_Reviews
                ORDER BY created_at DESC
            `;
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // 2) Read all image filenames from public/images
        const imagesDir = path.join(__dirname, '../public/images');
        let allImages = [];
        try {
            allImages = fs
                .readdirSync(imagesDir)
                .filter((file) => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
                });
        } catch (err) {
            console.error('Error reading images directory:', err);
            allImages = [];
        }

        // 3) Shuffle and pick the first 8 images
        const shuffledImages = shuffleArray(allImages);
        const randomImages = shuffledImages.slice(0, 8);

        // 4) Read all video filenames from public/videos
        const videosDir = path.join(__dirname, '../public/videos');
        let allVideos = [];
        try {
            allVideos = fs
                .readdirSync(videosDir)
                .filter((file) => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);
                });
        } catch (err) {
            console.error('Error reading videos directory:', err);
            allVideos = [];
        }

        // 5) Shuffle and pick first 4, then map to { filename, ext }
        const shuffledVideos = shuffleArray(allVideos);
        const randomVideos = shuffledVideos.slice(0, 8).map((file) => ({
            filename: file,
            ext: path.extname(file).slice(1), // e.g. "mp4"
        }));

        // 6) Render 'home' with both randomImages and randomVideos
        res.render('home', { reviews, randomImages, randomVideos });
    } catch (err) {
        console.error('Error in home route:', err);
        res.render('home', { reviews: [], randomImages: [], randomVideos: [] });
    }
});

module.exports = router;
