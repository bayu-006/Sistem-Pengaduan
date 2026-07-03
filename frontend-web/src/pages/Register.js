import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await API.post('/auth/register', {
                name,
                email,
                password,
            });

            setSuccess('Registrasi berhasil! Mengarahkan ke login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registrasi gagal');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const style = document.createElement('style');

        style.innerHTML = `
            *{
                margin:0;
                padding:0;
                box-sizing:border-box;
            }

            body{
                font-family:'Poppins',sans-serif;
                background:#f5f7fb;
            }

            .register-container{
                min-height:100vh;
                display:flex;
            }

            .left-panel{
                flex:1;
                background:linear-gradient(135deg,#ff7a00,#ff9a3d);
                display:flex;
                justify-content:center;
                align-items:center;
                padding:60px;
                color:white;
                position:relative;
                overflow:hidden;
            }

            .left-panel::before{
                content:'';
                position:absolute;
                width:300px;
                height:300px;
                background:rgba(255,255,255,0.08);
                border-radius:50%;
                top:-80px;
                right:-80px;
            }

            .left-panel::after{
                content:'';
                position:absolute;
                width:220px;
                height:220px;
                background:rgba(255,255,255,0.05);
                border-radius:50%;
                bottom:-60px;
                left:-60px;
            }

            .left-content{
                max-width:450px;
                position:relative;
                z-index:2;
            }

            .logo{
                width:80px;
                height:80px;
                border-radius:24px;
                background:rgba(255,255,255,0.15);
                display:flex;
                justify-content:center;
                align-items:center;
                font-size:38px;
                font-weight:800;
                margin-bottom:30px;
                backdrop-filter:blur(10px);
                border:1px solid rgba(255,255,255,0.2);
            }

            .left-title{
                font-size:42px;
                font-weight:800;
                line-height:1.2;
                margin-bottom:20px;
            }

            .left-subtitle{
                font-size:16px;
                line-height:1.8;
                opacity:0.9;
                margin-bottom:35px;
            }

            .features{
                display:flex;
                flex-direction:column;
                gap:18px;
            }

            .feature-item{
                display:flex;
                align-items:center;
                gap:14px;
                font-size:15px;
                background:rgba(255,255,255,0.08);
                padding:14px 18px;
                border-radius:14px;
                backdrop-filter:blur(10px);
            }

            .feature-icon{
                width:28px;
                height:28px;
                border-radius:50%;
                background:white;
                color:#667eea;
                display:flex;
                align-items:center;
                justify-content:center;
                font-weight:bold;
                flex-shrink:0;
            }

            .right-panel{
                flex:1;
                background:white;
                display:flex;
                justify-content:center;
                align-items:center;
                padding:40px;
            }

            .form-container{
                width:100%;
                max-width:450px;
            }

            .form-header{
                margin-bottom:35px;
            }

            .form-title{
                font-size:36px;
                font-weight:800;
                color:#222;
                margin-bottom:10px;
            }

            .form-subtitle{
                color:#777;
                font-size:15px;
            }

            .error{
                background:#fee2e2;
                color:#dc2626;
                padding:14px;
                border-radius:12px;
                margin-bottom:20px;
                font-size:14px;
            }

            .success{
                background:#dcfce7;
                color:#15803d;
                padding:14px;
                border-radius:12px;
                margin-bottom:20px;
                font-size:14px;
            }

            .input-group{
                margin-bottom:22px;
            }

            .label{
                display:block;
                margin-bottom:10px;
                font-size:14px;
                font-weight:600;
                color:#444;
            }

            .input{
                width:100%;
                padding:15px 18px;
                border-radius:14px;
                border:1px solid #e5e7eb;
                background:#f9fafb;
                font-size:15px;
                outline:none;
                transition:0.3s;
            }

            .input:focus{
                border-color:#667eea;
                background:white;
                box-shadow:0 0 0 4px rgba(102,126,234,0.12);
            }

            .button{
                width:100%;
                padding:16px;
                border:none;
                border-radius:14px;
                background:linear-gradient(135deg,#ff7a00,#ff9a3d);
                color:white;
                font-size:16px;
                font-weight:700;
                cursor:pointer;
                transition:0.3s;
                margin-top:10px;
            }

            .button:hover{
                transform:translateY(-3px);
                box-shadow:0 12px 25px rgba(102,126,234,0.25);
            }

            .button:disabled{
                opacity:0.7;
                cursor:not-allowed;
            }

            .login-section{
                margin-top:28px;
                text-align:center;
                color:#666;
                font-size:14px;
            }

            .login-link{
                color:#ff7a00;
                text-decoration:none;
                font-weight:700;
            }

            .login-link:hover{
                text-decoration:underline;
            }

            @media(max-width:900px){
                .register-container{
                    flex-direction:column;
                }

                .left-panel{
                    display:none;
                }

                .right-panel{
                    padding:30px 20px;
                }

                .form-title{
                    font-size:30px;
                }
            }
        `;

        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="register-container">

            {/* LEFT */}
            <div className="left-panel">
                <div className="left-content">

                    <div className="logo">
                        📋
                    </div>

                    <h1 className="left-title">
                        Bergabung Bersama SIPEMA
                    </h1>

                    <p className="left-subtitle">
                        Platform pengaduan masyarakat modern untuk membantu warga
                        menyampaikan laporan secara cepat, aman, dan transparan.
                    </p>

                    <div className="features">

                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Gratis di Gunakan selamanya</span>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Pelaporan cepat & transparan</span>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Monitoring laporan realtime</span>
                        </div>

                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Akses mudah di semua perangkat</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="right-panel">

                <div className="form-container">

                    <div className="form-header">
                        <h2 className="form-title">
                            Buat Akun
                        </h2>

                        <p className="form-subtitle">
                            Silakan isi data diri Anda
                        </p>
                    </div>

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label className="label">
                                Nama Lengkap
                            </label>

                            <input
                                type="text"
                                placeholder="Masukkan nama lengkap"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="label">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="contoh@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="label">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Minimal 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="button"
                            disabled={loading}
                        >
                            {loading ? 'Memproses...' : 'Daftar Sekarang'}
                        </button>

                    </form>

                    <div className="login-section">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="login-link">
                            Log in
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Register;