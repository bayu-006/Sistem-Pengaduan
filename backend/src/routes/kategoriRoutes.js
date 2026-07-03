const express = require('express');
const router = express.Router();
const db = require('../config/db');


// GET semua kategori
router.get('/', (req, res) => {

    const sql = `
        SELECT 
            categories.id,
            categories.name,
            COUNT(laporan.id) AS laporan_count
        FROM categories
        LEFT JOIN laporan
            ON laporan.category_id = categories.id
        GROUP BY categories.id
        ORDER BY categories.name ASC
    `;

    db.query(sql, (err, rows) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: err.message
            });
        }

        res.json(rows);
    });
});

router.get('/:id', (req, res) => {

    const sql = `
        SELECT *
        FROM categories
        WHERE id = ?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, rows) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            if (rows.length === 0) {
                return res.status(404).json({
                    message: 'Kategori tidak ditemukan'
                });
            }

            res.json(rows[0]);
        }
    );
});

// TAMBAH kategori
router.post('/', (req, res) => {

    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({
            message: 'Nama kategori wajib diisi'
        });
    }

    const sql = `
        INSERT INTO categories(name)
        VALUES(?)
    `;

    db.query(
        sql,
        [name.trim()],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: 'Kategori berhasil ditambahkan',
                id: result.insertId
            });
        }
    );
});


// EDIT kategori
router.put('/:id', (req, res) => {

    const { name } = req.body;

    const sql = `
        UPDATE categories
        SET name=?
        WHERE id=?
    `;

    db.query(
        sql,
        [name, req.params.id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: 'Kategori berhasil diupdate'
            });
        }
    );
});


// DELETE kategori
router.delete('/:id', (req, res) => {

    const sql = `
        DELETE FROM categories
        WHERE id=?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: 'Kategori berhasil dihapus'
            });
        }
    );
});


module.exports = router;