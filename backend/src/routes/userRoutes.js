const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    createAdmin
} = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route user perlu login
router.use(verifyToken);

// Routes untuk super admin
router.get('/', getAllUsers);           // Lihat semua user
router.get('/:id', getUserById);        // Lihat user by ID
router.put('/:id/role', updateUserRole); // Update role user
router.delete('/:id', deleteUser);       // Hapus user
router.post('/admin', createAdmin);      // Buat admin baru

module.exports = router;