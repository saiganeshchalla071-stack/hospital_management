import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { Users, UserCheck, Building2, Calendar, CreditCard, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getAdminStats().then((res) => {
      if (res.success) setStats(res.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <LoadingSpinner message="Aggregating hospital analytics..." />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem' }}>Hospital Executive Dashboard</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                System-wide overview of patient admissions, clinical staff, and operations
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/admin/appointments" className="btn btn-secondary btn-sm">
                <Calendar size={16} /> Manage Appointments
              </Link>
              <Link to="/admin/doctors" className="btn btn-primary btn-sm">
                <UserCheck size={16} /> Manage Doctors
              </Link>
            </div>
          </div>

          {/* Primary KPI Stats Grid */}
          <div className="stats-grid">
            <StatCard
              title="TOTAL DOCTORS"
              value={stats?.totalDoctors || 0}
              icon={UserCheck}
              color="blue"
              subtitle={`${stats?.extraMetrics?.activeDoctors || 0} active on roster`}
            />
            <StatCard
              title="REGISTERED PATIENTS"
              value={stats?.totalPatients || 0}
              icon={Users}
              color="teal"
              subtitle="Active medical records"
            />
            <StatCard
              title="DEPARTMENTS"
              value={stats?.totalDepartments || 0}
              icon={Building2}
              color="emerald"
              subtitle="Clinical centers"
            />
            <StatCard
              title="TOTAL APPOINTMENTS"
              value={stats?.totalAppointments || 0}
              icon={Calendar}
              color="amber"
              subtitle={`${stats?.pendingAppointments || 0} pending review`}
            />
          </div>

          {/* Revenue & Operational Status */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="stat-icon emerald" style={{ width: '40px', height: '40px' }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>Financial Overview</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Consultations and procedure billings</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>SETTLED REVENUE</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>${stats?.totalRevenue}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>PENDING INVOICES</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>${stats?.pendingRevenue}</div>
                </div>
              </div>
              <Link to="/admin/billing" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                View Invoices & Billing
              </Link>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="stat-icon blue" style={{ width: '40px', height: '40px' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>Appointment Breakdown</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Distribution by scheduling workflow</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Pending Review:</span>
                  <span className="badge badge-pending">{stats?.pendingAppointments || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Approved / Scheduled:</span>
                  <span className="badge badge-approved">{stats?.approvedAppointments || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Completed Consultations:</span>
                  <span className="badge badge-completed">{stats?.completedAppointments || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
