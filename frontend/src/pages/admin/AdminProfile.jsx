import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { User, Shield, Mail, Phone, Calendar } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Administrator Profile</h1>
            <p style={{ color: '#64748b' }}>Account details and system access privileges</p>
          </div>

          <div className="card" style={{ maxWidth: '600px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
              <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>{user?.fullName}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="badge badge-approved">SYSTEM ADMINISTRATOR</span>
                  <span className="badge badge-completed">ACTIVE ACCESS</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Mail size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>EMAIL ADDRESS</div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Phone size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PHONE NUMBER</div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{user?.phone || '+1 (555) 0100'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Shield size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>SECURITY ROLE</div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>Full Administrative Access (ROLE_ADMIN)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
