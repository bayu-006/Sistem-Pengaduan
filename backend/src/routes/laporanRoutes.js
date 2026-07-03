const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { 
    createLaporan, 
    getAllLaporan, 
    getLaporanById, 
    updateLaporan, 
    deleteLaporan 
} = require('../controllers/laporanController');
const verifyToken = require('../middleware/authMiddleware');
const db = require('../config/db');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter
}).single('image'); // Expecting a single file with field name 'image'

// Semua route laporan perlu token
router.use(verifyToken);

// Route untuk mendapatkan semua kategori
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.promise().query('SELECT * FROM categories ORDER BY id');
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Routes Laporan - apply upload middleware then controller
router.post(
  '/',
  upload,
  createLaporan
);
router.get('/', getAllLaporan);
router.get('/:id', getLaporanById);
router.put('/:id', updateLaporan);
router.delete('/:id', deleteLaporan);

module.exports = router;