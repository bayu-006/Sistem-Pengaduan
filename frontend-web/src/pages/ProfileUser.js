import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const UserProfile = () => {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    const [previewImage, setPreviewImage] =
        useState(null);

    const handleLogout = () => {
        const confirmLogout = window.confirm(
            'Apakah anda yakin ingin logout?'
        );

        if (confirmLogout) {
            localStorage.clear();
            navigate('/login');
        }
    };

    return (
        <div style={styles.wrapper}>
            <Sidebar
                user={user}
                activeMenu="profile"
                handleLogout={handleLogout}
            />

            <div style={styles.main}>
                {/* HEADER */}
                <div style={styles.headerCard}>
                    <div style={styles.headerOverlay}></div>

                    <div style={styles.profileSection}>
                        <div
                            style={styles.avatar}
                            onClick={() =>
                                setPreviewImage(true)
                            }
                        >
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <div>
                            <h1 style={styles.name}>
                                {user?.name ||
                                    'User'}
                            </h1>

                            <p style={styles.role}>
                                {user?.role?.replace(
                                    '_',
                                    ' '
                                ) || 'user'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* INFO CARD */}
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>
                            👤 Informasi Akun
                        </h2>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Nama Lengkap
                            </span>

                            <span style={styles.value}>
                                {user?.name || '-'}
                            </span>
                        </div>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Email
                            </span>

                            <span style={styles.value}>
                                {user?.email || '-'}
                            </span>
                        </div>

                        <div style={styles.infoBox}>
                            <span style={styles.label}>
                                Role
                            </span>

                            <span style={styles.roleBadge}>
                                {user?.role?.replace(
                                    '_',
                                    ' '
                                )}
                            </span>
                        </div>
                    </div>

                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>
                            ⚡ Aktivitas
                        </h2>

                        <div style={styles.statGrid}>
                            <div style={styles.statCard}>
                                <div
                                    style={
                                        styles.statNumber
                                    }
                                >
                                    12
                                </div>

                                <div
                                    style={styles.statText}
                                >
                                    Total Laporan
                                </div>
                            </div>

                            <div style={styles.statCard}>
                                <div
                                    style={
                                        styles.statNumber
                                    }
                                >
                                    5
                                </div>

                                <div
                                    style={styles.statText}
                                >
                                    Diproses
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION */}
                <div style={styles.actionCard}>
                    <button
                        style={styles.editBtn}
                    >
                        ✏️ Edit Profile
                    </button>

                    <button
                        style={styles.logoutBtn}
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* PREVIEW AVATAR */}
            {previewImage && (
                <div
                    style={styles.previewOverlay}
                    onClick={() =>
                        setPreviewImage(false)
                    }
                >
                    <div style={styles.previewAvatar}>
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;

const styles = {
    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        background:
            'linear-gradient(180deg,#f8fafc,#f1f5f9)',
        fontFamily: 'Inter, sans-serif',
    },

    main: {
        flex: 1,
        marginLeft: 260,
        padding: 28,
    },

    headerCard: {
        position: 'relative',
        background:
            'linear-gradient(135deg,#f97316,#ea580c)',
        borderRadius: 28,
        padding: '50px 40px',
        overflow: 'hidden',
        marginBottom: 24,
        boxShadow:
            '0 20px 40px rgba(249,115,22,0.25)',
    },

    headerOverlay: {
        position: 'absolute',
        inset: 0,
        background:
            'linear-gradient(to right,rgba(255,255,255,0.08),transparent)',
    },

    profileSection: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        zIndex: 2,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 42,
        fontWeight: 800,
        border: '4px solid rgba(255,255,255,0.3)',
        cursor: 'pointer',
    },

    name: {
        margin: 0,
        fontSize: 34,
        fontWeight: 800,
        color: '#fff',
    },

    role: {
        marginTop: 10,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: 600,
        textTransform: 'capitalize',
    },

    grid: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit,minmax(320px,1fr))',
        gap: 20,
    },

    card: {
        background: '#fff',
        borderRadius: 24,
        padding: 28,
        boxShadow:
            '0 10px 30px rgba(15,23,42,0.05)',
        border: '1px solid #e2e8f0',
    },

    cardTitle: {
        marginTop: 0,
        marginBottom: 24,
        fontSize: 22,
        fontWeight: 800,
        color: '#0f172a',
    },

    infoBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '16px 18px',
        background: '#f8fafc',
        borderRadius: 18,
        marginBottom: 16,
    },

    label: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: 600,
    },

    value: {
        fontSize: 16,
        color: '#0f172a',
        fontWeight: 700,
    },

    roleBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        padding: '8px 14px',
        borderRadius: 999,
        background: '#ffedd5',
        color: '#ea580c',
        fontWeight: 700,
        textTransform: 'capitalize',
    },

    statGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
    },

    statCard: {
        background:
            'linear-gradient(135deg,#fff7ed,#ffedd5)',
        padding: 24,
        borderRadius: 20,
        textAlign: 'center',
    },

    statNumber: {
        fontSize: 32,
        fontWeight: 800,
        color: '#ea580c',
    },

    statText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 600,
        color: '#9a3412',
    },

    actionCard: {
        marginTop: 24,
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
    },

    editBtn: {
        border: 'none',
        padding: '14px 22px',
        borderRadius: 16,
        background:
            'linear-gradient(135deg,#3b82f6,#2563eb)',
        color: '#fff',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow:
            '0 10px 25px rgba(59,130,246,0.25)',
    },

    logoutBtn: {
        border: 'none',
        padding: '14px 22px',
        borderRadius: 16,
        background:
            'linear-gradient(135deg,#ef4444,#dc2626)',
        color: '#fff',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow:
            '0 10px 25px rgba(239,68,68,0.25)',
    },

    previewOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        backdropFilter: 'blur(6px)',
    },

    previewAvatar: {
        width: 240,
        height: 240,
        borderRadius: '50%',
        background:
            'linear-gradient(135deg,#f97316,#ea580c)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 90,
        fontWeight: 800,
        border: '6px solid rgba(255,255,255,0.2)',
    },
};

