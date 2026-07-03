import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const LandingPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    laporan: 0,
    users: 0,
    resolved: 0,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    setIsAuthenticated(!!token);
    setUserRole(user.role);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [laporanRes, usersRes] = await Promise.all([
        API.get('/laporan'),
        API.get('/users').catch(() => ({ data: [] })),
      ]);

      const laporan = laporanRes.data || [];

      setStats({
        laporan: laporan.length,
        users: usersRes.data?.length || 0,
        resolved: laporan.filter((l) => l.status === 'approved').length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetStarted = () => {
  navigate('/register');
};

  useEffect(() => {
    const style = document.createElement('style');

    style.innerHTML = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Poppins', sans-serif;
        background: #fff;
        overflow-x: hidden;
      }

      html {
        scroll-behavior: smooth;
      }

      .container {
        width: 100%;
        max-width: 1200px;
        margin: auto;
      }

      .btn {
        border: none;
        cursor: pointer;
        transition: 0.3s;
      }

      .btn:hover {
        transform: translateY(-3px);
      }

      .card:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.08);
      }

      .card {
        transition: 0.3s;
      }

      @media(max-width: 900px){
        .hero {
          flex-direction: column;
          text-align: center;
          gap: 40px;
        }

        .section-flex {
          flex-direction: column;
        }

        .navbar {
          padding: 20px;
        }
      }

      @media(max-width: 600px){
        .hero-title {
          font-size: 38px !important;
        }

        .feature-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ background: '#fffaf7' }}>
      {/* NAVBAR */}
      <nav
        className="navbar"
        style={{
          width: '100%',
          padding: '20px 70px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#ff7a00',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '20px',
            }}
          >
            S
          </div>

          <h2 style={{ color: '#222', fontWeight: '800' }}>SIPEMA</h2>
        </div>

        <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <a href="#home" style={navLink}>Home</a>
          <a href="#services" style={navLink}>Services</a>
          <a href="#about" style={navLink}>About</a>
          <a href="#contact" style={navLink}>Contact</a>

          
          
              <Link to="/login" style={{navLink, fontSize:'16px', fontWeight:'bold', color: '#f97316'}} >Log in</Link>
              <Link to="/register" style={orangeBtn}>Sign Up</Link>
           
       </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="hero"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '80px 70px',
          gap: '40px',
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: '#ff7a00',
              fontWeight: '700',
              marginBottom: '15px',
            }}
          >
            Welcome To SIPEMA
          </p>

          <h1
            className="hero-title"
            style={{
              fontSize: '62px',
              lineHeight: '1.2',
              color: '#222',
              marginBottom: '20px',
              fontWeight: '800',
            }}
          >
            Online Public <br />
            Complaint<br />
            Services
          </h1>

          <p
            style={{
              color: '#777',
              lineHeight: '1.8',
              maxWidth: '520px',
              marginBottom: '30px',
            }}
          >
            SIPEMA membantu masyarakat menyampaikan laporan dengan cepat,
            aman, dan transparan menggunakan sistem digital modern.
          </p>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button
              onClick={handleGetStarted}
              className="btn"
              style={orangeBtn}
            >
              Get Started
            </button>

            <button
              className="btn"
              style={{
                padding: '14px 30px',
                borderRadius: '40px',
                border: '2px solid #ff7a00',
                background: 'transparent',
                color: '#ff7a00',
                fontWeight: '600',
              }}
            >
              Read More
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: '#ffe5cf',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '120px',
              boxShadow: '0 15px 40px rgba(255,122,0,0.2)',
            }}
          >
            💻
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        style={{
          padding: '80px 70px',
          background: '#fff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <p style={{ color: '#ff7a00', fontWeight: '700' }}>Our Services</p>
          <h1
            style={{
              fontSize: '42px',
              color: '#222',
              marginTop: '10px',
            }}
          >
            We Provide The Best Services
          </h1>
        </div>

        <div
          className="feature-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: '25px',
          }}
        >
          {[
            {
              icon: '📋',
              title: 'Quick Report',
              desc: 'Buat laporan dengan cepat dan mudah.',
            },
            {
              icon: '📸',
              title: 'Upload Evidence',
              desc: 'Tambahkan bukti foto dan dokumen.',
            },
            {
              icon: '📊',
              title: 'Real Monitoring',
              desc: 'Pantau status laporan realtime.',
            },
            {
              icon: '💬',
              title: 'Discussion',
              desc: 'Diskusi dan dukungan masyarakat.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="card"
              style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '35px 25px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  margin: 'auto',
                  marginBottom: '20px',
                  borderRadius: '20px',
                  background: '#fff1e6',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '34px',
                }}
              >
                {item.icon}
              </div>

              <h3 style={{ marginBottom: '12px', color: '#222' }}>
                {item.title}
              </h3>

              <p style={{ color: '#777', lineHeight: '1.7' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="section-flex"
        style={{
          padding: '80px 70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '50px',
          background: '#fff4ec',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '320px',
              height: '320px',
              borderRadius: '30px',
              background: '#ffd7b5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '100px',
            }}
          >
            🧑‍💻
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ color: '#ff7a00', fontWeight: '700' }}>About Us</p>

          <h1
            style={{
              fontSize: '44px',
              color: '#222',
              margin: '15px 0',
            }}
          >
            Simple Solutions!
          </h1>

          <p
            style={{
              color: '#666',
              lineHeight: '1.8',
              marginBottom: '25px',
            }}
          >
            SIPEMA hadir sebagai solusi modern untuk membantu masyarakat
            melaporkan masalah lingkungan, fasilitas umum, dan pelayanan dengan
            lebih efektif.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={aboutItem}>📞 Contact</div>
            <div style={aboutItem}>💬 Chat Discussion</div>
            <div style={aboutItem}>📍 Tracking Laporan</div>
            <div style={aboutItem}>🛡️ Respon Cepat</div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button
              onClick={handleGetStarted}
              className="btn"
              style={orangeBtn}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{
          padding: '80px 70px',
          background: '#fff',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: '25px',
          }}
        >
          {[
            {
              title: 'Total Laporan',
              value: "40+",
              icon: '📋',
            },
            {
              title: 'Laporan Selesai',
              value: "35+",
              icon: '✅',
            },
            {
              title: 'Pengguna Aktif',
              value: "50+",
              icon: '👥',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="card"
              style={{
                background: '#fff7f1',
                padding: '40px 20px',
                borderRadius: '25px',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.04)',
              }}
            > 
              <div style={{ fontSize: '50px' }}>{item.icon}</div>
              <h1
                style={{
                  fontSize: '48px',
                  color: '#ff7a00',
                  margin: '15px 0',
                }}
              > 
                {item.value}
               </h1>
              <p style={{ color: '#555', fontWeight: '600' }}>
                {item.title} 
              </p> 
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        id="contact"
        style={{
          padding: '80px 40px',
          background: '#ff7a00',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <h1 style={{ fontSize: '46px', marginBottom: '20px' }}>
          Ready To Get Started?
        </h1>

        <p
          style={{
            maxWidth: '650px',
            margin: 'auto',
            lineHeight: '1.8',
            marginBottom: '35px',
          }}
        >
          Bergabung bersama SIPEMA dan bantu menciptakan lingkungan yang lebih
          baik melalui teknologi digital.
        </p>

        <button
          onClick={handleGetStarted}
          className="btn"
          style={{
            padding: '15px 35px',
            borderRadius: '40px',
            border: 'none',
            background: 'white',
            color: '#ff7a00',
            fontWeight: '700',
            fontSize: '16px',
          }}
        >
          Get Started
        </button>
      </section>

      {/* FOOTER */}
{/* FOOTER */}
          <footer
            style={{
              background: '#fffefe',
              color: '#000',
            }}
          >
            <div
              className="footer-wrap"
              style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '60px 60px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '50px',
                flexWrap: 'wrap',
              }}
            >

              {/* BRAND */}
              <div style={{ flex: 2, minWidth: '220px' }}>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >

                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: '#ff7a00',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '22px',
                      boxShadow: '0 5px 15px rgba(255,122,0,0.25)',
                    }}
                  >
                    S
                  </div>

                  <h2
                    style={{
                      fontSize: '30px',
                      fontWeight: '700',
                      color: 'black',
                    }}
                  >
                    SIPEMA
                  </h2>

                </div>

                <p
                  style={{
                    color: '#777',
                    fontSize: '14px',
                    lineHeight: '1.8',
                    marginBottom: '20px',
                    maxWidth: '400px',
                  }}
                >
                  Sistem Pengaduan Masyarakat modern untuk membantu warga
                  menyampaikan aspirasi dengan cepat, transparan, dan akuntabel.
                </p>

                <div
                  className="footer-social"
                  style={{
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  {['📘', '📷', '🐦', '💼'].map((item, index) => (
                    <div
                      key={index}
                      className="social-icon"
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: '#fff3e8',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '18px',
                        transition: '0.3s',
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* MENU */}
              <div style={{ minWidth: '130px' }}>

                <h3
                  style={{
                    marginBottom: '20px',
                    fontSize: '18px',
                    color: '#222',
                    fontWeight: '700',
                  }}
                >
                  Menu
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <Link
                    to="/"
                    style={{
                      textDecoration: 'none',
                      color: '#777',
                      fontSize: '14px',
                    }}
                  >
                    Beranda
                  </Link>

                  <Link
                    to="/laporan"
                    style={{
                      textDecoration: 'none',
                      color: '#777',
                      fontSize: '14px',
                    }}
                  >
                    Laporan
                  </Link>

                  <Link
                    to="/laporan"
                    style={{
                      textDecoration: 'none',
                      color: '#777',
                      fontSize: '14px',
                    }}
                  >
                    Laporan
                  </Link>

                  <Link
                    to="/laporan"
                    style={{
                      textDecoration: 'none',
                      color: '#777',
                      fontSize: '14px',
                    }}
                  >
                    About
                  </Link>

                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      style={{
                        textDecoration: 'none',
                        color: '#f97316',
                        fontSize: '14px',
                      }}
                    >
                      Login
                    </Link>
                  )}

                  {!isAuthenticated && (
                    <Link
                      to="/register"
                      style={{
                        textDecoration: 'none',
                        color: '#777',
                        fontSize: '14px',
                      }}
                    >
                      Daftar
                    </Link>
                  )}
                </div>
              </div>

              {/* CONTACT */}
              <div style={{ minWidth: '220px' }}>

                <h3
                  style={{
                    marginBottom: '20px',
                    fontSize: '18px',
                    color: '#222',
                    fontWeight: '700',
                  }}
                >
                  Kontak
                </h3>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    color: '#777',
                    fontSize: '14px',
                  }}
                >
                  <p>📧 sipema24/7@gmail.com</p>
                  <p>📞 (021) 1234 5678</p>
                  <p>🏢 Jakarta Pusat, Indonesia</p>
                  <p>⏰ 24/7 WIB</p>
                </div>

              </div>

            </div>

            {/* COPYRIGHT */}
            <div
              style={{
                textAlign: 'center',
                padding: '25px',
                borderTop: '1px solid #f1f1f1',
                color: '#888',
                fontSize: '13px',
              }}
            >
              © 2024-2026 SIPEMA - Sistem Pengaduan Masyarakat | All Rights Reserved
            </div>

          </footer>
        </div>
    );
};

export default LandingPage;

const navLink = {
  textDecoration: 'none',
  color: '#555',
  fontWeight: '500',
};

const orangeBtn = {
  padding: '14px 30px',
  borderRadius: '40px',
  background: '#ff7a00',
  color: 'white',
  textDecoration: 'none',
  fontWeight: '600',
  border: 'none',
};

const aboutItem = {
  background: 'white',
  padding: '15px 20px',
  borderRadius: '14px',
  color: '#444',
  fontWeight: '600',
  boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
};

const footerMenu = {
  color: '#666',
  marginBottom: '10px',
};

