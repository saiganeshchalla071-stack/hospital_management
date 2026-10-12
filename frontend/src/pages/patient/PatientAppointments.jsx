import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Ban, Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getMyAppointments();
      if (res.success) setAppointments(res.data);
    } catch (err) {
      showToast(err.message || 'Error loading appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentApi.updateStatus(id, 'CANCELLED');
      showToast('Appointment successfully cancelled', 'success');
      loadAppointments();
    } catch (err) {
      showToast(err.message || 'Cancellation failed', 'error');
    }
  };

  const columns = [
    {
      header: 'Specialist Doctor',
      accessor: 'doctorName',
      render: (a) => (
        <div>
          <strong style={{ color: '#0284c7' }}>{a.doctorName}</strong>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.departmentName} &bull; {a.doctorSpecialization}</div>
        </div>
      ),
    },
    { header: 'Appointment Date', accessor: 'appointmentDate' },
    {
      header: 'Time Slot',
      render: (a) => `${a.startTime} - ${a.endTime}`,
    },
    { header: 'Reason', accessor: 'reason', render: (a) => a.reason || 'General checkup' },
    {
      header: 'Status',
      accessor: 'status',
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (a) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          {(a.status === 'PENDING' || a.status === 'APPROVED') ? (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleCancel(a.id)}
            >
              <Ban size={14} /> Cancel
            </button>
          ) : (
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{a.status}</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem' }}>My Consultation Appointments</h1>
              <p style={{ color: '#64748b' }}>Track upcoming hospital visits, past clinical consultations, and statuses</p>
            </div>
            <Link to="/patient/book-appointment" className="btn btn-primary">
              <PlusCircle size={16} /> Book Appointment
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Retrieving your appointments..." />
          ) : (
            <DataTable
              columns={columns}
              data={appointments}
              searchPlaceholder="Search by doctor, date, or status..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
