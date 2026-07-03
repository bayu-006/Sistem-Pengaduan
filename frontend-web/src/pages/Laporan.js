import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

import Sidebar from '../components/Sidebar';
import SidebarAdmin from '../components/AdminSidebar';

const Laporan = () => {
    const [laporan, setLaporan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [activeMenu, setActiveMenu] = useState('all');
    const [search, setSearch] = useState('');

    // State untuk modal edit status
    const [showModal, setShowModal] = useState(false);
    const [selectedLaporan, setSelectedLaporan] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [reason, setReason] = useState('');
    const [addCommentToUser, setAddCommentToUser] = useState(true);

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    const isAdmin =
        user.role === 'admin' ||
        user.role === 'super_admin';

    const isSuperAdmin =
        user.role === 'super_admin';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'pending': return 'Menunggu';
            case 'approved': return 'Disetujui';
            case 'rejected': return 'Ditolak';
            default: return status;
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending': return '⏳';
            case 'approved': return '✅';
            case 'rejected': return '❌';
            default: return '📝';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return '#f97316';
            case 'approved': return '#22c55e';
            case 'rejected': return '#ef4444';
            default: return '#64748b';
        }
    };

    const openEditModal = (item) => {
        setSelectedLaporan(item);
        setNewStatus(item.status);
        setReason('');
        setAddCommentToUser(true);
        setShowModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedLaporan || !newStatus) return;

        const oldStatus = selectedLaporan.status;
        
        if (oldStatus === newStatus) {
            setShowModal(false);
            return;
        }

        // Konfirmasi sebelum update (sama seperti DetailLaporan)
        const confirmed = window.confirm(
            `⚠️ Ubah status dari "${getStatusText(oldStatus)}" ` +
            `menjadi "${getStatusText(newStatus)}"?`
        );
        if (!confirmed) return;

        setUpdatingId(selectedLaporan.id);

        try {
            // 1. Update status ke backend (sama seperti DetailLaporan)
            await API.put(`/laporan/${selectedLaporan.id}`, {
                status: newStatus
            });

            // 2. Tambahkan komentar ke user jika dicentang (sama seperti DetailLaporan)
            if (addCommentToUser) {
                let commentText = '';
                
                if (reason && reason.trim() !== '') {
                    commentText = `🔔 *ADMIN mengubah status laporan*\n\n` +
                        `Status: ${getStatusIcon(oldStatus)} ${getStatusText(oldStatus)} → ${getStatusIcon(newStatus)} ${getStatusText(newStatus)}\n\n` +
                        `📝 *Alasan Perubahan:*\n${reason}\n\n` +
                        `👤 Diubah oleh: ${user.name}\n` +
                        `🕐 Waktu: ${new Date().toLocaleString('id-ID')}`;
                } else {
                    commentText = `🔔 *ADMIN mengubah status laporan*\n\n` +
                        `Status: ${getStatusIcon(oldStatus)} ${getStatusText(oldStatus)} → ${getStatusIcon(newStatus)} ${getStatusText(newStatus)}\n\n` +
                        `👤 Diubah oleh: ${user.name}\n` +
                        `🕐 Waktu: ${new Date().toLocaleString('id-ID')}`;
                }
                
                // Sama seperti DetailLaporan - coba kedua endpoint
                let commentSent = false;
                
                // Try endpoint /comments
                try {
                    await API.post('/comments', {
                        laporan_id: selectedLaporan.id,
                        comment: commentText
                    });
                    commentSent = true;
                    console.log('Komentar terkirim via /comments');
                } catch (e1) {
                    console.log('Gagal via /comments, mencoba /komentar');
                }
                
                // If first failed, try /komentar
                if (!commentSent) {
                    try {
                        await API.post('/komentar', {
                            laporan_id: selectedLaporan.id,
                            komentar: commentText
                        });
                        commentSent = true;
                        console.log('Komentar terkirim via /komentar');
                    } catch (e2) {
                        console.error('Gagal via kedua endpoint:', e2);
                    }
                }
            }

            // 3. Refresh data dari backend
            await fetchData();
            
            setShowModal(false);
            
            let successMessage = `✅ Status berhasil diubah dari ${getStatusText(oldStatus)} menjadi ${getStatusText(newStatus)}`;
            if (addCommentToUser && reason) {
                successMessage += `\n📝 Alasan telah dikirim ke komentar laporan`;
            } else if (addCommentToUser && !reason) {
                successMessage += `\n📢 Pemberitahuan perubahan telah dikirim ke komentar`;
            }
            alert(successMessage);
            
        } catch (error) {
            console.error('Error updating status:', error);
            alert('❌ Gagal update status: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdatingId(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get('/laporan');
            setLaporan(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        return laporan
            .filter((item) => {
                if (activeMenu === 'pending')
                    return item.status === 'pending';

                if (activeMenu === 'approved')
                    return item.status === 'approved';

                if (activeMenu === 'rejected')
                    return item.status === 'rejected';

                return true;
            })
            .filter((item) =>
                item.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
    }, [laporan, activeMenu, search]);

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                '⚠️ Yakin ingin menghapus laporan ini?'
            )
        )
            return;

        try {
            await API.delete(`/laporan/${id}`);
            fetchData();
            alert('✅ Laporan berhasil dihapus');
        } catch (err) {
            alert('❌ Gagal menghapus laporan');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return {
                    background: '#fef3c7',
                    color: '#92400e',
                };
            case 'approved':
                return {
                    background: '#dcfce7',
                    color: '#166534',
                };
            case 'rejected':
                return {
                    background: '#fee2e2',
                    color: '#991b1b',
                };
            default:
                return {};
        }
    };

    return (
        <div style={styles.wrapper}>
            {isAdmin ? (
                <SidebarAdmin
                    user={user}
                    activeMenu="laporan"
                    handleLogout={handleLogout}
                />
            ) : (
                <Sidebar
                    user={user}
                    activeMenu="laporan"
                    handleLogout={handleLogout}
                />
            )}

            <div style={styles.main}>
                <div style={styles.topbar}>
                    <div>
                        <h2 style={styles.title}>
                            Dashboard Laporan
                        </h2>
                        <p style={styles.subtitle}>
                            Semua user dapat melihat laporan
                        </p>
                    </div>

                    {/* USER BIASA BISA BUAT */}
                    {!isAdmin && (
                        <button
                            style={styles.primaryBtn}
                            onClick={() =>
                                navigate('/laporan/buat')
                            }
                        >
                            + Buat Laporan
                        </button>
                    )}
                </div>

                {/* FILTER */}
                <div style={styles.controlBar}>
                    <div style={styles.tabs}>
                        {[
                            'all',
                            'pending',
                            'approved',
                            'rejected',
                        ].map((tab) => (
                            <button
                                key={tab}
                                onClick={() =>
                                    setActiveMenu(tab)
                                }
                                style={{
                                    ...styles.tab,
                                    ...(activeMenu === tab
                                        ? styles.tabActive
                                        : {}),
                                }}
                            >
                                {tab === 'all' ? 'Semua' : 
                                 tab === 'pending' ? 'Menunggu' :
                                 tab === 'approved' ? 'Disetujui' : 'Ditolak'}
                            </button>
                        ))}
                    </div>

                    <input
                        placeholder="Cari laporan..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={styles.search}
                    />
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div style={styles.grid}>
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                style={styles.skeletonCard}
                            />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={styles.empty}>
                        <h3>📭 Tidak ada laporan</h3>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filtered.map((item) => (
                            <div
                                key={item.id}
                                style={styles.card}
                            >
                                {/* IMAGE */}
                                <img
                                    src={
                                        item.image
                                            ? `http://localhost:5000/uploads/${item.image}`
                                            : 'https://via.placeholder.com/400x250?text=No+Image'
                                    }
                                    alt="laporan"
                                    style={styles.image}
                                />

                                {/* BODY */}
                                <div style={styles.body}>
                                    <div style={styles.row}>
                                        <h3
                                            style={
                                                styles.cardTitle
                                            }
                                        >
                                            {item.title}
                                        </h3>

                                        <span
                                            style={{
                                                ...styles.status,
                                                ...getStatusStyle(
                                                    item.status
                                                ),
                                            }}
                                        >
                                            {getStatusIcon(item.status)} {getStatusText(item.status)}
                                        </span>
                                    </div>

                                    <p style={styles.desc}>
                                        {item.description?.slice(
                                            0,
                                            90
                                        )}
                                        {item.description?.length > 90 ? '...' : ''}
                                    </p>

                                    <div style={styles.meta}>
                                        <span>
                                            📍 {item.location || '-'}
                                        </span>

                                        <span>
                                            👤 {item.user_name}
                                        </span>

                                        <span>
                                            📅 {new Date(
                                                item.created_at
                                            ).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div style={styles.actionRow}>
                                        <button
                                            style={styles.detailBtn}
                                            onClick={() =>
                                                navigate(
                                                    `/laporan/${item.id}`
                                                )
                                            }
                                        >
                                            📋 Detail
                                        </button>

                                        {isAdmin && (
                                            <button
                                                style={styles.editBtn}
                                                onClick={() =>
                                                    openEditModal(item)
                                                }
                                                disabled={updatingId === item.id}
                                            >
                                                {updatingId === item.id ? '⏳...' : '✏️ Status'}
                                            </button>
                                        )}

                                        {isSuperAdmin && (
                                            <button
                                                style={styles.deleteBtn}
                                                onClick={() =>
                                                    handleDelete(
                                                        item.id
                                                    )
                                                }
                                            >
                                                🗑️ Hapus
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL EDIT STATUS - SAMA PERSIS DENGAN DETAIL LAPORAN */}
            {showModal && selectedLaporan && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>
                                ✏️ Ubah Status Laporan
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={styles.modalClose}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <p style={styles.modalText}>
                                <strong>{selectedLaporan.title}</strong>
                            </p>
                            
                            <div style={styles.statusChangeInfo}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        backgroundColor: getStatusColor(selectedLaporan.status) + '20',
                                        color: getStatusColor(selectedLaporan.status)
                                    }}>
                                        {getStatusIcon(selectedLaporan.status)} {getStatusText(selectedLaporan.status)}
                                    </span>
                                    <span style={styles.arrow}>→</span>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        style={styles.statusSelect}
                                    >
                                        <option value="pending">⏳ Menunggu</option>
                                        <option value="approved">✅ Disetujui</option>
                                        <option value="rejected">❌ Ditolak</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={styles.label}>
                                    Alasan Perubahan <span style={{ fontSize: '12px', color: '#94a3b8' }}>(opsional)</span>:
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Masukkan alasan perubahan status (akan terlihat oleh pelapor)..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    style={styles.textarea}
                                />
                            </div>

                            <div 
                                style={styles.checkboxContainer}
                                onClick={() => setAddCommentToUser(!addCommentToUser)}
                            >
                                <input
                                    type="checkbox"
                                    checked={addCommentToUser}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        setAddCommentToUser(e.target.checked);
                                    }}
                                    style={styles.checkbox}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={styles.checkboxLabel}>
                                        💬 Tambahkan pemberitahuan ke komentar laporan
                                    </div>
                                    <div style={styles.checkboxNote}>
                                        Jika dicentang, perubahan status akan terlihat oleh pelapor laporan
                                    </div>
                                </div>
                            </div>
                            
                            {!addCommentToUser && (
                                <div style={styles.warningNote}>
                                    ⚠️ Pelapor tidak akan mendapatkan pemberitahuan perubahan status
                                </div>
                            )}
                        </div>

                        <div style={styles.modalFooter}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={styles.cancelButton}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                style={styles.confirmButton}
                                disabled={updatingId === selectedLaporan.id}
                            >
                                {updatingId === selectedLaporan.id ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Laporan;

/* ================= STYLES ================= */

const styles = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'Inter, sans-serif',
    },

    main: {
        flex: 1,
        marginLeft: 260,
        padding: 24,
    },

    topbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12,
    },

    title: {
        margin: 0,
        fontSize: 26,
        fontWeight: 800,
        color: '#0f172a',
    },

    subtitle: {
        marginTop: 6,
        opacity: 0.6,
        fontSize: 13,
        color: '#64748b',
    },

    primaryBtn: {
        background: 'linear-gradient(to right,#f97316,#ea580c)',
        color: '#fff',
        border: 'none',
        padding: '10px 14px',
        borderRadius: 12,
        cursor: 'pointer',
        fontWeight: 700,
        transition: 'all 0.2s',
    },

    controlBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
    },

    tabs: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
    },

    tab: {
        padding: '8px 14px',
        borderRadius: 999,
        border: '1px solid #e2e8f0',
        background: '#fff',
        cursor: 'pointer',
        fontSize: 12,
        textTransform: 'capitalize',
        transition: 'all 0.2s',
    },

    tabActive: {
        background: '#f97316',
        color: '#fff',
        border: '1px solid #f97316',
    },

    search: {
        padding: '10px 14px',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        width: 240,
        outline: 'none',
        transition: 'all 0.2s',
    },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        gap: 18,
    },

    card: {
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },

    image: {
        width: '100%',
        height: 190,
        objectFit: 'cover',
    },

    body: {
        padding: 16,
    },

    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        gap: 10,
    },

    cardTitle: {
        margin: 0,
        fontSize: 16,
        fontWeight: 700,
        color: '#0f172a',
    },

    desc: {
        fontSize: 13,
        opacity: 0.7,
        marginTop: 10,
        lineHeight: 1.5,
        color: '#475569',
    },

    meta: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 14,
        fontSize: 12,
        opacity: 0.7,
        color: '#64748b',
    },

    status: {
        padding: '5px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'capitalize',
    },

    actionRow: {
        display: 'flex',
        gap: 8,
        marginTop: 16,
    },

    detailBtn: {
        flex: 1,
        background: '#3b82f6',
        color: '#fff',
        border: 'none',
        padding: '8px 6px',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 12,
        transition: 'all 0.2s',
    },

    editBtn: {
        flex: 1,
        background: '#f59e0b',
        color: '#fff',
        border: 'none',
        padding: '8px 6px',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 12,
        transition: 'all 0.2s',
    },

    deleteBtn: {
        flex: 1,
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        padding: '8px 6px',
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 12,
        transition: 'all 0.2s',
    },

    skeletonCard: {
        height: 320,
        borderRadius: 18,
        background: '#e2e8f0',
        animation: 'pulse 1.5s ease-in-out infinite',
    },

    empty: {
        textAlign: 'center',
        padding: 60,
        opacity: 0.6,
        color: '#64748b',
    },

    // Modal Styles (SAMA PERSIS DENGAN DETAIL LAPORAN)
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },

    modalContent: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    },

    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
    },

    modalTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#0f172a',
        margin: 0,
    },

    modalClose: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#64748b',
        padding: '4px 8px',
        borderRadius: '8px',
        transition: 'all 0.2s',
    },

    modalBody: {
        padding: '24px',
    },

    modalText: {
        marginBottom: '16px',
        color: '#475569',
        lineHeight: '1.5',
    },

    statusChangeInfo: {
        background: '#f8fafc',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
        textAlign: 'center',
    },

    statusBadge: {
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        margin: '0 4px',
    },

    arrow: {
        fontSize: '18px',
        margin: '0 10px',
        color: '#64748b',
    },

    statusSelect: {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        background: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        marginLeft: '8px',
        transition: 'all 0.2s',
    },

    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#334155',
        fontSize: '14px',
    },

    textarea: {
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        background: '#fff',
        color: '#0f172a',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'vertical',
        marginBottom: '16px',
        transition: 'all 0.2s',
    },

    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },

    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
    },

    checkboxLabel: {
        fontSize: '14px',
        color: '#334155',
        cursor: 'pointer',
        flex: 1,
    },

    checkboxNote: {
        fontSize: '11px',
        color: '#f97316',
        marginTop: '4px',
    },

    warningNote: {
        fontSize: '12px',
        color: '#ef4444',
        padding: '8px 12px',
        background: '#fef2f2',
        borderRadius: '8px',
        marginTop: '8px',
    },

    modalFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        padding: '20px 24px',
        borderTop: '1px solid #e2e8f0',
    },

    cancelButton: {
        padding: '10px 20px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#e2e8f0',
        color: '#475569',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s',
    },

    confirmButton: {
        padding: '10px 24px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#f59e0b',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s',
        ':disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
        },
    },
};

// Tambahkan keyframes untuk skeleton animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(styleSheet);