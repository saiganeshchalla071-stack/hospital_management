import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const NotFoundPage = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <FileQuestion size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>404 - Page Not Found</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
            The page or clinical resource you requested does not exist or has been relocated.
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
