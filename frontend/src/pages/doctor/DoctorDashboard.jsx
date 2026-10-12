import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../api/dashboardApi';
import { appointmentApi } from '../../api/appointmentApi';
import { Calendar, Clock, Users, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getDoctorStats(),
      appointmentApi.getMyAppointments(),
    ]).then(([statsRes, apptRes]) => {
      if (statsRes.success) setStats(statsRes.data);
      if (apptRes.success) setAppointments(apptRes.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <LoadingSpinner message="Loading clinician portal..." />
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
              <h1 style={{ fontSize: '1.85rem' }}>Doctor Clinical Workstation</h1>
              <p style={{ color: '#64748b' }}>Today's schedule, patient consultations, and pending diagnostic notes</p>
            </div>
            <Link to="/doctor/appointments" className="btn btn-primary btn-sm">
              <Calendar size={16} /> View Full Schedule
            </Link>
          </div>

          <div className="stats-grid">
            <StatCard
              title="TODAY'S VISITS"
              value={stats?.extraMetrics?.todayAppointments || 0}
              icon={Clock}
              color="blue"
              subtitle="Scheduled for today"
            />
            <StatCard
              title="UPCOMING APPOINTMENTS"
              value={stats?.extraMetrics?.upcomingAppointments || 0}
              icon={Calendar}
              color="teal"
              subtitle="Confirmed forward slots"
            />
            <StatCard
              title="COMPLETED CONSULTATIONS"
              value={stats?.completedAppointments || 0}
              icon={CheckCircle2}
              color="emerald"
              subtitle="With clinical records"
            />
            <StatCard
              title="ISSUED PRESCRIPTIONS"
              value={stats?.extraMetrics?.totalPrescriptions || 0}
              icon={FileText}
              color="amber"
              subtitle="Electronic scripts"
            />
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Recent Assigned Appointments</h3>
              <Link to="/doctor/appointments" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Slot</th>
                    <th>Reason / Chief Complaint</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.patientName}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.patientPhone}</div>
                      </td>
                      <td>{a.appointmentDate}</td>
                      <td>{a.startTime} - {a.endTime}</td>
                      <td>{a.reason || 'Routine consultation'}</td>
                      <td><StatusBadge status={a.status} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to="/doctor/appointments" className="btn btn-secondary btn-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No appointments currently scheduled.
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

export default DoctorDashboard;
