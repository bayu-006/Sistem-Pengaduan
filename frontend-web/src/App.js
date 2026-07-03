import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DashboardUser from './pages/DashboardUser';
import About from './pages/About';
import Laporan from './pages/Laporan';
import BuatLaporan from './pages/BuatLaporan';
import DetailLaporan from './pages/DetailLaporan';
import UserManagement from './pages/UserManagement';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import Kategori from './pages/Kategori';
import ProfileUser from './pages/ProfileUser';

// Context untuk dark mode
const ThemeContext = React.createContext();

const App = () => {
    const [darkMode, setDarkMode] = React.useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    const getUserRole = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.role;
    };

    const hideSidebar = () => {
        const path = window.location.pathname;
        return ['/login', '/register', '/'].includes(path);
    };

    const bgColor = darkMode ? '#1a1a2e' : '#f5f7fa';
    const textColor = darkMode ? '#ffffff' : '#333333';

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <Router>
                <div style={{ display: 'flex', backgroundColor: bgColor, minHeight: '100vh' }}>
                    <div
                        style={{
                            flex: 1,
                            minHeight: '100vh',
                            backgroundColor: bgColor,
                            color: textColor,
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route 
                                path="/dashboard-user" 
                                element={<ProtectedRoute element={<DashboardUser />} requiredRole="user" />} 
                            />
                            <Route 
                                path="/dashboard" 
                                element={<ProtectedRoute element={<Dashboard />} requiredRole={['admin', 'super_admin']} />} 
                            />
                            <Route 
                                path="/laporan" 
                                element={<ProtectedRoute element={<Laporan />} />} 
                            />
                            <Route 
                                path="/kategori" 
                                element={<ProtectedRoute element={<Kategori />} />} 
                            />
                            <Route 
                                path="/laporan/buat" 
                                element={<ProtectedRoute element={<BuatLaporan />} />} 
                            />
                            <Route 
                                path="/laporan/:id" 
                                element={<ProtectedRoute element={<DetailLaporan />} />} 
                            />
                            <Route 
                                path="/about" 
                                element={<ProtectedRoute element={<About />} />} 
                            />
                            <Route 
                                path="/profile" 
                                element={<ProtectedRoute element={<ProfileUser />} />} 
                            />
                            <Route 
                                path="/users" 
                                element={<ProtectedRoute element={<UserManagement />} requiredRole={['admin', 'super_admin']} />} 
                            />
                        </Routes>
                        <ToastContainer position="top-right" autoClose={3000} />
                    </div>
                </div>
            </Router>
        </ThemeContext.Provider>
    );
};

export default App;