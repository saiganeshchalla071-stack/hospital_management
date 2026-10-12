import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '3rem 2rem 1.5rem',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#ffffff' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <Activity size={18} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>CarePulse Hospital</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8' }}>
            Digitizing healthcare workflows with patient-first appointment scheduling, digital medical records, and transparent billing.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li><Link to="/about" style={{ color: '#94a3b8' }}>About Our Hospital</Link></li>
            <li><Link to="/doctors-directory" style={{ color: '#94a3b8' }}>Find a Specialist</Link></li>
            <li><Link to="/departments-list" style={{ color: '#94a3b8' }}>Clinical Departments</Link></li>
            <li><Link to="/login" style={{ color: '#94a3b8' }}>Patient & Staff Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Emergency Care</h4>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
            24/7 Trauma & Emergency Center<br />
            <strong>Emergency Hotline:</strong> <span style={{ color: '#38bdf8' }}>+1 (800) 555-CARE</span><br />
            <strong>Ambulance Dispatch:</strong> <span style={{ color: '#38bdf8' }}>+1 (800) 555-9111</span>
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.85rem'
      }}>
        <div>&copy; {new Date().getFullYear()} CarePulse Hospital Management System. All rights reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>HIPAA-Compliant Architecture (Educational Prototype)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
