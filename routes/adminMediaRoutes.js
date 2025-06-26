const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const type = req.body.mediaType;
        const uploadPath = type === 'image' ? 'public/images' : 'public/videos';

        fs.mkdir(uploadPath, { recursive: true })
            .then(() => cb(null, uploadPath))
            .catch(err => cb(err));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const type = req.body.mediaType;
    const allowedTypes = {
        image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        video: ['.mp4', '.webm', '.ogg', '.mov']
    };

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes[type] && allowedTypes[type].includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid ${type} file type`), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

// Helper function to get files with stats
async function getFilesWithStats(dir, extensions) {
    try {
        await fs.access(dir);
        const files = await fs.readdir(dir);
        return Promise.all(files.map(async file => {
            const filePath = path.join(dir, file);
            try {
                const stats = await fs.stat(filePath);
                const ext = path.extname(file).toLowerCase();

                if (stats.isFile() && extensions.includes(ext)) {
                    return {
                        filename: file,
                        size: stats.size,
                        uploadDate: stats.birthtime,
                        ext: ext.slice(1),
                        type: dir.includes('images') ? 'image' : 'video'
                    };
                }
            } catch (err) {
                console.error(`Error processing file ${file}:`, err);
                return null;
            }
        })).then(results => results.filter(Boolean));
    } catch (err) {
        console.error(`Error reading directory ${dir}:`, err);
        return [];
    }
}

// Admin media dashboard
router.get('/media', async (req, res) => {
    try {
        const { page = 1, filter = 'all' } = req.query;
        const limit = 12;
        const offset = (page - 1) * limit;

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];

        let mediaItems = [];

        if (filter === 'all' || filter === 'images') {
            const images = await getFilesWithStats('public/images', imageExtensions);
            mediaItems = mediaItems.concat(images);
        }

        if (filter === 'all' || filter === 'videos') {
            const videos = await getFilesWithStats('public/videos', videoExtensions);
            mediaItems = mediaItems.concat(videos);
        }

        // Sort by upload date (newest first)
        mediaItems.sort((a, b) => b.uploadDate - a.uploadDate);

        const paginatedItems = mediaItems.slice(offset, offset + limit);
        const totalPages = Math.ceil(mediaItems.length / limit);

        res.render('admin-media', {
            mediaItems: paginatedItems.map(item => ({
                ...item,
                uploadDate: item.uploadDate.toLocaleDateString(),
                size: (item.size / 1024 / 1024).toFixed(2) + ' MB'
            })),
            currentPage: parseInt(page),
            totalPages,
            currentFilter: filter,
            hasMedia: paginatedItems.length > 0
        });

    } catch (error) {
        console.error('Error in admin media route:', error);
        res.status(500).render('error', {
            message: 'Failed to load media dashboard',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Upload media files
router.post('/media/upload', upload.array('mediaFiles'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        res.json({
            success: true,
            message: `${req.files.length} files uploaded successfully`,
            files: req.files.map(file => ({
                filename: file.filename,
                path: `/uploads/${file.filename}`
            }))
        });
    } catch (error) {
        console.error('Error uploading media:', error);

        // Clean up uploaded files if there was an error
        if (req.files?.length > 0) {
            await Promise.all(req.files.map(file =>
                fs.unlink(file.path).catch(err => console.error('Error deleting file:', err))
            ));
        }

        res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});

// Delete media file
router.delete('/media/delete', async (req, res) => {
    try {
        const { filename, type } = req.query;

        // Validate inputs
        if (!filename || !type) {
            return res.status(400).json({
                success: false,
                message: 'Filename and type are required'
            });
        }

        // Security check
        if (!/^[\w\-\.]+$/.test(filename) || !['images', 'videos'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid parameters'
            });
        }

        // Construct absolute path - IMPORTANT: Update this to match your actual directory structure
        const filePath = path.join(process.cwd(), 'public', type, filename);
        console.log(`Attempting to delete: ${filePath}`);

        // Verify file exists
        try {
            await fs.access(filePath, fs.constants.F_OK);
            console.log('File exists, proceeding with deletion');
        } catch (err) {
            console.error('File access error:', err);
            return res.status(404).json({
                success: false,
                message: `File not found at: ${filePath}`
            });
        }

        // Delete file
        await fs.unlink(filePath);
        return res.json({
            success: true,
            message: 'File deleted successfully',
            path: filePath // For debugging
        });

    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during deletion',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
});

module.exports = router;