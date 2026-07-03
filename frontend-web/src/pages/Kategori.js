import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import SidebarAdmin from '../components/AdminSidebar';

const Kategori = () => {
  const navigate = useNavigate();

  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁'
  });
  
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  const iconOptions = [
    '📁', '📝', '🚗', '🏠', '🏫', '🏥', '🍽️', '🛒', '💻', '📱',
    '🔧', '💡', '🌳', '🐶', '🚮', '🚰', '🔊', '🚬', '🥤', '🗑️'
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchKategori();
  }, [navigate]);

  const fetchKategori = async () => {
    try {
      const response = await API.get('/kategori');
      setKategori(response.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    window.dispatchEvent(new Event('storage'));
  };

  const openAddModal = () => {
    if (!isSuperAdmin) {
      alert('Hanya Super Admin yang dapat menambah kategori');
      return;
    }

    setModalMode('add');
    setSelectedKategori(null);
    setFormData({
      name: '',
      description: '',
      icon: '📁'
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    if (!isSuperAdmin) {
      alert('Hanya Super Admin yang dapat mengedit kategori');
      return;
    }

    setModalMode('edit');
    setSelectedKategori(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      icon: item.icon || '📁'
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isSuperAdmin) {
      alert('Aksi dibatasi: hanya Super Admin yang dapat menyimpan kategori.');
      return;
    }
    if (!formData.name.trim()) {
      alert('⚠️ Nama kategori harus diisi!');
      return;
    }

    try {
      if (modalMode === 'add') {
        await API.post('/kategori', {
          name: formData.name,
          description: formData.description,
          icon: formData.icon
        });
        alert('✅ Kategori berhasil ditambahkan');
      } else {
        await API.put(`/kategori/${selectedKategori.id}`, {
          name: formData.name,
          description: formData.description,
          icon: formData.icon
        });
        alert('✅ Kategori berhasil diupdate');
      }
      
      setShowModal(false);
      fetchKategori();
    } catch (error) {
      console.error(error);
      alert('❌ Gagal menyimpan kategori: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!isSuperAdmin) {
      alert('Aksi dibatasi: hanya Super Admin yang dapat menghapus kategori.');
      return;
    }
    if (window.confirm(`⚠️ Yakin ingin menghapus kategori "${name}"?\n\nData laporan dengan kategori ini akan tetap ada.`)) {
      try {
        await API.delete(`/kategori/${id}`);
        alert('✅ Kategori berhasil dihapus');
        fetchKategori();
      } catch (error) {
        alert('❌ Gagal menghapus kategori');
      }
    }
  };

  const filteredKategori = kategori.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      fontFamily: "'Inter', sans-serif",
    },
    main: {
      flex: 1,
      marginLeft: isMobile ? '0' : '280px',
      width: isMobile ? '100%' : 'calc(100% - 280px)',
      padding: isMobile ? '16px' : '24px',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    },
    header: {
      background: isDarkMode ? '#1e293b' : '#fff',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      padding: isMobile ? '16px' : '20px',
      borderRadius: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '24px',
    },
    title: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '800',
      color: isDarkMode ? '#fff' : '#0f172a',
      margin: 0,
    },
    subtitle: {
      fontSize: '13px',
      marginTop: '6px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },
    userBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    userAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg,#f97316,#ea580c)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: '700',
      fontSize: '18px',
      flexShrink: 0,
    },
    userName: {
      fontWeight: '700',
      fontSize: '15px',
      color: isDarkMode ? '#fff' : '#0f172a',
    },
    userRole: {
      fontSize: '12px',
      color: '#f97316',
    },
    button: {
      padding: '10px 14px',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
    },
    contentWrapper: {
      background: isDarkMode ? '#1e293b' : '#fff',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      borderRadius: '20px',
      overflow: 'hidden',
    },
    contentHeader: {
      padding: '16px 20px',
      borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    },
    contentTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: isDarkMode ? '#fff' : '#0f172a',
      margin: 0,
    },
    searchInput: {
      padding: '8px 14px',
      borderRadius: '12px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#0f172a',
      fontSize: '14px',
      width: isMobile ? '100%' : '250px',
    },
    addButton: {
      background: '#f97316',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    tableScrollContainer: {
      overflowX: 'auto',
      maxHeight: 'calc(100vh - 300px)',
      WebkitOverflowScrolling: 'touch',
    },
    table: {
      width: '100%',
      minWidth: '600px',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '14px 16px',
      textAlign: 'left',
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      fontSize: '13px',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    td: {
      padding: '14px 16px',
      borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9',
      color: isDarkMode ? '#cbd5e1' : '#475569',
      fontSize: '13px',
      verticalAlign: 'middle',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
    },
    editBtn: {
      background: '#3b82f6',
      color: '#fff',
      border: 'none',
      padding: '6px 14px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px',
    },
    deleteBtn: {
      background: '#ef4444',
      color: '#fff',
      border: 'none',
      padding: '6px 14px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px',
    },
    iconDisplay: {
      fontSize: '28px',
      display: 'inline-block',
    },
    loading: {
      padding: '40px',
      textAlign: 'center',
    },
    noData: {
      padding: '40px',
      textAlign: 'center',
    },
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
      padding: '16px',
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
      borderRadius: '20px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: isDarkMode ? '#fff' : '#0f172a',
      margin: 0,
    },
    modalClose: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      padding: '4px 8px',
      borderRadius: '8px',
    },
    modalBody: {
      padding: '20px 24px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: isDarkMode ? '#e2e8f0' : '#334155',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#0f172a',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#0f172a',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    iconSelector: {
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 1fr)',
      gap: '8px',
      marginTop: '8px',
    },
    iconOption: {
      background: isDarkMode ? '#0f172a' : '#f1f5f9',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      fontSize: '20px',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.2s',
    },
    iconOptionSelected: {
      background: '#f97316',
      transform: 'scale(1.05)',
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '20px 24px',
      borderTop: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    },
    cancelButton: {
      padding: '10px 20px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
      color: isDarkMode ? '#fff' : '#475569',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
    },
    submitButton: {
      padding: '10px 24px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#f97316',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
    },
    filterGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
  };

  return (
    <div style={styles.page}>
      <SidebarAdmin
        user={user}
        activeMenu="kategori"
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
      />

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>🗂️ Manajemen Kategori</h1>
            <p style={styles.subtitle}>Kelola kategori laporan pengaduan masyarakat</p>
          </div>

          <div style={styles.userBox}>
            <button
              style={{
                ...styles.button,
                background: isDarkMode ? '#334155' : '#e2e8f0',
              }}
              onClick={toggleTheme}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            <div style={styles.userAvatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.userRole}>{user.role?.replace('_', ' ')}</div>
            </div>
          </div>
        </div>

        <div style={styles.contentWrapper}>
          <div style={styles.contentHeader}>
            <h3 style={styles.contentTitle}>📋 Daftar Kategori</h3>

            <div style={styles.filterGroup}>
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />

              {isSuperAdmin && (
                <button
                  style={styles.addButton}
                  onClick={openAddModal}
                >
                  + Tambah Kategori
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div style={styles.loading}>⏳ Loading...</div>
          ) : filteredKategori.length === 0 ? (
            <div style={styles.noData}>
              📭 Tidak ada kategori
              <br />
              {isSuperAdmin && (
                <button
                  onClick={openAddModal}
                  style={{
                    ...styles.addButton,
                    marginTop: '16px',
                    display: 'inline-flex'
                  }}
                >
                  + Tambah Kategori Sekarang
                </button>
              )}
            </div>
          ) : (
            <div style={styles.tableScrollContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Icon</th>
                    <th style={styles.th}>Nama Kategori</th>
                    <th style={styles.th}>Deskripsi</th>
                    <th style={styles.th}>Total Laporan</th>
                    <th style={styles.th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKategori.map((item) => (
                    <tr key={item.id}>
                      <td style={styles.td}>
                        <span style={styles.iconDisplay}>{item.icon || '📁'}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                      </td>
                      <td style={styles.td}>
                        {item.description || '-'}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          background: isDarkMode ? '#f9731620' : '#fff7ed',
                          color: '#f97316',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {item.laporan_count || 0} laporan
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          {isSuperAdmin ? (
                            <>
                              <button
                                style={styles.editBtn}
                                onClick={() => openEditModal(item)}
                              >
                                Edit
                              </button>

                              <button
                                style={styles.deleteBtn}
                                onClick={() => handleDelete(item.id, item.name)}
                              >
                                Hapus
                              </button>
                            </>
                          ) : (
                            <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>Hanya melihat</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {modalMode === 'add' ? '➕ Tambah Kategori Baru' : '✏️ Edit Kategori'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={styles.modalClose}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Icon Kategori</label>
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '48px' }}>{formData.icon}</span>
                </div>
                <div style={styles.iconSelector}>
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      style={{
                        ...styles.iconOption,
                        ...(formData.icon === icon ? styles.iconOptionSelected : {}),
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Nama Kategori <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Infrastruktur, Kesehatan, Pendidikan..."
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Deskripsi (Opsional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsikan kategori ini..."
                  rows="3"
                  style={styles.textarea}
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowModal(false)}
                style={styles.cancelButton}
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                style={styles.submitButton}
              >
                {modalMode === 'add' ? 'Tambah Kategori' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kategori;