import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const BuatLaporan = () => {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    const [isDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    const [title, setTitle] = useState('');
    const [description, setDescription] =
        useState('');

    const [categoryId, setCategoryId] =
        useState('');

    const [location, setLocation] =
        useState('');

    const [categories, setCategories] =
        useState([]);

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response =
                await API.get(
                    '/laporan/categories'
                );

            setCategories(
                response.data
            );
        } catch (error) {
            console.error(error);

            setError(
                'Gagal mengambil kategori'
            );
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);

            setPreview(
                URL.createObjectURL(file)
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const formData =
                new FormData();

            formData.append(
                'title',
                title
            );

            formData.append(
                'description',
                description
            );

            formData.append(
                'category_id',
                categoryId
            );

            formData.append(
                'location',
                location
            );

            if (image) {
                formData.append(
                    'image',
                    image
                );
            }

            await API.post(
                '/laporan',
                formData
            );

            alert(
                'Laporan berhasil dikirim'
            );

            navigate('/laporan');
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data
                    ?.message ||
                    'Gagal membuat laporan'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>

            <Sidebar
                user={user}
                activeMenu="buat-laporan"
                handleLogout={handleLogout}
                isDarkMode={isDarkMode}
            />

            <main style={styles.main}>
                <div style={styles.container}>

                    {/* HEADER */}
                    <div style={styles.header}>
                        <div>
                            <h1 style={styles.title}>
                                Portal Pengaduan Masyarakat
                            </h1>

                            <p style={styles.subtitle}>
                                Sampaikan laporan atau pengaduan masyarakat secara resmi dan transparan.
                            </p>
                        </div>

                        <button
                            style={styles.backButton}
                            onClick={() =>
                                navigate('/laporan')
                            }
                        >
                            ← Kembali
                        </button>
                    </div>

                    {/* ALERT */}
                    <div style={styles.infoBox}>
                        📢 Pastikan laporan yang dikirim sesuai fakta dan disertai bukti pendukung.
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div style={styles.error}>
                            {error}
                        </div>
                    )}

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                    >

                        {/* JUDUL */}
                        <div style={styles.group}>
                            <label style={styles.label}>
                                Judul Laporan
                            </label>

                            <input
                                type="text"
                                placeholder="Contoh: Jalan Rusak di Kecamatan ..."
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                                required
                            />
                        </div>

                        {/* KATEGORI */}
                        <div style={styles.group}>
                            <label style={styles.label}>
                                Kategori Laporan
                            </label>

                            <select
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(
                                        e.target.value
                                    )
                                }
                                style={styles.select}
                                required
                            >
                                <option value="">
                                    -- Pilih Kategori --
                                </option>

                                {categories.map(
                                    (cat) => (
                                        <option
                                            key={
                                                cat.id
                                            }
                                            value={
                                                cat.id
                                            }
                                        >
                                            {cat.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* LOKASI */}
                        <div style={styles.group}>
                            <label style={styles.label}>
                                Lokasi Laporan
                            </label>

                            <input
                                type="text"
                                placeholder="Contoh: Jl. Merdeka RT 03 RW 02"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </div>

                        {/* DESKRIPSI */}
                        <div style={styles.group}>
                            <label style={styles.label}>
                                Isi Laporan
                            </label>

                            <textarea
                                placeholder="Tuliskan detail laporan secara lengkap dan jelas..."
                                value={
                                    description
                                }
                                onChange={(e) =>
                                    setDescription(
                                        e.target
                                            .value
                                    )
                                }
                                style={
                                    styles.textarea
                                }
                                rows="7"
                                required
                            />
                        </div>

                        {/* FILE */}
                        <div style={styles.group}>
                            <label style={styles.label}>
                                Upload Bukti Foto
                            </label>

                            <label
                                style={
                                    styles.uploadBox
                                }
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                    style={{
                                        display:
                                            'none',
                                    }}
                                />

                                <div>
                                    📷 Klik untuk upload gambar
                                </div>

                                <small>
                                    Format:
                                    JPG,
                                    PNG,
                                    JPEG
                                </small>
                            </label>
                        </div>

                        {/* PREVIEW */}
                        {preview && (
                            <div
                                style={
                                    styles.previewContainer
                                }
                            >
                                <img
                                    src={preview}
                                    alt="preview"
                                    style={
                                        styles.previewImage
                                    }
                                />
                            </div>
                        )}

                        {/* BUTTON */}
                        <button
                            type="submit"
                            style={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading
                                ? 'Mengirim Laporan...'
                                : 'Kirim Laporan'}
                        </button>

                    </form>
                </div>
            </main>
        </div>
    );
};

const styles = {

    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f1f5f9',
    },

    main: {
        flex: 1,
        marginLeft: '260px',
        padding: '40px 24px',
    },

    container: {
        maxWidth: '900px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '18px',
        padding: '40px',
        boxShadow:
            '0 4px 20px rgba(0,0,0,0.06)',
        border:
            '1px solid #e2e8f0',
    },

    header: {
        display: 'flex',
        justifyContent:
            'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        gap: '20px',
        flexWrap: 'wrap',
    },

    title: {
        margin: 0,
        fontSize: '34px',
        fontWeight: '800',
        color: '#0f172a',
    },

    subtitle: {
        marginTop: '8px',
        color: '#64748b',
        fontSize: '15px',
        maxWidth: '600px',
    },

    backButton: {
        border: 'none',
        background: '#e2e8f0',
        padding: '12px 18px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '600',
    },

    infoBox: {
        background:
            '#eff6ff',
        color: '#1d4ed8',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '25px',
        fontSize: '14px',
        border:
            '1px solid #bfdbfe',
    },

    error: {
        background:
            '#fee2e2',
        color: '#dc2626',
        padding: '14px',
        borderRadius: '10px',
        marginBottom: '20px',
        fontWeight: '600',
    },

    group: {
        marginBottom: '24px',
    },

    label: {
        display: 'block',
        marginBottom: '10px',
        fontWeight: '700',
        color: '#334155',
    },

    input: {
        width: '100%',
        padding: '15px',
        borderRadius: '12px',
        border:
            '1px solid #cbd5e1',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
    },

    textarea: {
        width: '100%',
        padding: '15px',
        borderRadius: '12px',
        border:
            '1px solid #cbd5e1',
        fontSize: '15px',
        outline: 'none',
        resize: 'vertical',
        boxSizing: 'border-box',
    },

    select: {
        width: '100%',
        padding: '15px',
        borderRadius: '12px',
        border:
            '1px solid #cbd5e1',
        fontSize: '15px',
        outline: 'none',
        background: '#fff',
        cursor: 'pointer',
        boxSizing: 'border-box',
    },

    uploadBox: {
        border:
            '2px dashed #94a3b8',
        borderRadius: '14px',
        padding: '30px',
        textAlign: 'center',
        cursor: 'pointer',
        background:
            '#f8fafc',
        color: '#475569',
        display: 'block',
    },

    previewContainer: {
        marginBottom: '24px',
    },

    previewImage: {
        width: '100%',
        maxHeight: '350px',
        objectFit: 'cover',
        borderRadius: '16px',
        border:
            '1px solid #e2e8f0',
    },

    submitBtn: {
        width: '100%',
        padding: '18px',
        border: 'none',
        borderRadius: '14px',
        background:
            'linear-gradient(to right,#2563eb,#1d4ed8)',
        color: '#fff',
        fontSize: '17px',
        fontWeight: '700',
        cursor: 'pointer',
    },
};

export default BuatLaporan;