import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import { departmentApi } from '../../api/departmentApi';
import { Search, Calendar, Stethoscope, Award, DollarSign } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DoctorsDirectoryPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentApi.getAll().then((res) => {
      if (res.success) setDepartments(res.data);
    });
    fetchDoctors();
  }, []);

  const fetchDoctors = async (deptId = '', query = '') => {
    setLoading(true);
    try {
      const res = await doctorApi.search(deptId || null, query || null);
      if (res.success) setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedDept(e.target.value);
    fetchDoctors(e.target.value, searchQuery);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors(selectedDept, searchQuery);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Find Medical Specialists</h1>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            Book appointments with accredited physicians across medical disciplines
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <form onSubmit={handleSearchSubmit} className="card" style={{ marginBottom: '2.5rem', padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr)) 120px', gap: '1rem', alignItems: 'center' }}>
            <div className="table-search-input" style={{ width: '100%' }}>
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder="Search doctor name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="form-control"
              value={selectedDept}
              onChange={handleFilterChange}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <button type="submit" className="btn btn-primary" style={{ height: '100%' }}>
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <LoadingSpinner message="Locating doctors..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {doctors.map((doc) => (
              <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="user-avatar" style={{ width: '52px', height: '52px', fontSize: '1.25rem' }}>
                      {doc.fullName?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>{doc.fullName}</h3>
                      <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>{doc.specialization}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{doc.departmentName}</div>
                    </div>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    {doc.biography || 'Experienced clinician providing compassionate and evidence-based patient care.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: '#64748b', marginBottom: '1.5rem' }}>
                    <div><strong>🎓 Qualifications:</strong> {doc.qualification}</div>
                    <div><strong>⏳ Experience:</strong> {doc.experienceYears} Years</div>
                    <div><strong>💵 Consultation Fee:</strong> <span style={{ color: '#0f172a', fontWeight: 700 }}>${doc.consultationFee}</span></div>
                  </div>
                </div>

                <Link
                  to={`/patient/book-appointment?doctorId=${doc.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Calendar size={16} /> Book Appointment
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DoctorsDirectoryPage;
