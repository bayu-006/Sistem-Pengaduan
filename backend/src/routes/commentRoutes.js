const express = require('express');
const { getCommentsByLaporanId, createComment, deleteComment } = require('../controllers/commentController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken); // Semua route komentar perlu login

router.get('/laporan/:laporanId', getCommentsByLaporanId);
router.post('/', createComment);
router.delete('/:id', deleteComment);

module.exports = router;