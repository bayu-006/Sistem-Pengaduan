import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({
  user,
  activeMenu,
  handleLogout,
  isDarkMode,
}) => {
  const navigate = useNavigate();

      const handleLogoutClick = () => {

        const confirmedLogout = window.confirm(
            'Apakah anda yakin ingin keluar?'
        );

        if (confirmedLogout) {
            handleLogout();
        }

    };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
    },
    {
      key: 'laporan',
      label: 'Data Laporan',
      icon: '📋',
      path: '/laporan',
    },
    {
      key: 'kategori',
      label: 'Kategori',
      icon: '🗂️',
      path: '/kategori',
    },
  ];

  // khusus super admin
  if (user?.role === 'super_admin') {
    menuItems.push({
      key: 'users',
      label: 'Manajemen User',
      icon: '👥',
      path: '/users',
    });
  }

  const styles = {
    sidebar: {
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: isDarkMode
        ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 999,
      boxShadow: '4px 0 25px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
    },

    topSection: {
      display: 'flex',
      flexDirection: 'column',
    },

    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '40px',
      padding: '8px 0',
    },

    logoIcon: {
      width: '65px',
      height: '65px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '38px',
      color: '#fff',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
    },

    logoText: {
      flex: 1,
    },

    logoTitle: {
      fontSize: '22px',
      fontWeight: '800',
      margin: 0,
      color: '#fff',
      letterSpacing: '-0.5px',
    },

    logoSubtitle: {
      fontSize: '11px',
      opacity: 0.85,
      marginTop: '4px',
      color: 'rgba(255,255,255,0.9)',
      lineHeight: '1.3',
    },

    menuContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },

    menuItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '12px 16px',
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: active
        ? 'rgba(255,255,255,0.2)'
        : 'transparent',
      color: '#fff',
      fontWeight: active ? '700' : '500',
      backdropFilter: active ? 'blur(10px)' : 'none',
    }),

    menuIcon: {
      fontSize: '22px',
      width: '28px',
      textAlign: 'center',
    },

    bottomSection: {
      borderTop: '1px solid rgba(255,255,255,0.15)',
      paddingTop: '20px',
    },

    profileBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '20px',
      padding: '8px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.05)',
    },

    avatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: '700',
      fontSize: '20px',
    },

    profileName: {
      color: '#fff',
      fontWeight: '700',
      fontSize: '14px',
    },

    profileRole: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '11px',
      marginTop: '2px',
      textTransform: 'capitalize',
    },

    logoutBtn: {
      width: '100%',
      padding: '12px 16px',
      border: 'none',
      borderRadius: '14px',
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      fontSize: '14px',
    },
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.topSection}>
        {/* LOGO - dengan terompet yang lebih besar dan sejajar */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            📢
          </div>

          <div style={styles.logoText}>
            <h2 style={styles.logoTitle}>Admin Panel</h2>
            <div style={styles.logoSubtitle}>
              Kelola Sistem Pengaduan
            </div>
          </div>
        </div>

        {/* MENU */}
        <div style={styles.menuContainer}>
          {menuItems.map((menu) => (
            <div
              key={menu.key}
              style={styles.menuItem(activeMenu === menu.key)}
              onClick={() => navigate(menu.path)}
            >
              <span style={styles.menuIcon}>
                {menu.icon}
              </span>
              <span>{menu.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div style={styles.bottomSection}>
        <div style={styles.profileBox}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div style={styles.profileName}>
              {user?.name}
            </div>
            <div style={styles.profileRole}>
              {user?.role?.replace('_', ' ')}
            </div>
          </div>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={handleLogoutClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;