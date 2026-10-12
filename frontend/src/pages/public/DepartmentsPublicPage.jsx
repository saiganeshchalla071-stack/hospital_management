import React, { useState, useEffect } from 'react';
import { departmentApi } from '../../api/departmentApi';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DepartmentsPublicPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentApi.getAll().then((res) => {
      if (res.success) setDepartments(res.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Clinical Departments & Centers</h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Comprehensive healthcare facilities equipped for specialized diagnoses and care
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading hospital departments..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {departments.map((dept) => (
              <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="stat-icon blue" style={{ width: '42px', height: '42px' }}>
                      <Building2 size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>{dept.name}</h3>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {dept.description || 'Specialized clinical unit providing outpatient, surgical, and diagnostic care.'}
                  </p>
                </div>

                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 600 }}>
                    <MapPin size={16} />
                    <span>{dept.location}</span>
                  </div>
                  <Link to={`/doctors-directory`} style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    View Doctors <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DepartmentsPublicPage;
