const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const app = express();

// Middleware - URUTAN PENTING!
app.use(cors());
app.use(express.json());  // ← Ini harus ada untuk baca JSON
app.use(express.urlencoded({ extended: true })); // ← Tambahkan ini
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kategori', kategoriRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API Sistem Pengaduan Masyarakat is running' });
});

module.exports = app;