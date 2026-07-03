import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import SidebarAdmin from '../components/AdminSidebar';

const UserManagement = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] =
        useState(false);

    const [search, setSearch] =
        useState('');

    const [newAdmin, setNewAdmin] =
        useState({
            name: '',
            email: '',
            password: '',
        });

    const [error, setError] =
        useState('');

    const currentUser = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    useEffect(() => {
        if (
            currentUser.role !==
            'super_admin'
        ) {
            navigate('/dashboard');
            return;
        }

        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response =
                await API.get('/users');

            setUsers(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                ) ||
            user.email
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
    );

    const handleDeleteUser = async (
        id,
        name
    ) => {
        if (
            !window.confirm(
                `Yakin hapus user ${name}?`
            )
        )
            return;

        try {
            await API.delete(
                `/users/${id}`
            );

            fetchUsers();

            alert(
                'User berhasil dihapus'
            );
        } catch (error) {
            alert(
                'Gagal menghapus user'
            );
        }
    };

    const handleChangeRole =
        async (id, role) => {
            try {
                await API.put(
                    `/users/${id}/role`,
                    { role }
                );

                fetchUsers();

                alert(
                    'Role berhasil diubah'
                );
            } catch (error) {
                alert(
                    'Gagal mengubah role'
                );
            }
        };

    const handleCreateAdmin =
        async (e) => {
            e.preventDefault();

            setError('');

            try {
                await API.post(
                    '/users/admin',
                    newAdmin
                );

                setShowModal(false);

                setNewAdmin({
                    name: '',
                    email: '',
                    password: '',
                });

                fetchUsers();

                alert(
                    'Admin berhasil dibuat'
                );
            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                        'Gagal membuat admin'
                );
            }
        };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'super_admin':
                return {
                    text: 'Super Admin',
                    bg: '#fee2e2',
                    color: '#dc2626',
                };

            case 'admin':
                return {
                    text: 'Admin',
                    bg: '#fef3c7',
                    color: '#92400e',
                };

            default:
                return {
                    text: 'User',
                    bg: '#dbeafe',
                    color: '#1d4ed8',
                };
        }
    };

    return (
        <div style={styles.wrapper}>

            {/* SIDEBAR */}

            <SidebarAdmin
                user={currentUser}
                activeMenu="users"
                handleLogout={() => {
                    localStorage.clear();
                    navigate('/login');
                }}
            />

            {/* MAIN */}

            <div style={styles.main}>

                {/* HEADER */}

                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            👥 Manajemen User
                        </h1>

                        <p style={styles.subtitle}>
                            Kelola admin dan user
                            aplikasi
                        </p>
                    </div>

                    <div
                        style={
                            styles.headerActions
                        }
                    >
                        <input
                            type="text"
                            placeholder="Cari user..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            style={
                                styles.searchInput
                            }
                        />

                        <button
                            style={
                                styles.addBtn
                            }
                            onClick={() =>
                                setShowModal(
                                    true
                                )
                            }
                        >
                            + Admin Baru
                        </button>
                    </div>
                </div>

                {/* STATS */}

                <div style={styles.statsGrid}>

                    <div style={styles.statCard}>
                        <div
                            style={
                                styles.statNumber
                            }
                        >
                            {users.length}
                        </div>

                        <div
                            style={
                                styles.statLabel
                            }
                        >
                            Total User
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div
                            style={
                                styles.statNumber
                            }
                        >
                            {
                                users.filter(
                                    (u) =>
                                        u.role ===
                                        'admin'
                                ).length
                            }
                        </div>

                        <div
                            style={
                                styles.statLabel
                            }
                        >
                            Admin
                        </div>
                    </div>

                    <div style={styles.statCard}>
                        <div
                            style={
                                styles.statNumber
                            }
                        >
                            {
                                users.filter(
                                    (u) =>
                                        u.role ===
                                        'user'
                                ).length
                            }
                        </div>

                        <div
                            style={
                                styles.statLabel
                            }
                        >
                            User
                        </div>
                    </div>
                </div>

                {/* TABLE */}

                <div style={styles.tableWrapper}>

                    {loading ? (
                        <div
                            style={
                                styles.loading
                            }
                        >
                            ⏳ Loading...
                        </div>
                    ) : (
                        <table
                            style={styles.table}
                        >
                            <thead>
                                <tr>
                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        User
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Email
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Role
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Tanggal
                                    </th>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredUsers.map(
                                    (
                                        user
                                    ) => {
                                        const badge =
                                            getRoleBadge(
                                                user.role
                                            );

                                        return (
                                            <tr
                                                key={user.id}
                                                style={{
                                                    transition: '0.2s',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background =
                                                        '#fff7ed';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background =
                                                        '#fff';
                                                }}
>
                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    <div
                                                        style={
                                                            styles.userBox
                                                        }
                                                    >
                                                        <div
                                                            style={
                                                                styles.avatar
                                                            }
                                                        >
                                                            {user.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <div
                                                                style={
                                                                    styles.userName
                                                                }
                                                            >
                                                                {
                                                                    user.name
                                                                }
                                                            </div>

                                                            <div
                                                                style={
                                                                    styles.userId
                                                                }
                                                            >
                                                                ID: {
                                                                    user.id
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {
                                                        user.email
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    <span
                                                        style={{
                                                            background:
                                                                badge.bg,

                                                            color:
                                                                badge.color,

                                                            padding:
                                                                '6px 12px',

                                                            borderRadius:
                                                                '999px',

                                                            fontSize:
                                                                '12px',

                                                            fontWeight:
                                                                '700',
                                                        }}
                                                    >
                                                        {
                                                            badge.text
                                                        }
                                                    </span>
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString(
                                                        'id-ID'
                                                    )}
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {user.role !==
                                                    'super_admin' ? (
                                                        <div
                                                            style={
                                                                styles.actionBox
                                                            }
                                                        >
                                                            <select
                                                                value={
                                                                    user.role
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleChangeRole(
                                                                        user.id,
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                style={
                                                                    styles.select
                                                                }
                                                            >
                                                                <option value="user">
                                                                    User
                                                                </option>

                                                                <option value="admin">
                                                                    Admin
                                                                </option>
                                                            </select>

                                                            {user.id !==
                                                                currentUser.id && (
                                                                <button
                                                                    style={
                                                                        styles.deleteBtn
                                                                    }
                                                                    onClick={() =>
                                                                        handleDeleteUser(
                                                                            user.id,
                                                                            user.name
                                                                        )
                                                                    }
                                                                >
                                                                    Hapus
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span
                                                            style={
                                                                styles.superBadge
                                                            }
                                                        >
                                                            🔒
                                                            Protected
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* MODAL */}

            {showModal && (
                <div
                    style={
                        styles.modalOverlay
                    }
                    onClick={() =>
                        setShowModal(false)
                    }
                >
                    <div
                        style={styles.modal}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <h2
                            style={
                                styles.modalTitle
                            }
                        >
                            Buat Admin Baru
                        </h2>

                        {error && (
                            <div
                                style={
                                    styles.error
                                }
                            >
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={
                                handleCreateAdmin
                            }
                        >
                            <input
                                type="text"
                                placeholder="Nama"
                                required
                                value={
                                    newAdmin.name
                                }
                                onChange={(e) =>
                                    setNewAdmin({
                                        ...newAdmin,
                                        name:
                                            e
                                                .target
                                                .value,
                                    })
                                }
                                style={
                                    styles.input
                                }
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={
                                    newAdmin.email
                                }
                                onChange={(e) =>
                                    setNewAdmin({
                                        ...newAdmin,
                                        email:
                                            e
                                                .target
                                                .value,
                                    })
                                }
                                style={
                                    styles.input
                                }
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={
                                    newAdmin.password
                                }
                                onChange={(e) =>
                                    setNewAdmin({
                                        ...newAdmin,
                                        password:
                                            e
                                                .target
                                                .value,
                                    })
                                }
                                style={
                                    styles.input
                                }
                            />

                            <div
                                style={
                                    styles.modalButtons
                                }
                            >
                                <button
                                    type="button"
                                    style={
                                        styles.cancelBtn
                                    }
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    style={
                                        styles.saveBtn
                                    }
                                >
                                    Buat Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

/* ================= STYLES ================= */

/* ================= STYLES ================= */

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

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
        flexWrap: 'wrap',
        gap: 20,
        background: '#fff',
        padding: '24px 28px',
        borderRadius: 24,
        boxShadow:
            '0 10px 30px rgba(15,23,42,0.06)',
        border: '1px solid #e2e8f0',
    },

    title: {
        margin: 0,
        fontSize: 32,
        fontWeight: 800,
        background:
            'linear-gradient(135deg,#f97316,#ea580c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px',
    },

    subtitle: {
        marginTop: 8,
        color: '#64748b',
        fontSize: 15,
        fontWeight: 500,
    },

    headerActions: {
        display: 'flex',
        gap: 14,
        flexWrap: 'wrap',
        alignItems: 'center',
    },

    searchInput: {
        padding: '13px 18px',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        outline: 'none',
        width: 260,
        background: '#f8fafc',
        fontSize: 14,
        transition: '0.2s',
        boxShadow:
            'inset 0 2px 4px rgba(0,0,0,0.03)',
    },

    addBtn: {
        background:
            'linear-gradient(135deg,#f97316,#ea580c)',
        color: '#fff',
        border: 'none',
        padding: '13px 20px',
        borderRadius: 16,
        fontWeight: 700,
        cursor: 'pointer',
        fontSize: 14,
        boxShadow:
            '0 8px 20px rgba(249,115,22,0.35)',
        transition: '0.2s',
    },

    statsGrid: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit,minmax(240px,1fr))',
        gap: 20,
        marginBottom: 28,
    },

    statCard: {
        background: '#fff',
        padding: 24,
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow:
            '0 10px 30px rgba(15,23,42,0.05)',
    },

    statNumber: {
        fontSize: 38,
        fontWeight: 800,
        color: '#0f172a',
        marginBottom: 8,
    },

    statLabel: {
        color: '#64748b',
        fontSize: 15,
        fontWeight: 600,
    },

    tableWrapper: {
        background: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow:
            '0 10px 30px rgba(15,23,42,0.05)',
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: 950,
    },

    th: {
        textAlign: 'left',
        padding: '20px 22px',
        background: '#f8fafc',
        fontSize: 13,
        color: '#64748b',
        fontWeight: 700,
        borderBottom: '1px solid #e2e8f0',
        letterSpacing: '0.3px',
    },

    td: {
        padding: '20px 22px',
        borderTop: '1px solid #f1f5f9',
        fontSize: 14,
        color: '#0f172a',
    },

    userBox: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: '18px',
        background:
            'linear-gradient(135deg,#fb923c,#ea580c)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 18,
        boxShadow:
            '0 6px 18px rgba(249,115,22,0.3)',
    },

    userName: {
        fontWeight: 700,
        fontSize: 15,
        marginBottom: 4,
    },

    userId: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: 500,
    },

    actionBox: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
    },

    select: {
        padding: '10px 14px',
        borderRadius: 12,
        border: '1px solid #dbeafe',
        background: '#f8fafc',
        fontWeight: 600,
        outline: 'none',
        cursor: 'pointer',
    },

    deleteBtn: {
        background:
            'linear-gradient(135deg,#ef4444,#dc2626)',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: 12,
        cursor: 'pointer',
        fontWeight: 700,
        boxShadow:
            '0 6px 16px rgba(239,68,68,0.25)',
    },

    superBadge: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: 700,
        background: '#f1f5f9',
        padding: '8px 14px',
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
    },

    loading: {
        padding: 60,
        textAlign: 'center',
        fontWeight: 700,
        color: '#64748b',
    },

    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background:
            'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        padding: 20,
    },

    modal: {
        background: '#fff',
        padding: 28,
        borderRadius: 28,
        width: '100%',
        maxWidth: 460,
        boxShadow:
            '0 25px 60px rgba(0,0,0,0.18)',
        animation: 'fadeIn 0.2s ease',
    },

    modalTitle: {
        marginTop: 0,
        marginBottom: 22,
        fontSize: 24,
        fontWeight: 800,
        color: '#0f172a',
    },

    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        marginBottom: 16,
        boxSizing: 'border-box',
        background: '#f8fafc',
        outline: 'none',
        fontSize: 14,
    },

    modalButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 14,
    },

    cancelBtn: {
        padding: '12px 18px',
        borderRadius: 14,
        border: 'none',
        background: '#e2e8f0',
        color: '#334155',
        cursor: 'pointer',
        fontWeight: 700,
    },

    saveBtn: {
        padding: '12px 18px',
        borderRadius: 14,
        border: 'none',
        background:
            'linear-gradient(135deg,#f97316,#ea580c)',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 700,
        boxShadow:
            '0 8px 20px rgba(249,115,22,0.3)',
    },

    error: {
        background: '#fee2e2',
        color: '#dc2626',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 14,
        fontWeight: 600,
    },
};