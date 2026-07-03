import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const DetailLaporan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [laporan, setLaporan] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState(false);
    
    // State untuk modal edit status
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusReason, setStatusReason] = useState('');
    const [addCommentToUser, setAddCommentToUser] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    const isSuperAdmin = user.role === 'super_admin';

    useEffect(() => {
        fetchDetail();
        fetchComments();
    }, [id]);

    const fetchDetail = async () => {
        try {
            const response = await API.get(`/laporan/${id}`);
            setLaporan(response.data);
        } catch (error) {
            console.error(error);
            setError('Gagal memuat detail laporan');
        }
    };

    const fetchComments = async () => {
        try {
            // Coba endpoint yang benar
            let response;
            try {
                response = await API.get(`/comments/laporan/${id}`);
            } catch (e) {
                // Coba endpoint alternatif
                response = await API.get(`/komentar/laporan/${id}`);
            }
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        setSubmitting(true);

        try {
            // Coba endpoint yang benar untuk post komentar
            try {
                await API.post('/comments', {
                    laporan_id: parseInt(id),
                    comment: newComment
                });
            } catch (e) {
                await API.post('/komentar', {
                    laporan_id: parseInt(id),
                    komentar: newComment
                });
            }

            setNewComment('');
            fetchComments();

        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Gagal menambahkan komentar');
        } finally {
            setSubmitting(false);
        }
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

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: {
                text: 'Menunggu',
                bg: '#fff7ed',
                color: '#ea580c',
                icon: '⏳'
            },
            approved: {
                text: 'Disetujui',
                bg: '#f0fdf4',
                color: '#16a34a',
                icon: '✅'
            },
            rejected: {
                text: 'Ditolak',
                bg: '#fef2f2',
                color: '#dc2626',
                icon: '❌'
            }
        };

        const s = statusMap[status] || {
            text: status,
            bg: '#f1f5f9',
            color: '#64748b',
            icon: '📝'
        };

        return {
            backgroundColor: s.bg,
            color: s.color,
            padding: '8px 20px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
        };
    };

    const openStatusModal = () => {
        setSelectedStatus(laporan.status);
        setStatusReason('');
        setAddCommentToUser(true);
        setShowStatusModal(true);
    };

    const handleUpdateStatus = async () => {
        if (!laporan || !selectedStatus) return;

        const oldStatus = laporan.status;
        
        if (oldStatus === selectedStatus) {
            setShowStatusModal(false);
            return;
        }

        setUpdatingStatus(true);

        try {
            // 1. Update status ke backend
            await API.put(`/laporan/${id}`, {
                status: selectedStatus
            });

            // 2. TAMBAHKAN KOMENTAR KE USER (jika dicentang)
            if (addCommentToUser) {
                let commentText = '';
                
                if (statusReason && statusReason.trim() !== '') {
                    commentText = `🔔 *ADMIN mengubah status laporan*\n\n` +
                        `Status: ${getStatusIcon(oldStatus)} ${getStatusText(oldStatus)} → ${getStatusIcon(selectedStatus)} ${getStatusText(selectedStatus)}\n\n` +
                        `📝 *Alasan Perubahan:*\n${statusReason}\n\n` +
                        `👤 Diubah oleh: ${user.name}\n` +
                        `🕐 Waktu: ${new Date().toLocaleString('id-ID')}`;
                } else {
                    commentText = `🔔 *ADMIN mengubah status laporan*\n\n` +
                        `Status: ${getStatusIcon(oldStatus)} ${getStatusText(oldStatus)} → ${getStatusIcon(selectedStatus)} ${getStatusText(selectedStatus)}\n\n` +
                        `👤 Diubah oleh: ${user.name}\n` +
                        `🕐 Waktu: ${new Date().toLocaleString('id-ID')}`;
                }
                
                // Coba kirim komentar ke endpoint yang benar
                let commentSent = false;
                
                // Try endpoint /comments
                try {
                    await API.post('/comments', {
                        laporan_id: parseInt(id),
                        comment: commentText,
                        user_name: 'System | Admin'
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
                            laporan_id: parseInt(id),
                            komentar: commentText,
                            user_name: 'System | Admin'
                        });
                        commentSent = true;
                        console.log('Komentar terkirim via /komentar');
                    } catch (e2) {
                        console.error('Gagal via kedua endpoint:', e2);
                    }
                }
                
                if (!commentSent) {
                    console.warn('Komentar tidak terkirim ke kedua endpoint');
                }
            }

            // 3. Refresh data
            await fetchDetail();
            await fetchComments();
            
            setShowStatusModal(false);
            
            let successMessage = `Status berhasil diubah dari ${getStatusText(oldStatus)} menjadi ${getStatusText(selectedStatus)}`;
            if (addCommentToUser && statusReason) {
                successMessage += `\n✅ Alasan telah dikirim ke komentar laporan`;
            } else if (addCommentToUser && !statusReason) {
                successMessage += `\n✅ Pemberitahuan perubahan status telah dikirim ke komentar`;
            }
            alert(successMessage);
            
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Gagal update status: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getCommentStyle = (comment) => {
        // Cek apakah komentar dari system/admin (perubahan status)
        const isSystemComment = comment.user_name === 'System | Admin' || 
                                comment.user_name?.includes('System') ||
                                comment.comment?.includes('ADMIN mengubah status') ||
                                comment.komentar?.includes('ADMIN mengubah status');
        
        if (isSystemComment) {
            return {
                background: '#fef3c7',
                borderLeft: `4px solid #f59e0b`,
                icon: '🔔'
            };
        }
        // Komentar dari user biasa
        return {
            background: '#f8f9fc',
            borderLeft: `4px solid #667eea`,
            icon: '💬'
        };
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                ⏳ Memuat data...
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.error}>
                ❌ {error}
            </div>
        );
    }

    if (!laporan) {
        return (
            <div style={styles.error}>
                📭 Laporan tidak ditemukan
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* TOPBAR */}
            <div style={styles.topbar}>
                <button
                    onClick={() => navigate(-1)}
                    style={styles.backButton}
                >
                    ← Kembali
                </button>

                <div style={styles.userBox}>
                    👤 {user.name} {isAdmin && '(Admin)'}
                </div>
            </div>

            {/* DETAIL CARD */}
            <div style={styles.card}>
                {/* IMAGE */}
                {laporan.image && (
                    <>
                        <img
                            src={`http://localhost:5000/uploads/${laporan.image}`}
                            alt="laporan"
                            style={styles.image}
                            onClick={() =>
                                setPreviewImage(
                                    `http://localhost:5000/uploads/${laporan.image}`
                                )
                            }
                        />

                        {/* FULLSCREEN PREVIEW */}
                        {previewImage && (
                            <div
                                style={styles.previewOverlay}
                                onClick={() => setPreviewImage(null)}
                            >
                                <img
                                    src={previewImage}
                                    alt="preview"
                                    style={styles.previewImage}
                                />
                                <button
                                    style={styles.closePreview}
                                    onClick={() => setPreviewImage(null)}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div style={styles.cardContent}>
                    <div style={styles.cardHeader}>
                        <h1 style={styles.title}>
                            {laporan.title}
                        </h1>
                        <span style={getStatusBadge(laporan.status)}>
                            {getStatusIcon(laporan.status)} {getStatusText(laporan.status)}
                        </span>
                    </div>

                    <div style={styles.info}>
                        <span>📂 {laporan.category_name}</span>
                        <span>📍 {laporan.location || 'Tidak tersedia'}</span>
                        <span>👤 {laporan.user_name}</span>
                        <span>
                            📅 {new Date(laporan.created_at).toLocaleDateString('id-ID')}
                        </span>
                    </div>

                    <div style={styles.descriptionBox}>
                        <h3 style={styles.sectionTitle}>
                            Deskripsi Laporan
                        </h3>
                        <p style={styles.description}>
                            {laporan.description}
                        </p>
                    </div>

                    {/* ADMIN ACTION - EDIT STATUS */}
                    {isAdmin && (
                        <div style={styles.adminBox}>
                            <h3 style={styles.sectionTitle}>
                                Admin Actions
                            </h3>
                            <div style={styles.statusButtons}>
                                <button
                                    onClick={openStatusModal}
                                    style={styles.editStatusButton}
                                    disabled={updatingStatus}
                                >
                                    ✏️ Ubah Status Laporan
                                </button>
                            </div>
                            <p style={styles.adminNote}>
                                💡 Status dapat diubah kapan saja (pending/approved/rejected)
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* COMMENT SECTION */}
            <div style={styles.commentSection}>
                <h2 style={styles.commentTitle}>
                    💬 Komentar ({comments.length})
                </h2>

                {/* FORM KOMENTAR */}
                <form onSubmit={handleSubmitComment} style={styles.commentForm}>
                    <textarea
                        placeholder="Tulis komentar atau tanggapan Anda..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={styles.commentInput}
                        rows="4"
                        required
                    />
                    <button
                        type="submit"
                        style={styles.submitButton}
                        disabled={submitting}
                    >
                        {submitting ? 'Mengirim...' : 'Kirim Komentar'}
                    </button>
                </form>

                {/* LIST KOMENTAR */}
                <div style={styles.commentList}>
                    {comments.length === 0 ? (
                        <div style={styles.emptyComment}>
                            💭 Belum ada komentar. Jadilah yang pertama!
                        </div>
                    ) : (
                        comments.map((comment) => {
                            const commentStyle = getCommentStyle(comment);
                            const commentText = comment.comment || comment.komentar || '';
                            const userName = comment.user_name || comment.nama_user || 'User';
                            const isSystemComment = userName === 'System | Admin' || 
                                                    commentText.includes('ADMIN mengubah status');
                            
                            return (
                                <div
                                    key={comment.id || comment._id}
                                    style={{
                                        ...styles.commentItem,
                                        background: commentStyle.background,
                                        borderLeft: commentStyle.borderLeft
                                    }}
                                >
                                    <div style={styles.commentHeader}>
                                        <strong>
                                            {commentStyle.icon} {userName}
                                            {isSystemComment && (
                                                <span style={styles.systemBadge}>System</span>
                                            )}
                                        </strong>
                                        <span style={styles.commentDate}>
                                            {new Date(comment.created_at || comment.tanggal).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p style={styles.commentText} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                                        {commentText}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* MODAL EDIT STATUS */}
            {showStatusModal && laporan && (
                <div style={styles.modalOverlay} onClick={() => setShowStatusModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Ubah Status Laporan</h3>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                style={styles.modalClose}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <p style={styles.modalText}>
                                <strong>{laporan.title}</strong>
                            </p>
                            
                            <div style={styles.statusChangeInfo}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                    <span style={{
                                        ...styles.statusBadge,
                                        backgroundColor: getStatusColor(laporan.status) + '20',
                                        color: getStatusColor(laporan.status)
                                    }}>
                                        {getStatusIcon(laporan.status)} {getStatusText(laporan.status)}
                                    </span>
                                    <span style={styles.arrow}>→</span>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
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
                                    value={statusReason}
                                    onChange={(e) => setStatusReason(e.target.value)}
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
                        </div>

                        <div style={styles.modalFooter}>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                style={styles.cancelButton}
                                disabled={updatingStatus}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                style={styles.confirmButton}
                                disabled={updatingStatus}
                            >
                                {updatingStatus ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f4f7fb',
        padding: '30px',
        fontFamily: 'Inter, sans-serif'
    },

    topbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        flexWrap: 'wrap',
        gap: '15px'
    },

    backButton: {
        border: 'none',
        background: 'linear-gradient(135deg,#667eea,#764ba2)',
        color: 'white',
        padding: '12px 22px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: '0.3s'
    },

    userBox: {
        background: 'white',
        padding: '12px 20px',
        borderRadius: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontWeight: '600'
    },

    card: {
        background: 'white',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        marginBottom: '30px'
    },

    image: {
        width: '100%',
        height: '450px',
        objectFit: 'cover',
        cursor: 'pointer',
        transition: '0.3s'
    },

    previewOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '20px',
        boxSizing: 'border-box',
        backdropFilter: 'blur(5px)'
    },

    previewImage: {
        maxWidth: '95%',
        maxHeight: '95%',
        borderRadius: '20px',
        objectFit: 'contain',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    },

    closePreview: {
        position: 'absolute',
        top: '25px',
        right: '25px',
        background: 'rgba(255,255,255,0.2)',
        border: 'none',
        color: 'white',
        fontSize: '28px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)'
    },

    cardContent: {
        padding: '35px'
    },

    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '20px'
    },

    title: {
        margin: 0,
        fontSize: '34px',
        color: '#222',
        fontWeight: '700'
    },

    info: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '30px',
        color: '#666',
        fontSize: '14px'
    },

    descriptionBox: {
        background: '#f8f9fc',
        padding: '28px',
        borderRadius: '18px',
        border: '1px solid #edf0f5'
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: '15px',
        fontSize: '20px',
        color: '#333'
    },

    description: {
        lineHeight: '1.9',
        color: '#555',
        fontSize: '15px'
    },

    adminBox: {
        marginTop: '35px',
        paddingTop: '25px',
        borderTop: '1px solid #eee'
    },

    statusButtons: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
    },

    editStatusButton: {
        background: 'linear-gradient(135deg,#f59e0b,#d97706)',
        color: 'white',
        border: 'none',
        padding: '13px 28px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: '0.3s'
    },

    adminNote: {
        fontSize: '12px',
        color: '#999',
        marginTop: '12px',
        marginBottom: 0
    },

    commentSection: {
        background: 'white',
        borderRadius: '24px',
        padding: '35px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
    },

    commentTitle: {
        marginTop: 0,
        marginBottom: '25px',
        fontSize: '26px',
        color: '#222'
    },

    commentForm: {
        marginBottom: '35px'
    },

    commentInput: {
        width: '100%',
        padding: '18px',
        borderRadius: '16px',
        border: '1px solid #ddd',
        resize: 'vertical',
        fontSize: '14px',
        marginBottom: '15px',
        boxSizing: 'border-box',
        outline: 'none',
        fontFamily: 'inherit'
    },

    submitButton: {
        background: 'linear-gradient(135deg,#667eea,#764ba2)',
        color: 'white',
        border: 'none',
        padding: '13px 28px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: '0.3s'
    },

    commentList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },

    commentItem: {
        borderRadius: '18px',
        padding: '20px',
        transition: '0.2s'
    },

    commentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '10px'
    },

    commentDate: {
        fontSize: '12px',
        color: '#999'
    },

    commentText: {
        margin: 0,
        color: '#555',
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap'
    },

    systemBadge: {
        background: '#f59e0b',
        color: 'white',
        fontSize: '10px',
        padding: '2px 8px',
        borderRadius: '12px',
        marginLeft: '8px'
    },

    emptyComment: {
        textAlign: 'center',
        padding: '35px',
        color: '#999',
        background: '#f8f9fc',
        borderRadius: '16px'
    },

    loading: {
        textAlign: 'center',
        padding: '100px',
        fontSize: '20px',
        color: '#555'
    },

    error: {
        textAlign: 'center',
        padding: '100px',
        color: '#dc3545',
        fontSize: '20px'
    },

    // Modal Styles
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
    },

    confirmButton: {
        padding: '10px 24px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#f59e0b',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '600',
    },
};

export default DetailLaporan;