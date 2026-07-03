import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import SidebarAdmin from '../components/AdminSidebar';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();

  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusHistory, setStatusHistory] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [reason, setReason] = useState('');
  const [addCommentToUser, setAddCommentToUser] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );

  const isSuperAdmin = user.role === 'super_admin';
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  // Handle window resize
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

    fetchLaporan();
    loadHistoryFromLocal();
  }, [navigate]);

  const fetchLaporan = async () => {
    try {
      const response = await API.get('/laporan');
      setLaporan(response.data);
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

  const loadHistoryFromLocal = () => {
    const savedHistory = localStorage.getItem('statusHistory');
    if (savedHistory) {
      setStatusHistory(JSON.parse(savedHistory));
    }
  };

  const saveHistoryToLocal = (history) => {
    localStorage.setItem('statusHistory', JSON.stringify(history));
  };

  const filteredLaporan = laporan.filter((item) => {
    const matchSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'all' ? true : item.status === filterStatus;

    return matchSearch && matchStatus;
  });

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

  const handleDelete = async (id, title) => {
    if (window.confirm(`⚠️ Yakin ingin menghapus laporan "${title}"?`)) {
      try {
        await API.delete(`/laporan/${id}`);
        fetchLaporan();
        alert('✅ Laporan berhasil dihapus');
      } catch (error) {
        alert('❌ Gagal menghapus laporan');
      }
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f97316';
      case 'approved': return '#22c55e';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
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

  const openConfirmModal = (laporan, statusBaru) => {
    setSelectedLaporan(laporan);
    setNewStatus(statusBaru);
    setReason('');
    setAddCommentToUser(true);
    setShowConfirmModal(true);
  };

  const handleStatusChange = async () => {
    if (!selectedLaporan || !newStatus) return;

    const oldStatus = selectedLaporan.status;
    
    if (oldStatus === newStatus) {
      setShowConfirmModal(false);
      return;
    }

    const confirmed = window.confirm(
      `⚠️ Ubah status dari "${getStatusText(oldStatus)}" ` +
      `menjadi "${getStatusText(newStatus)}"?`
    );
    if (!confirmed) return;

    setUpdatingId(selectedLaporan.id);

    try {
      await API.put(`/laporan/${selectedLaporan.id}`, {
        status: newStatus
      });

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
        
        let commentSent = false;
        
        try {
          await API.post('/comments', {
            laporan_id: selectedLaporan.id,
            comment: commentText
          });
          commentSent = true;
        } catch (e1) {
          console.log('Gagal via /comments, mencoba /komentar');
        }
        
        if (!commentSent) {
          try {
            await API.post('/komentar', {
              laporan_id: selectedLaporan.id,
              komentar: commentText
            });
            commentSent = true;
          } catch (e2) {
            console.error('Gagal via kedua endpoint:', e2);
          }
        }
      }

      const historyEntry = {
        id: selectedLaporan.id,
        title: selectedLaporan.title,
        from: oldStatus,
        to: newStatus,
        fromText: getStatusText(oldStatus),
        toText: getStatusText(newStatus),
        reason: reason || 'Tidak ada alasan',
        changed_by: user.name,
        changed_at: new Date().toLocaleString('id-ID'),
        comment_added: addCommentToUser,
        timestamp: Date.now()
      };

      const updatedHistory = { ...statusHistory };
      if (!updatedHistory[selectedLaporan.id]) {
        updatedHistory[selectedLaporan.id] = [];
      }
      updatedHistory[selectedLaporan.id].unshift(historyEntry);
      
      if (updatedHistory[selectedLaporan.id].length > 10) {
        updatedHistory[selectedLaporan.id] = updatedHistory[selectedLaporan.id].slice(0, 10);
      }
      
      setStatusHistory(updatedHistory);
      saveHistoryToLocal(updatedHistory);

      setLaporan(prevLaporan =>
        prevLaporan.map(laporan =>
          laporan.id === selectedLaporan.id 
            ? { ...laporan, status: newStatus } 
            : laporan
        )
      );

      setShowConfirmModal(false);
      setReason('');
      
      let successMessage = `✅ Status berhasil diubah dari ${getStatusText(oldStatus)} menjadi ${getStatusText(newStatus)}`;
      if (addCommentToUser && reason) {
        successMessage += `\n📝 Alasan telah dikirim ke komentar laporan`;
      } else if (addCommentToUser && !reason) {
        successMessage += `\n📢 Pemberitahuan perubahan telah dikirim ke komentar`;
      }
      alert(successMessage);
      
      fetchLaporan();
      
    } catch (error) {
      console.error('Error updating status:', error);
      alert('❌ Gagal update status: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: laporan.length,
    pending: laporan.filter((l) => l.status === 'pending').length,
    approved: laporan.filter((l) => l.status === 'approved').length,
    rejected: laporan.filter((l) => l.status === 'rejected').length,
  };

  const chartData = [
    { name: 'Pending', total: stats.pending },
    { name: 'Disetujui', total: stats.approved },
    { name: 'Ditolak', total: stats.rejected },
  ];

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#f97316' },
    { name: 'Disetujui', value: stats.approved, color: '#22c55e' },
    { name: 'Ditolak', value: stats.rejected, color: '#ef4444' },
  ];

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      fontFamily: "'Inter', sans-serif",
    },

    main: {
      flex: 1,
      marginLeft: isMobile ? '0' : '255px',
      width: isMobile ? '100%' : 'calc(100% - 255px)',
      padding: isMobile ? '20px 28px 28px 40px' : '28px 40px',
      overflowX: 'hidden',
      boxSizing: 'border-box',
    },

    header: {
      background: isDarkMode ? '#1e293b' : '#fff',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      padding: isMobile ? '16px' : '20px',
      borderRadius: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '28px',
    },

    title: {
      fontSize: isMobile ? '20px' : '26px',
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
      width: '44px',
      height: '44px',
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
      padding: '8px 14px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
    },

    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },

    statCard: {
      background: isDarkMode ? '#1e293b' : '#fff',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '20px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
      }
    },

    statIcon: {
      fontSize: '28px',
      marginBottom: '12px',
    },

    statValue: {
      fontSize: '28px',
      fontWeight: '800',
      color: isDarkMode ? '#fff' : '#0f172a',
      marginBottom: '6px',
    },

    statLabel: {
      fontSize: '13px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      fontWeight: '500',
    },

    // Separator between sections
    separator: {
      height: '1px',
      background: isDarkMode ? '#334155' : '#e2e8f0',
      margin: '24px 0 28px 0',
    },

    chartSection: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '28px',
      marginBottom: '36px',
    },

    chartCard: {
      background: isDarkMode ? '#1e293b' : '#fff',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '24px',
      transition: 'box-shadow 0.2s',
    },

    chartTitle: {
      fontWeight: '700',
      marginBottom: '20px',
      fontSize: '16px',
      color: isDarkMode ? '#fff' : '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },

    chartBox: {
      height: '260px',
      width: '100%',
    },

    tableWrapper: {
      background: isDarkMode ? '#1e293b' : '#fff',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      borderRadius: '20px',
      overflow: 'hidden',
      marginTop: '8px',
    },

    tableHeader: {
      padding: '18px 20px',
      borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '14px',
    },

    tableTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: isDarkMode ? '#fff' : '#0f172a',
      margin: 0,
    },

    searchInput: {
      padding: '10px 14px',
      borderRadius: '12px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#0f172a',
      fontSize: '13px',
      width: isMobile ? '100%' : '220px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },

    filterSelect: {
      padding: '10px 14px',
      borderRadius: '12px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#0f172a',
      fontSize: '13px',
      cursor: 'pointer',
      outline: 'none',
    },

    tableScrollContainer: {
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: '65vh',
      WebkitOverflowScrolling: 'touch',
    },

    table: {
      width: '100%',
      minWidth: '800px',
      borderCollapse: 'collapse',
    },

    th: {
      padding: '14px 16px',
      textAlign: 'left',
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      fontSize: '12px',
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
      flexWrap: 'wrap',
    },

    detailBtn: {
      background: '#3b82f6',
      color: '#fff',
      border: 'none',
      padding: '6px 14px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px',
      transition: 'opacity 0.2s',
      ':hover': {
        opacity: 0.9,
      }
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
      transition: 'opacity 0.2s',
      ':hover': {
        opacity: 0.9,
      }
    },

    statusSelect: {
      padding: '6px 12px',
      borderRadius: '8px',
      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#0f172a',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
    },

    loading: {
      padding: '60px',
      textAlign: 'center',
      fontSize: '16px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },

    noData: {
      padding: '60px',
      textAlign: 'center',
      fontSize: '16px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },

    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(4px)',
    },

    modalContent: {
      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
      borderRadius: '20px',
      width: '100%',
      maxWidth: '480px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
      fontSize: '22px',
      cursor: 'pointer',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      padding: '4px 8px',
      borderRadius: '8px',
      transition: 'background 0.2s',
      ':hover': {
        background: isDarkMode ? '#334155' : '#f1f5f9',
      }
    },

    modalBody: {
      padding: '20px 24px',
    },

    modalText: {
      marginBottom: '16px',
      color: isDarkMode ? '#cbd5e1' : '#475569',
      fontSize: '14px',
    },

    statusChangeInfo: {
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '20px',
      textAlign: 'center',
    },

    oldStatus: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
    },

    arrow: {
      fontSize: '16px',
      margin: '0 10px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
    },

    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: isDarkMode ? '#e2e8f0' : '#334155',
      fontSize: '13px',
    },

    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#0f172a',
      fontSize: '13px',
      fontFamily: 'inherit',
      resize: 'vertical',
      marginBottom: '16px',
      boxSizing: 'border-box',
      outline: 'none',
    },

    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      marginBottom: '16px',
      padding: '12px',
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      borderRadius: '12px',
      cursor: 'pointer',
    },

    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      marginTop: '2px',
    },

    checkboxLabel: {
      fontSize: '14px',
      color: isDarkMode ? '#e2e8f0' : '#334155',
      cursor: 'pointer',
      fontWeight: '500',
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
      background: isDarkMode ? '#450a0a' : '#fef2f2',
      borderRadius: '10px',
      marginTop: '8px',
    },

    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '16px 24px',
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
      fontSize: '13px',
      transition: 'opacity 0.2s',
      ':hover': {
        opacity: 0.9,
      }
    },

    confirmButton: {
      padding: '10px 24px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#f59e0b',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      transition: 'opacity 0.2s',
      ':hover': {
        opacity: 0.9,
      }
    },

    historyBadge: {
      fontSize: '10px',
      color: '#94a3b8',
      marginTop: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },

    updatingText: {
      marginLeft: '8px',
      fontSize: '11px',
      color: '#f97316',
    },
    
    filterGroup: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    
    imagePreview: {
      width: '48px',
      height: '48px',
      borderRadius: '10px',
      objectFit: 'cover',
      flexShrink: 0,
    },
    
    titleCell: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
  };

  return (
    <div style={styles.page}>
      <SidebarAdmin
        user={user}
        activeMenu="dashboard"
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
      />

      <main style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard Admin</h1>
            <p style={styles.subtitle}>Selamat datang kembali, {user.name} 👋</p>
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

        {/* Statistik Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total Laporan</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statValue}>{stats.pending}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statValue}>{stats.approved}</div>
            <div style={styles.statLabel}>Disetujui</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>❌</div>
            <div style={styles.statValue}>{stats.rejected}</div>
            <div style={styles.statLabel}>Ditolak</div>
          </div>
        </div>

        {/* Visual Separator */}
        <div style={styles.separator} />

        {/* Charts Section */}
        <div style={styles.chartSection}>
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>
              <span>📈</span> Statistik Status
            </div>
            <div style={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: isDarkMode ? '#94a3b8' : '#64748b' }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#fff' : '#0f172a'
                    }}
                  />
                  <Bar dataKey="total" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>
              <span>🥧</span> Distribusi Status
            </div>
            <div style={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                      borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                      color: isDarkMode ? '#fff' : '#0f172a'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabel Laporan */}
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>📋 Daftar Laporan</h3>

            <div style={styles.filterGroup}>
              <input
                type="text"
                placeholder="🔍 Cari laporan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">📋 Semua Status</option>
                <option value="pending">⏳ Menunggu</option>
                <option value="approved">✅ Disetujui</option>
                <option value="rejected">❌ Ditolak</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={styles.loading}>
              <div>⏳ Memuat data...</div>
            </div>
          ) : filteredLaporan.length === 0 ? (
            <div style={styles.noData}>
              <div>📭 Tidak ada laporan yang ditemukan</div>
            </div>
          ) : (
            <div style={styles.tableScrollContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Laporan</th>
                    <th style={styles.th}>Kategori</th>
                    <th style={styles.th}>Lokasi</th>
                    <th style={styles.th}>Pelapor</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Tanggal</th>
                    <th style={styles.th}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLaporan.map((item) => (
                    <tr key={item.id}>
                      <td style={styles.td}>
                        <div style={styles.titleCell}>
                          <img
                            src={
                              item.image
                                ? `http://localhost:5000/uploads/${item.image}`
                                : 'https://via.placeholder.com/48'
                            }
                            alt="laporan"
                            style={styles.imagePreview}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.title}</div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                              ID: {item.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>{item.category_name}</td>
                      <td style={styles.td}>{item.location || '-'}</td>
                      <td style={styles.td}>{item.user_name}</td>
                      <td style={styles.td}>
                        <div>
                          <select
                            value={item.status}
                            onChange={(e) => openConfirmModal(item, e.target.value)}
                            style={styles.statusSelect}
                            disabled={updatingId === item.id}
                          >
                            <option value="pending">⏳ Menunggu</option>
                            <option value="approved">✅ Disetujui</option>
                            <option value="rejected">❌ Ditolak</option>
                          </select>
                          {updatingId === item.id && (
                            <span style={styles.updatingText}>Menyimpan...</span>
                          )}
                          {statusHistory[item.id] && statusHistory[item.id].length > 0 && (
                            <div 
                              style={styles.historyBadge}
                              title={`Terakhir diubah oleh ${statusHistory[item.id][0]?.changed_by || '-'}\nAlasan: ${statusHistory[item.id][0]?.reason || '-'}`}
                            >
                              <span>🔄</span> {statusHistory[item.id].length}x perubahan
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={styles.detailBtn}
                            onClick={() => navigate(`/laporan/${item.id}`)}
                          >
                            Detail
                          </button>

                          {isSuperAdmin && (
                            <button
                              style={styles.deleteBtn}
                              onClick={() => handleDelete(item.id, item.title)}
                            >
                              Hapus
                            </button>
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

      {/* Modal Konfirmasi */}
      {showConfirmModal && selectedLaporan && (
        <div style={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>✏️ Ubah Status Laporan</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    ...styles.oldStatus,
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
                  📝 Alasan Perubahan <span style={{ fontSize: '11px', color: '#94a3b8' }}>(opsional)</span>:
                </label>
                <textarea
                  rows="3"
                  placeholder="Masukkan alasan perubahan status (akan dikirim ke pelapor)..."
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
                <div>
                  <div style={styles.checkboxLabel}>
                    💬 Kirim pemberitahuan ke komentar laporan
                  </div>
                  <div style={styles.checkboxNote}>
                    Pelapor akan melihat perubahan status ini
                  </div>
                </div>
              </div>
              
              {!addCommentToUser && (
                <div style={styles.warningNote}>
                  ⚠️ Peringatan: Pelapor tidak akan mendapat pemberitahuan tentang perubahan status ini
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={styles.cancelButton}
              >
                Batal
              </button>
              <button
                onClick={handleStatusChange}
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

export default Dashboard;