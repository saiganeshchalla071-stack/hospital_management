import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Check, X, CalendarCheck, Ban } from 'lucide-react';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getAll();
      if (res.success) setAppointments(res.data);
    } catch (err) {
      showToast(err.message || 'Error loading appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentApi.updateStatus(id, newStatus);
      showToast(`Appointment marked as ${newStatus}`, 'success');
      loadAppointments();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const columns = [
    {
      header: 'Patient',
      accessor: 'patientName',
      render: (a) => (
        <div>
          <strong style={{ color: '#0f172a' }}>{a.patientName}</strong>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.patientPhone || a.patientEmail}</div>
        </div>
      ),
    },
    {
      header: 'Doctor',
      accessor: 'doctorName',
      render: (a) => (
        <div>
          <strong style={{ color: '#0284c7' }}>{a.doctorName}</strong>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.departmentName}</div>
        </div>
      ),
    },
    { header: 'Date', accessor: 'appointmentDate' },
    {
      header: 'Time',
      render: (a) => `${a.startTime} - ${a.endTime}`,
    },
    {
      header: 'Reason / Symptoms',
      accessor: 'reason',
      render: (a) => <span style={{ fontSize: '0.85rem', color: '#475569' }}>{a.reason || 'General checkup'}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (a) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {a.status === 'PENDING' && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleUpdateStatus(a.id, 'APPROVED')}
                title="Approve appointment"
              >
                <Check size={14} /> Approve
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleUpdateStatus(a.id, 'REJECTED')}
                title="Reject appointment"
              >
                <X size={14} /> Reject
              </button>
            </>
          )}

          {a.status === 'APPROVED' && (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleUpdateStatus(a.id, 'COMPLETED')}
                title="Mark completed"
              >
                <CalendarCheck size={14} /> Complete
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleUpdateStatus(a.id, 'CANCELLED')}
                title="Cancel appointment"
              >
                <Ban size={14} /> Cancel
              </button>
            </>
          )}

          {(a.status === 'COMPLETED' || a.status === 'CANCELLED' || a.status === 'REJECTED') && (
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Finalized</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Appointment Management</h1>
            <p style={{ color: '#64748b' }}>Hospital-wide appointment queue, approvals, and rescheduling</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading hospital appointments..." />
          ) : (
            <DataTable
              columns={columns}
              data={appointments}
              searchPlaceholder="Search by patient, doctor, date, or status..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
