import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sidebarUser.css';

const Sidebar = ({
    user,
    activeMenu,
    handleLogout
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

    return (

        <aside className="userSidebar">

            <div>

                {/* LOGO */}

                <div className="userLogoSection">

                    <div className="userLogoIcon">
                        📢
                    </div>

                    <div>

                        <h2 className="userLogo">
                            SIPEMA
                        </h2>

                        <p className="userLogoSub">
                            Sistem Pengaduan Masyarakat
                        </p>

                    </div>

                </div>

                {/* PROFILE */}

                <div className="userProfileCard">

                    <div className="userProfileAvatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <h3 className="userProfileName">
                            {user?.name || 'User'}
                        </h3>

                        <p className="userProfileStatus">
                            ● Online
                        </p>

                    </div>

                </div>

                {/* MENU */}

                <div className="userMenuContainer">

                    <div
                        className={
                            activeMenu === 'dashboard'
                                ? 'userMenuItemActive'
                                : 'userMenuItem'
                        }
                        onClick={() =>
                            navigate('/dashboard-user')
                        }
                    >
                        🏠 Beranda
                    </div>

                    <div
                        className={
                            activeMenu === 'laporan'
                                ? 'userMenuItemActive'
                                : 'userMenuItem'
                        }
                        onClick={() =>
                            navigate('/laporan')
                        }
                    >
                        📋 Semua Laporan
                    </div>

                    <div
                        className={
                            activeMenu === 'about'
                                ? 'userMenuItemActive'
                                : 'userMenuItem'
                        }
                        onClick={() =>
                            navigate('/about')
                        }
                    >
                        ℹ️ Tentang Kami
                    </div>

                    <div
                        className={
                            activeMenu === 'profile'
                                ? 'userMenuItemActive'
                                : 'userMenuItem'
                        }
                        onClick={() =>
                            navigate('/profile')
                        }
                    >
                        👤 Profile
                    </div>

                </div>

            </div>

            {/* LOGOUT */}

            <button
                type="button"
                className="userLogoutButton"
                onClick={handleLogoutClick}
            >
                🚪 Keluar
            </button>

        </aside>

    );

};

export default Sidebar;