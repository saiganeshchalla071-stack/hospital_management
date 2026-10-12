import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { appointmentApi } from '../../api/appointmentApi';
import { Calendar, PlusCircle, Pill, FileText, CreditCard, ArrowRight, Clock } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getPatientStats(),
      appointmentApi.getMyAppointments(),
    ]).then(([statsRes, apptRes]) => {
      if (statsRes.success) setStats(statsRes.data);
      if (apptRes.success) {
        setUpcomingAppointments(apptRes.data.slice(0, 4));
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <LoadingSpinner message="Opening patient portal..." />
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
              <h1 style={{ fontSize: '1.85rem' }}>Patient Health Dashboard</h1>
              <p style={{ color: '#64748b' }}>Manage your consultations, doctor appointments, and prescription history</p>
            </div>
            <Link to="/patient/book-appointment" className="btn btn-primary">
              <PlusCircle size={18} /> Book New Appointment
            </Link>
          </div>

          <div className="stats-grid">
            <StatCard
              title="UPCOMING VISITS"
              value={stats?.extraMetrics?.upcomingAppointments || 0}
              icon={Calendar}
              color="blue"
              subtitle="Confirmed appointments"
            />
            <StatCard
              title="ACTIVE PRESCRIPTIONS"
              value={stats?.extraMetrics?.prescriptionsCount || 0}
              icon={Pill}
              color="teal"
              subtitle="Medication regimens"
            />
            <StatCard
              title="CLINICAL VISITS"
              value={stats?.extraMetrics?.medicalRecordsCount || 0}
              icon={FileText}
              color="emerald"
              subtitle="Diagnostic history"
            />
            <StatCard
              title="PENDING INVOICES"
              value={stats?.extraMetrics?.pendingBills || 0}
              icon={CreditCard}
              color="amber"
              subtitle="Awaiting payment"
            />
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>My Recent Appointments</h3>
              <Link to="/patient/appointments" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{a.doctorName}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.doctorSpecialization}</div>
                      </td>
                      <td>{a.departmentName}</td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.startTime} - {a.endTime}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to="/patient/appointments" className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {upcomingAppointments.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        You have no appointments scheduled yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
