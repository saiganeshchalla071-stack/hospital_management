import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, FileText, CreditCard, Shield, Clock, Users, ArrowRight, Activity } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { doctorApi } from '../../api/doctorApi';
import { departmentApi } from '../../api/departmentApi';

const HomePage = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    departmentApi.getAll().then((res) => {
      if (res.success) setDepartments(res.data.slice(0, 4));
    }).catch(() => {});

    doctorApi.getActive().then((res) => {
      if (res.success) setDoctors(res.data.slice(0, 4));
    }).catch(() => {});
  }, []);

  return (
    <div className="app-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'white',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#0284c7',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Activity size={16} /> Advanced Digital Healthcare Platform
          </div>
          <h1 className="hero-title">
            Compassionate Care, <span>Digitally Streamlined.</span>
          </h1>
          <p className="hero-subtitle">
            Book certified medical specialists in seconds, review comprehensive clinical history, and manage healthcare billing with confidence.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/patient/book-appointment" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
              <Calendar size={18} /> Book an Appointment
            </Link>
            <Link to="/doctors-directory" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem' }}>
              <Stethoscope size={18} /> Explore Specialists
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats Banner */}
      <section style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-heading)' }}>50+</div>
            <div style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Specialist Doctors</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0d9488', fontFamily: 'var(--font-heading)' }}>15+</div>
            <div style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Clinical Departments</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0284c7', fontFamily: 'var(--font-heading)' }}>24 / 7</div>
            <div style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Emergency Support</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>99.8%</div>
            <div style={{ color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Patient Satisfaction</div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Complete Hospital Ecosystem</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Digitizing all administrative and clinical touchpoints for superior patient outcomes</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="stat-icon blue">
              <Calendar size={24} />
            </div>
            <h3>Conflict-Free Booking</h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem' }}>
              Real-time schedule validation prevents double bookings and guarantees doctors' availability.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="stat-icon teal">
              <FileText size={24} />
            </div>
            <h3>Secure Medical Records</h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem' }}>
              Attending clinicians document consultation diagnoses and clinical notes safely under role authorization.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="stat-icon emerald">
              <Shield size={24} />
            </div>
            <h3>Digital E-Prescriptions</h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem' }}>
              Itemized dosages, intake frequencies, and directions accessible instantly by patients from anywhere.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="stat-icon amber">
              <CreditCard size={24} />
            </div>
            <h3>Transparent Billing</h3>
            <p style={{ color: '#64748b', fontSize: '0.925rem' }}>
              Automated invoice generation with instant status tracking across cash, card, UPI, and insurance methods.
            </p>
          </div>
        </div>
      </section>

      {/* Department Highlights */}
      <section style={{ background: '#ffffff', padding: '4rem 2rem', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Specialized Departments</h2>
              <p style={{ color: '#64748b' }}>Our centers of medical excellence equipped with cutting-edge infrastructure</p>
            </div>
            <Link to="/departments-list" className="btn btn-secondary btn-sm">
              View All Departments <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {departments.map((dept) => (
              <div key={dept.id} className="card" style={{ borderLeft: '4px solid #0284c7' }}>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#0f172a' }}>{dept.name}</h4>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', minHeight: '40px' }}>
                  {dept.description}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                  📍 {dept.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
