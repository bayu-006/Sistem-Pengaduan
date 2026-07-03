const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET semua user (hanya super admin)
const getAllUsers = async (req, res) => {
    // Cek role super admin
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Hanya Super Admin yang bisa mengakses' });
    }

    try {
        const [users] = await db.promise().query(`
            SELECT id, name, email, role, created_at 
            FROM users 
            ORDER BY created_at DESC
        `);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET user by ID (hanya super admin)
const getUserById = async (req, res) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Hanya Super Admin yang bisa mengakses' });
    }

    const { id } = req.params;

    try {
        const [users] = await db.promise().query(`
            SELECT id, name, email, role, created_at 
            FROM users 
            WHERE id = ?
        `, [id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// UPDATE role user (hanya super admin)
const updateUserRole = async (req, res) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Hanya Super Admin yang bisa mengubah role' });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin', 'super_admin'].includes(role)) {
        return res.status(400).json({ message: 'Role tidak valid. Pilihan: user, admin, super_admin' });
    }

    // Cegah super admin mengubah role sendiri (opsional)
    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'Tidak bisa mengubah role sendiri.' });
    }

    try {
        const [result] = await db.promise().query(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        res.json({ message: `Role user berhasil diubah menjadi ${role}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// DELETE user (hanya super admin)
const deleteUser = async (req, res) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Hanya Super Admin yang bisa menghapus user' });
    }

    const { id } = req.params;

    // Cegah super admin menghapus diri sendiri
    if (parseInt(id) === req.user.id) {
        return res.status(400).json({ message: 'Tidak bisa menghapus akun sendiri.' });
    }

    try {
        const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        res.json({ message: 'User berhasil dihapus.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// CREATE admin baru (hanya super admin)
const createAdmin = async (req, res) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Hanya Super Admin yang bisa membuat admin baru' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Semua field harus diisi.' });
    }

    try {
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.promise().query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, 'admin']
        );

        res.status(201).json({
            message: 'Admin baru berhasil dibuat',
            userId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    createAdmin
};