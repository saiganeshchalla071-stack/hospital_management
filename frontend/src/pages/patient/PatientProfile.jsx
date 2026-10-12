import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientApi } from '../../api/patientApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { User, Mail, Phone, Calendar, MapPin, HeartPulse } from 'lucide-react';

const PatientProfile = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    patientApi.getAll().then((res) => {
      if (res.success) {
        const found = res.data.find((p) => p.email === user?.email);
        setPatientData(found);
      }
    }).finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Patient Demographics & Profile</h1>
            <p style={{ color: '#64748b' }}>Personal contact information and registered emergency details</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading patient demographics..." />
          ) : (
            <div className="card" style={{ maxWidth: '650px', padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                  {user?.fullName?.charAt(0) || 'P'}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem' }}>{user?.fullName}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span className="badge badge-approved">PATIENT MEMBER</span>
                    <span className="badge badge-completed">VERIFIED ACCOUNT</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Mail size={18} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>EMAIL ADDRESS</div>
                    <div style={{ fontWeight: 600 }}>{user?.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Phone size={18} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PHONE NUMBER</div>
                    <div style={{ fontWeight: 600 }}>{user?.phone || 'Not provided'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Calendar size={18} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>DATE OF BIRTH</div>
                    <div style={{ fontWeight: 600 }}>{patientData?.dateOfBirth || 'Not specified'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <HeartPulse size={18} color="#ef4444" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>EMERGENCY CONTACT</div>
                    <div style={{ fontWeight: 600, color: '#ef4444' }}>{patientData?.emergencyContact || 'None listed'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <MapPin size={18} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>RESIDENTIAL ADDRESS</div>
                    <div style={{ color: '#475569', fontSize: '0.9rem' }}>{patientData?.address || 'No address on file'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
