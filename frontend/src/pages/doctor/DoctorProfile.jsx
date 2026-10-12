import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorApi } from '../../api/doctorApi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { User, Stethoscope, Award, DollarSign, Mail, Phone } from 'lucide-react';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi.getActive().then((res) => {
      if (res.success) {
        const found = res.data.find((d) => d.email === user?.email);
        setDoctorDetails(found);
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
            <h1 style={{ fontSize: '1.85rem' }}>Physician Credentials & Profile</h1>
            <p style={{ color: '#64748b' }}>Clinical appointments, specialization, and consultation parameters</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading credentials..." />
          ) : (
            <div className="card" style={{ maxWidth: '650px', padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                  {user?.fullName?.charAt(0) || 'D'}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem' }}>{user?.fullName}</h2>
                  <div style={{ fontSize: '0.95rem', color: '#0284c7', fontWeight: 600 }}>
                    {doctorDetails?.specialization || 'Clinical Specialist'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {doctorDetails?.departmentName}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Mail size={18} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>EMAIL</div>
                    <div style={{ fontWeight: 600 }}>{user?.email}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Award size={18} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>QUALIFICATIONS & EXPERIENCE</div>
                    <div style={{ fontWeight: 600 }}>
                      {doctorDetails?.qualification} ({doctorDetails?.experienceYears} Years Experience)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <DollarSign size={18} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>CONSULTATION FEE</div>
                    <div style={{ fontWeight: 600, color: '#10b981' }}>
                      ${doctorDetails?.consultationFee} per visit
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>BIOGRAPHY</div>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {doctorDetails?.biography || 'Specialist dedicated to patient care.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
