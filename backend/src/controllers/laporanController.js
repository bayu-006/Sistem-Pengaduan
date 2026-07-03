const db = require('../config/db');

// CREATE Laporan
const createLaporan = async (req, res) => {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file); 

    const {
      title,
      description,
      category_id,
      location,
      status = 'pending'
    } = req.body;

    const user_id = req.user.id;

    const image = req.file
      ? req.file.filename
      : null;

    console.log('IMAGE:', image);

    try {
      const [result] = await db.promise().query(
        `INSERT INTO laporan
        (user_id, category_id, title, description, location, image, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          category_id,
          title,
          description,
          location,
          image,
          status
        ]
      );

      res.status(201).json({
        message: 'Laporan berhasil dibuat',
        laporanId: result.insertId
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server error'
      });
    }
};

// GET All Laporan
const getAllLaporan = async (req, res) => {
    try {
        const [laporan] = await db.promise().query(`
            SELECT laporan.*, 
                   users.name as user_name, 
                   categories.name as category_name
            FROM laporan
            JOIN users ON laporan.user_id = users.id
            JOIN categories ON laporan.category_id = categories.id
            ORDER BY laporan.created_at DESC
        `);

        res.json(laporan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET Laporan by ID
const getLaporanById = async (req, res) => {
    const { id } = req.params;

    try {
        const [laporan] = await db.promise().query(`
            SELECT laporan.*, 
                   users.name as user_name, 
                   categories.name as category_name
            FROM laporan
            JOIN users ON laporan.user_id = users.id
            JOIN categories ON laporan.category_id = categories.id
            WHERE laporan.id = ?
        `, [id]);

        if (laporan.length === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
        }

        res.json(laporan[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// UPDATE Laporan
const updateLaporan = async (req, res) => {
    const { id } = req.params;
    const { title, description, category_id, location, status } = req.body;

    try {
        const [laporan] = await db.promise().query('SELECT * FROM laporan WHERE id = ?', [id]);
        if (laporan.length === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
        }

        await db.promise().query(
            'UPDATE laporan SET title = ?, description = ?, category_id = ?, location = ?, status = ? WHERE id = ?',
            [
                title || laporan[0].title,
                description || laporan[0].description,
                category_id || laporan[0].category_id,
                location || laporan[0].location,
                status || laporan[0].status,
                id
            ]
        );

        res.json({ message: 'Laporan berhasil diupdate.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// DELETE Laporan
const deleteLaporan = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.promise().query('DELETE FROM laporan WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
        }

        res.json({ message: 'Laporan berhasil dihapus.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    createLaporan,
    getAllLaporan,
    getLaporanById,
    updateLaporan,
    deleteLaporan
};