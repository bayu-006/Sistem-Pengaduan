const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Listen ke 0.0.0.0 agar bisa diakses dari HP/device lain
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API akan jalan di http://0.0.0.0:${PORT}`);
    console.log(`📱 Akses dari HP: http://192.168.137.1:${PORT}`);
});