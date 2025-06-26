const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

async function getFilesByExtensions(dir, extensions) {
    try {
        await fs.access(dir);
        const files = await fs.readdir(dir);
        const validFiles = [];

        for (const file of files) {
            const filePath = path.join(dir, file);
            try {
                const stats = await fs.stat(filePath);
                if (stats.isFile()) {
                    const ext = path.extname(file).toLowerCase();
                    if (extensions.includes(ext)) {
                        validFiles.push(file);
                    }
                }
            } catch (statError) {
                console.warn(`Could not stat file ${file}:`, statError.message);
                continue;
            }
        }

        return validFiles;
    } catch (err) {
        console.error(`Error reading directory ${dir}:`, err.message);
        return [];
    }
}

function validatePageNumber(page, totalPages) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum)) return 1;
    return Math.max(1, Math.min(pageNum, totalPages));
}

router.get('/media', async (req, res) => {
    try {
        const imagesDir = path.join(__dirname, '../public/images');
        const videosDir = path.join(__dirname, '../public/videos');
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];

        const [allImages, allVideosFiles] = await Promise.all([
            getFilesByExtensions(imagesDir, imageExtensions),
            getFilesByExtensions(videosDir, videoExtensions)
        ]);

        // Process video files to extract name and extension
        const allVideos = allVideosFiles.map(video => {
            const ext = path.extname(video).slice(1).toLowerCase();
            const name = path.basename(video, path.extname(video));
            return {
                filename: video,
                ext,
                name
            };
        });

        const pageSize = Math.min(Math.max(parseInt(req.query.pageSize) || 6, 1), 50);
        const sort = ['asc', 'desc'].includes(req.query.sort) ? req.query.sort : 'asc';
        const mediaType = ['images', 'videos', 'all'].includes(req.query.type) ? req.query.type : 'all';

        // Fix: Set currentView based on mediaType parameter
        const currentView = mediaType === 'videos' ? 'videos' :
            mediaType === 'images' ? 'images' : 'images';

        const naturalSort = (a, b) => {
            return a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        };

        let sortedImages = [...allImages].sort(naturalSort);
        let sortedVideos = [...allVideos].sort((a, b) => naturalSort(a.filename, b.filename));

        if (sort === 'desc') {
            sortedImages.reverse();
            sortedVideos.reverse();
        }

        // Fix: Calculate pagination based on the selected media type
        let totalItems, pagedImages, pagedVideos;

        if (mediaType === 'images') {
            totalItems = sortedImages.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            const currentPage = validatePageNumber(req.query.page, totalPages);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            pagedImages = sortedImages.slice(startIndex, endIndex);
            pagedVideos = []; // Don't show videos when images filter is active

            const pagination = {
                current: currentPage,
                total: totalPages,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1,
                next: currentPage < totalPages ? currentPage + 1 : null,
                prev: currentPage > 1 ? currentPage - 1 : null
            };

            const stats = {
                totalImages: allImages.length,
                totalVideos: allVideos.length,
                currentPageImages: pagedImages.length,
                currentPageVideos: 0
            };

            return res.render('visuals', {
                allImages: pagedImages,
                allVideos: pagedVideos,
                currentPage,
                totalPages,
                sort,
                pageSize,
                mediaType,
                currentView,
                pagination,
                stats,
                hasImages: allImages.length > 0,
                hasVideos: allVideos.length > 0
            });

        } else if (mediaType === 'videos') {
            totalItems = sortedVideos.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            const currentPage = validatePageNumber(req.query.page, totalPages);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            pagedImages = []; // Don't show images when videos filter is active
            pagedVideos = sortedVideos.slice(startIndex, endIndex);

            const pagination = {
                current: currentPage,
                total: totalPages,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1,
                next: currentPage < totalPages ? currentPage + 1 : null,
                prev: currentPage > 1 ? currentPage - 1 : null
            };

            const stats = {
                totalImages: allImages.length,
                totalVideos: allVideos.length,
                currentPageImages: 0,
                currentPageVideos: pagedVideos.length
            };

            return res.render('visuals', {
                allImages: pagedImages,
                allVideos: pagedVideos,
                currentPage,
                totalPages,
                sort,
                pageSize,
                mediaType,
                currentView,
                pagination,
                stats,
                hasImages: allImages.length > 0,
                hasVideos: allVideos.length > 0
            });

        } else {
            // Show all media (original behavior)
            totalItems = Math.max(sortedImages.length, sortedVideos.length);
            const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            const currentPage = validatePageNumber(req.query.page, totalPages);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;

            pagedImages = sortedImages.slice(startIndex, endIndex);
            pagedVideos = sortedVideos.slice(startIndex, endIndex);

            const pagination = {
                current: currentPage,
                total: totalPages,
                hasNext: currentPage < totalPages,
                hasPrev: currentPage > 1,
                next: currentPage < totalPages ? currentPage + 1 : null,
                prev: currentPage > 1 ? currentPage - 1 : null
            };

            const stats = {
                totalImages: allImages.length,
                totalVideos: allVideos.length,
                currentPageImages: pagedImages.length,
                currentPageVideos: pagedVideos.length
            };

            return res.render('visuals', {
                allImages: pagedImages,
                allVideos: pagedVideos,
                currentPage,
                totalPages,
                sort,
                pageSize,
                mediaType,
                currentView,
                pagination,
                stats,
                hasImages: allImages.length > 0,
                hasVideos: allVideos.length > 0
            });
        }

    } catch (error) {
        console.error('Error in /media route:', error);
        res.status(500).render('error', {
            message: 'Failed to load media files',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

module.exports = router;