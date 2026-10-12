import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Award, ShieldCheck, HeartHandshake, Building, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>About CarePulse Hospital</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            A premier healthcare network committed to medical excellence, technological innovation, and compassionate patient care.
          </p>
        </div>

        <div className="card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#0284c7' }}>Our Mission & Values</h3>
          <p style={{ color: '#334155', lineHeight: 1.8, fontSize: '1rem', marginBottom: '1.5rem' }}>
            At CarePulse, our mission is to eliminate friction in healthcare delivery. By integrating doctor scheduling, electronic medical records (EMR), prescription tracking, and billing transparency, our platform empowers physicians to focus on patient outcomes rather than administrative paperwork.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <Award color="#0284c7" size={24} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Clinical Quality</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Board-certified medical practitioners with verified credentials.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <ShieldCheck color="#0d9488" size={24} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Privacy & Security</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Rigorous role-based encryption ensuring patient record isolation.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <HeartHandshake color="#e11d48" size={24} />
              <div>
                <strong style={{ display: 'block', color: '#0f172a' }}>Patient-First</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Transparent booking slots, upfront consultation fees, and zero surprise fees.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>State-of-the-Art Facilities</h3>
          <p style={{ color: '#334155', lineHeight: 1.8, fontSize: '0.95rem' }}>
            CarePulse features 350 in-patient specialty beds, 8 advanced operating suites, robotic surgery suites, comprehensive MRI/CT diagnostic imaging, and an integrated Level 1 Trauma Center. Our dedicated departments span Cardiology, Neurology, Pediatrics, Orthopedics, and Internal Medicine.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
