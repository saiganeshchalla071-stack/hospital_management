import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import { departmentApi } from '../../api/departmentApi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Calendar, Stethoscope } from 'lucide-react';

const DoctorSearchPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentApi.getAll().then((res) => {
      if (res.success) setDepartments(res.data);
    });
    fetchDoctors();
  }, []);

  const fetchDoctors = async (deptId = '', searchQuery = '') => {
    setLoading(true);
    try {
      const res = await doctorApi.search(deptId || null, searchQuery || null);
      if (res.success) setDoctors(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(selectedDept, query);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Search Specialist Physicians</h1>
            <p style={{ color: '#64748b' }}>Filter by clinical department, doctor name, and medical specialization</p>
          </div>

          <form onSubmit={handleSearch} className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr)) 120px', gap: '1rem', alignItems: 'center' }}>
              <div className="table-search-input" style={{ width: '100%' }}>
                <Search size={18} color="#64748b" />
                <input
                  type="text"
                  placeholder="Doctor name, specialty..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  fetchDoctors(e.target.value, query);
                }}
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
            <LoadingSpinner message="Searching specialists..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {doctors.map((doc) => (
                <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                        {doc.fullName?.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem' }}>{doc.fullName}</h3>
                        <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>{doc.specialization}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{doc.departmentName}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem' }}>
                      <div>🎓 {doc.qualification} &bull; {doc.experienceYears} Yrs Exp</div>
                      <div style={{ marginTop: '0.25rem', fontWeight: 600, color: '#0f172a' }}>
                        Fee: ${doc.consultationFee}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/patient/book-appointment?doctorId=${doc.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Calendar size={14} /> Book Appointment
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSearchPage;
