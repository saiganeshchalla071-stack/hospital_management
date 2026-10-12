import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BarChart3, TrendingUp, Users, Calendar, CheckCircle } from 'lucide-react';

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getAdminStats().then((res) => {
      if (res.success) setStats(res.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Hospital Activity & Quality Reports</h1>
            <p style={{ color: '#64748b' }}>Operational metrics, capacity analysis, and financial performance</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Generating management report..." />
          ) : (
            <>
              <div className="stats-grid">
                <StatCard
                  title="REVENUE REALIZED"
                  value={`$${stats?.totalRevenue || 0}`}
                  icon={TrendingUp}
                  color="emerald"
                  subtitle="Successfully settled"
                />
                <StatCard
                  title="PENDING RECEIVABLES"
                  value={`$${stats?.pendingRevenue || 0}`}
                  icon={TrendingUp}
                  color="amber"
                  subtitle="Awaiting payment"
                />
                <StatCard
                  title="ADMISSION RATE"
                  value={`${stats?.totalAppointments ? Math.round(((stats.completedAppointments || 0) / stats.totalAppointments) * 100) : 0}%`}
                  icon={CheckCircle}
                  color="blue"
                  subtitle="Appointment completion"
                />
                <StatCard
                  title="TOTAL PATIENT BASE"
                  value={stats?.totalPatients || 0}
                  icon={Users}
                  color="teal"
                  subtitle="Registered profiles"
                />
              </div>

              <div className="card" style={{ padding: '2rem', marginTop: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.25rem', color: '#0f172a' }}>Operational Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#0284c7' }}>Department Distribution</h4>
                    <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      Operating across <strong>{stats?.totalDepartments}</strong> specialized clinical centers with <strong>{stats?.totalDoctors}</strong> credentialed medical doctors.
                    </p>
                  </div>

                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#0d9488' }}>Clinical Consultations</h4>
                    <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                      Total booking volume stands at <strong>{stats?.totalAppointments}</strong> visits, with <strong>{stats?.pendingAppointments}</strong> currently in review queue.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
