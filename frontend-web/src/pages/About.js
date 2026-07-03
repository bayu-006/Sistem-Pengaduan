import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const About = () => {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (

        <div style={styles.wrapper}>

            <Sidebar
                user={user}
                activeMenu="about"
                handleLogout={handleLogout}
            />

            <main style={styles.main}>

                {/* HERO */}
                <section style={styles.heroSection}>

                    <div style={styles.overlay}></div>

                    <div style={styles.heroContent}>

                        <div style={styles.badge}>
                            PORTAL PENGADUAN DIGITAL
                        </div>

                        <h1 style={styles.heroTitle}>
                            SIPEMA
                        </h1>

                        <p style={styles.heroSubtitle}>
                            Sistem Informasi Pengaduan Masyarakat modern
                            untuk membantu masyarakat menyampaikan laporan,
                            aspirasi, dan informasi secara cepat,
                            transparan, aman, dan mudah dipantau.
                        </p>

                        <div style={styles.heroButtons}>

                            <button
                                style={styles.primaryButton}
                                onClick={() =>
                                    navigate('/laporan')
                                }
                            >
                                📋 Lihat Laporan
                            </button>

                            <button
                                style={styles.secondaryButton}
                                onClick={() =>
                                    navigate('/laporan/buat')
                                }
                            >
                                ➕ Buat Laporan
                            </button>

                        </div>

                    </div>

                    <div style={styles.heroImageBox}>
                        <div style={styles.heroCircle}></div>

                        <div style={styles.heroEmoji}>
                            🏛️
                        </div>
                    </div>

                </section>

                {/* ABOUT */}
                <section style={styles.aboutSection}>

                    <div style={styles.leftContent}>

                        <div style={styles.smallLabel}>
                            ABOUT WEBSITE
                        </div>

                        <h2 style={styles.sectionTitle}>
                            Website Pengaduan Masyarakat Modern
                        </h2>

                        <p style={styles.sectionText}>
                            SIPEMA adalah platform digital yang dibuat
                            untuk membantu masyarakat dalam menyampaikan
                            laporan dan pengaduan secara online.
                        </p>

                        <p style={styles.sectionText}>
                            Sistem ini membantu admin dan petugas dalam
                            mengelola laporan dengan cepat dan transparan
                            sehingga pelayanan publik menjadi lebih baik.
                        </p>

                        <div style={styles.statsGrid}>

                            <div style={styles.statCard}>
                                <h3 style={styles.statNumber}>
                                    24/7
                                </h3>

                                <p style={styles.statText}>
                                    Akses Website
                                </p>
                            </div>

                            <div style={styles.statCard}>
                                <h3 style={styles.statNumber}>
                                    Fast
                                </h3>

                                <p style={styles.statText}>
                                    Respon Sistem
                                </p>
                            </div>

                        </div>

                    </div>

                    <div style={styles.rightImage}>

                        <div style={styles.imageCard}>
                            📢
                        </div>

                    </div>

                </section>

                {/* FEATURES */}
                <section style={styles.featureSection}>

                    <div style={styles.centerTitle}>

                        <div style={styles.smallLabelBlue}>
                            FITUR WEBSITE
                        </div>

                        <h2 style={styles.sectionCenterTitle}>
                            Kenapa Menggunakan SIPEMA?
                        </h2>

                    </div>

                    <div style={styles.featureGrid}>

                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>
                                📤
                            </div>

                            <h3 style={styles.featureTitle}>
                                Kirim Laporan
                            </h3>

                            <p style={styles.featureText}>
                                Membuat laporan masyarakat secara online
                                dengan mudah dan cepat.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>
                                📸
                            </div>

                            <h3 style={styles.featureTitle}>
                                Upload Bukti
                            </h3>

                            <p style={styles.featureText}>
                                Upload gambar atau bukti pendukung laporan.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>
                                📊
                            </div>

                            <h3 style={styles.featureTitle}>
                                Statistik
                            </h3>

                            <p style={styles.featureText}>
                                Menampilkan statistik laporan masyarakat.
                            </p>
                        </div>

                        <div style={styles.featureCard}>
                            <div style={styles.featureIcon}>
                                👨‍💼
                            </div>

                            <h3 style={styles.featureTitle}>
                                Dashboard Admin
                            </h3>

                            <p style={styles.featureText}>
                                Admin dapat mengelola laporan dan user.
                            </p>
                        </div>

                    </div>

                </section>

                {/* RULES */}
                <section style={styles.rulesSection}>

                    <div style={styles.rulesLeft}>

                        <div style={styles.smallLabel}>
                            PERATURAN
                        </div>

                        <h2 style={styles.sectionTitle}>
                            Aturan Penggunaan Website
                        </h2>

                        <ul style={styles.rulesList}>

                            <li>
                                Gunakan bahasa yang sopan dan jelas.
                            </li>

                            <li>
                                Dilarang membuat laporan palsu atau hoaks.
                            </li>

                            <li>
                                Upload gambar harus sesuai laporan.
                            </li>

                            <li>
                                Admin berhak menolak laporan yang melanggar aturan.
                            </li>

                            <li>
                                Semua aktivitas akan tercatat dalam sistem.
                            </li>

                        </ul>

                    </div>

                    <div style={styles.rulesImage}>
                        ⚖️
                    </div>

                </section>

                {/* FOOTER */}
                <footer style={styles.footer}>

                    <div style={styles.footerGrid}>

                        <div>

                            <h2 style={styles.footerLogo}>
                                📢 SIPEMA
                            </h2>

                            <p style={styles.footerDesc}>
                                Sistem Informasi Pengaduan Masyarakat
                                digital untuk pelayanan publik yang
                                lebih cepat, modern, aman, dan transparan.
                            </p>

                        </div>

                        <div>

                            <h3 style={styles.footerTitle}>
                                Navigasi
                            </h3>

                            <p style={styles.footerItem}>
                                Dashboard
                            </p>

                            <p style={styles.footerItem}>
                                Semua Laporan
                            </p>

                            <p style={styles.footerItem}>
                                Tentang Website
                            </p>

                        </div>

                        <div>

                            <h3 style={styles.footerTitle}>
                                Kontak
                            </h3>

                            <p style={styles.footerItem}>
                                📍 Jakarta Pusat, Indonesia
                            </p>

                            <p style={styles.footerItem}>
                                📧 sipema24/7@gmail.com
                            </p>

                            <p style={styles.footerItem}>
                                ☎️ (+62) 8128795678
                            </p>

                        </div>

                    </div>

                    <div style={styles.footerBottom}>
                        © 2026 SIPEMA — Sistem Pengaduan Masyarakat
                    </div>

                </footer>

            </main>

        </div>

    );

};

const styles = {

    wrapper: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'Inter, sans-serif',
    },

    main: {
        flex: 1,
        marginLeft: '260px',
    },

    heroSection: {
        position: 'relative',
        minHeight: '500px',
        background:
            'linear-gradient(135deg,#1e1b4b,#2563eb,#7c3aed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '70px',
        overflow: 'hidden',
        flexWrap: 'wrap',
        gap: '40px',
    },

    overlay: {
        position: 'absolute',
        inset: 0,
        background:
            'rgba(0,0,0,0.25)',
    },

    heroContent: {
        position: 'relative',
        zIndex: 2,
        maxWidth: '650px',
        color: '#fff',
    },

    badge: {
        display: 'inline-block',
        padding: '10px 20px',
        borderRadius: '999px',
        background:
            'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        marginBottom: '25px',
        fontWeight: '600',
        fontSize: '14px',
    },

    heroTitle: {
        margin: 0,
        fontSize: '80px',
        fontWeight: '900',
        letterSpacing: '4px',
    },

    heroSubtitle: {
        marginTop: '24px',
        fontSize: '18px',
        lineHeight: '1.9',
        color: '#dbeafe',
    },

    heroButtons: {
        display: 'flex',
        gap: '18px',
        marginTop: '35px',
        flexWrap: 'wrap',
    },

    primaryButton: {
        padding: '15px 28px',
        border: 'none',
        borderRadius: '14px',
        background: '#fff',
        color: '#2563eb',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '15px',
    },

    secondaryButton: {
        padding: '15px 28px',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.2)',
        background:
            'rgba(255,255,255,0.1)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '15px',
    },

    heroImageBox: {
        position: 'relative',
        zIndex: 2,
        width: '320px',
        height: '320px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    heroCircle: {
        position: 'absolute',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background:
            'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
    },

    heroEmoji: {
        position: 'relative',
        fontSize: '140px',
    },

    aboutSection: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit,minmax(320px,1fr))',
        gap: '40px',
        padding: '70px',
        alignItems: 'center',
    },

    leftContent: {},

    smallLabel: {
        color: '#7c3aed',
        fontWeight: '700',
        marginBottom: '14px',
        fontSize: '14px',
        letterSpacing: '1px',
    },

    smallLabelBlue: {
        color: '#2563eb',
        fontWeight: '700',
        marginBottom: '14px',
        fontSize: '14px',
        letterSpacing: '1px',
    },

    sectionTitle: {
        margin: 0,
        fontSize: '42px',
        fontWeight: '800',
        color: '#0f172a',
        lineHeight: '1.3',
    },

    sectionCenterTitle: {
        margin: 0,
        fontSize: '42px',
        fontWeight: '800',
        color: '#0f172a',
    },

    sectionText: {
        marginTop: '20px',
        color: '#475569',
        lineHeight: '1.9',
        fontSize: '16px',
    },

    statsGrid: {
        display: 'flex',
        gap: '20px',
        marginTop: '35px',
        flexWrap: 'wrap',
    },

    statCard: {
        background: '#fff',
        padding: '24px',
        borderRadius: '22px',
        boxShadow:
            '0 8px 24px rgba(0,0,0,0.06)',
        minWidth: '170px',
    },

    statNumber: {
        margin: 0,
        fontSize: '36px',
        color: '#2563eb',
        fontWeight: '800',
    },

    statText: {
        marginTop: '10px',
        color: '#64748b',
    },

    rightImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageCard: {
        width: '300px',
        height: '300px',
        borderRadius: '40px',
        background:
            'linear-gradient(135deg,#8b5cf6,#2563eb)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '120px',
        color: '#fff',
        boxShadow:
            '0 20px 50px rgba(37,99,235,0.25)',
    },

    featureSection: {
        background: '#eef2ff',
        padding: '70px',
    },

    centerTitle: {
        textAlign: 'center',
        marginBottom: '50px',
    },

    featureGrid: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit,minmax(250px,1fr))',
        gap: '24px',
    },

    featureCard: {
        background: '#fff',
        borderRadius: '26px',
        padding: '30px',
        textAlign: 'center',
        boxShadow:
            '0 8px 24px rgba(0,0,0,0.05)',
    },

    featureIcon: {
        fontSize: '50px',
        marginBottom: '18px',
    },

    featureTitle: {
        margin: 0,
        color: '#0f172a',
        fontSize: '22px',
    },

    featureText: {
        marginTop: '14px',
        color: '#64748b',
        lineHeight: '1.8',
        fontSize: '15px',
    },

    rulesSection: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit,minmax(320px,1fr))',
        gap: '40px',
        alignItems: 'center',
        padding: '70px',
    },

    rulesLeft: {},

    rulesList: {
        marginTop: '24px',
        paddingLeft: '22px',
        lineHeight: '2.2',
        color: '#dc2626',
        fontWeight: '500',
        fontSize: '16px',
    },

    rulesImage: {
        width: '300px',
        height: '300px',
        borderRadius: '40px',
        background:'linear-gradient(135deg,#f59e0b,#ef4444)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '120px',
        color: '#fff',
        margin: '0 auto',
        boxShadow:
            '0 20px 50px rgba(239,68,68,0.2)',
    },

    footer: {
        background:
            'linear-gradient(135deg,#fb923c,#f97316,#ea580c)',
        color: '#fff7ed',
        padding: '70px 60px 35px',
        borderRadius: '15px',
        marginLeft: '5px',
        marginRight: '5px',
        marginTop: '20px',
        overflow: 'hidden',
        boxShadow:
            '0 -10px 30px rgba(249, 116, 22, 0.31)',
    },


    footerGrid: {
        display: 'grid',
        gridTemplateColumns:
            'repeat(auto-fit,minmax(240px,1fr))',
        gap: '50px',
        marginBottom: '35px',
        alignItems: 'start',
    },

    footerColumn: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },

    footerLogo: {
        margin: 0,
        fontSize: '34px',
        fontWeight: '800',
    },

    footerDesc: {
        marginTop: '18px',
        color: '#ffedd5',
        lineHeight: '1.9',
        fontSize: '15px',
    },


    footerTitle: {
        marginBottom: '18px',
        fontSize: '22px',
        fontWeight: '700',
    },

  
    footerItem: {
        marginBottom: '14px',
        color: '#fff7ed',
        fontSize: '15px',
    },

    footerBottom: {
        borderTop:
            '1px solid rgba(255,255,255,0.15)',
        paddingTop: '24px',
        textAlign: 'center',
        color: '#ffedd5',
        fontSize: '14px',
    },

};

export default About;