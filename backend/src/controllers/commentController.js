const db = require('../config/db');

// GET komentar berdasarkan laporan_id
const getCommentsByLaporanId = async (req, res) => {
    const { laporanId } = req.params;

    try {
        const [comments] = await db.promise().query(`
            SELECT comments.*, users.name as user_name
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.laporan_id = ?
            ORDER BY comments.created_at ASC
        `, [laporanId]);

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// CREATE komentar
const createComment = async (req, res) => {
    const { laporan_id, comment } = req.body;
    const user_id = req.user.id;

    if (!laporan_id || !comment) {
        return res.status(400).json({ message: 'Laporan ID dan komentar harus diisi.' });
    }

    try {
        const [laporan] = await db.promise().query('SELECT id FROM laporan WHERE id = ?', [laporan_id]);
        if (laporan.length === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
        }

        const [result] = await db.promise().query(
            'INSERT INTO comments (laporan_id, user_id, comment) VALUES (?, ?, ?)',
            [laporan_id, user_id, comment]
        );

        res.status(201).json({
            message: 'Komentar berhasil ditambahkan',
            commentId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// DELETE komentar
const deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        const [comment] = await db.promise().query('SELECT * FROM comments WHERE id = ?', [id]);
        if (comment.length === 0) {
            return res.status(404).json({ message: 'Komentar tidak ditemukan.' });
        }

        if (userRole !== 'admin' && userRole !== 'super_admin' && comment[0].user_id !== userId) {
            return res.status(403).json({ message: 'Tidak berwenang menghapus komentar ini.' });
        }

        await db.promise().query('DELETE FROM comments WHERE id = ?', [id]);
        res.json({ message: 'Komentar berhasil dihapus.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { getCommentsByLaporanId, createComment, deleteComment };