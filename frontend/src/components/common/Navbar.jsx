import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <div className="brand-icon">
          <Activity size={22} />
        </div>
        <span>Care<span style={{ color: '#0284c7' }}>Pulse</span></span>
      </Link>

      <nav>
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/about" className="nav-link">About Hospital</Link></li>
          <li><Link to="/doctors-directory" className="nav-link">Doctors</Link></li>
          <li><Link to="/departments-list" className="nav-link">Departments</Link></li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to={getDashboardPath()} className="btn btn-secondary btn-sm">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              </li>
              <li>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}>
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.fullName?.split(' ')[0]}</span>
                  <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>{user?.role}</span>
                </div>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link></li>
              <li><Link to="/register" className="btn btn-primary btn-sm">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
