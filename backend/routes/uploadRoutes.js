const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');

// Ensure directories exist
const uploadDir = 'uploads/daily-reports/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage strategy
const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (req.originalUrl.includes('daily-report')) {
            cb(null, uploadDir);
        } else {
            cb(null, 'uploads/');
        }
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

// File validation
const fileFilter = (req, file, cb) => {
    const filetypes = /pdf|png|jpg|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images and PDFs only'));
    }
};

// Init upload
const upload = multer({
    storage,
    limits: { fileSize: 5242880 }, // 5 MB LIMIT
    fileFilter
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({
            message: 'File uploaded successfully',
            filePath: `/${req.file.path.replace(/\\/g, '/')}`
        });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

// @desc    Upload multiple files for daily report
// @route   POST /api/upload/daily-report
// @access  Private
router.post('/daily-report', protect, upload.array('files', 10), (req, res) => {
    if (req.files && req.files.length > 0) {
        const filePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
        res.json({
            message: 'Files uploaded successfully',
            filePaths
        });
    } else {
        res.status(400).json({ message: 'No files uploaded' });
    }
});

module.exports = router;
