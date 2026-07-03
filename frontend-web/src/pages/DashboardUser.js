import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const DashboardUser = () => {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/laporan');
      setLaporan(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    // Trigger theme change for sidebar if needed
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const stats = useMemo(() => {
    const total = laporan.length;
    const pending = laporan.filter(l => l.status === 'pending').length;
    const approved = laporan.filter(l => l.status === 'approved').length;
    const rejected = laporan.filter(l => l.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [laporan]);

  const chartData = [
    { name: 'Pending', total: stats.pending },
    { name: 'Disetujui', total: stats.approved },
    { name: 'Ditolak', total: stats.rejected },
  ];

  const insight = useMemo(() => {
    if (stats.total === 0) return 'Belum ada laporan dibuat.';
    const highest = Math.max(stats.pending, stats.approved, stats.rejected);
    if (highest === stats.pending) return 'Sebagian besar laporan masih menunggu proses.';
    if (highest === stats.approved) return 'Mayoritas laporan sudah disetujui.';
    return 'Banyak laporan ditolak, cek kembali pengajuan.';
  }, [stats]);

const isMobile = window.innerWidth <= 768;

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    },
    main: {
      flex: 1,
      marginLeft: isMobile ? '0' : '270px',
      width: isMobile ? '100%' : 'calc(100% - 270px)',
      padding: isMobile ? '16px' : '28px',
      overflowX: 'hidden',
    },
    header: {
      background: isDarkMode ? '#1e293b' : '#ffffff',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      padding: '24px',
      borderRadius: '18px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },

    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      marginBottom: '10px',
      gap: '10px',
      flexWrap: 'wrap'
    },

    title: {
      fontSize: '26px',
      fontWeight: 800,
      color: isDarkMode ? '#fff' : '#0f172a',
      margin: 0
    },
    subtitle: {
      fontSize: '14px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      marginTop: '8px'
    },
    button: {
      padding: '10px 14px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      transition: 'all 0.2s'
    },
    primaryBtn: {
      background: 'linear-gradient(to right, #f97316, #ea580c)',
      color: '#fff',
      fontWeight: 700
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginTop: '20px'
    },
    card: {
      background: isDarkMode ? '#1e293b' : '#ffffff',
      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
      borderRadius: '18px',
      padding: '18px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 800,
      color: isDarkMode ? '#fff' : '#0f172a'
    },
    statLabel: {
      fontSize: '13px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      marginTop: '8px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 700,
      margin: '20px 0 10px',
      color: isDarkMode ? '#fff' : '#0f172a'
    },
    chartBox: {
      height: '300px',
      width: '100%',
      minWidth: 0,
    },
    insight: {
      marginTop: '10px',
      fontSize: '13px',
      color: isDarkMode ? '#cbd5e1' : '#475569'
    },
    reportGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginTop: '12px'
    },
    reportCard: {
      overflow: 'hidden',
      borderRadius: '16px',
      padding: 0
    },
    image: {
      width: '100%',
      height: '180px',
      objectFit: 'cover'
    },
    reportBody: {
      padding: '14px'
    },
    reportTitle: {
      fontWeight: 700,
      marginBottom: '6px',
      color: isDarkMode ? '#fff' : '#0f172a'
    },
    reportDesc: {
      fontSize: '13px',
      color: isDarkMode ? '#94a3b8' : '#64748b',
      lineHeight: 1.5
    },
    empty: {
      textAlign: 'center',
      padding: '40px',
      color: isDarkMode ? '#94a3b8' : '#64748b'
    },
    // Media query for responsive
    '@media (max-width: 768px)': {
      main: {
        marginLeft: 0,
        width: '100%',
        padding: '16px'
      }
    }
  };

  return (
    <div style={styles.page}>
      <Sidebar
        user={user}
        activeMenu="dashboard"
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
      />

      <main style={styles.main}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Halo, {user.name || 'User'} 👋</h1>
            <p style={styles.subtitle}>{insight}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                ...styles.button,
                background: isDarkMode ? '#334155' : '#e2e8f0',
                color: isDarkMode ? '#fff' : '#0f172a'
              }}
              onClick={toggleTheme}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            <button
              style={{ ...styles.button, ...styles.primaryBtn }}
              onClick={() => navigate('/laporan/buat')}
            >
              + Buat Laporan
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div style={styles.grid}>
          {[
            ['📊 Total Laporan', stats.total],
            ['⏳ Pending', stats.pending],
            ['✅ Disetujui', stats.approved],
            ['❌ Ditolak', stats.rejected]
          ].map(([label, value]) => (
            <div key={label} style={styles.card}>
              <div style={styles.statValue}>{value}</div>
              <div style={styles.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* CHART SECTION */}
        <h2 style={styles.sectionTitle}>📈 Statistik Laporan</h2>
        <div style={{ ...styles.card, ...styles.chartBox }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={isDarkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{
                  background: isDarkMode ? '#1e293b' : '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  color: isDarkMode ? '#fff' : '#0f172a'
                }}
              />
              <Bar dataKey="total" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT REPORTS */}
           <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>📋 Laporan Terbaru</h2>
          <button
            style={{ ...styles.button, ...styles.primaryBtn }}
            onClick={() => navigate('/laporan')}
          >
           📄 Lihat Semua Laporan
          </button>
        </div>
  
        {loading ? (
          <div style={styles.empty}>
            <div>Loading data...</div>
          </div>
        ) : laporan.length === 0 ? (
          <div style={styles.empty}>
            <div>📭 Belum ada laporan</div>
          </div>
        ) : (
          <div style={styles.reportGrid}>
            {laporan.slice(0, 6).map(item => (
              <div 
                key={item.id} 
                style={{ ...styles.card, ...styles.reportCard }}
                onClick={() => navigate(`/laporan/${item.id}`)}
              >
               <img
                src={
                  item.image
                    ? `http://localhost:5000/uploads/${item.image}`
                    : '/no-image.png'
                }
                style={styles.image}
                alt={item.title}
                onError={(e) => {
                  e.target.src = '/no-image.png';
                }}
/>
                <div style={styles.reportBody}>
                  <div style={styles.reportTitle}>{item.title}</div>
                  <div style={styles.reportDesc}>
                    {item.description?.slice(0, 80)}...
                  </div>
                  <div style={{ 
                    marginTop: '10px', 
                    fontSize: '11px', 
                    color: isDarkMode ? '#64748b' : '#94a3b8' 
                  }}>
                    Status: {item.status || 'pending'}
                  </div>
                  <div style={{ 
                    marginTop: '6px', 
                    fontSize: '11px', 
                    color: isDarkMode ? '#94a3b8' : '#64748b' 
                  }}>
                    Lokasi: {item.location || '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardUser;