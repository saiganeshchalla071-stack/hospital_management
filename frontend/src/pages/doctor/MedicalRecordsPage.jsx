import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { medicalRecordApi } from '../../api/medicalRecordApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileText, Calendar } from 'lucide-react';

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Doctors can fetch their appointments and associated medical records
    appointmentApi.getMyAppointments().then(async (res) => {
      if (res.success) {
        const completed = res.data.filter((a) => a.status === 'COMPLETED');
        const fetchedRecords = [];
        for (const appt of completed) {
          try {
            const recRes = await medicalRecordApi.getByPatientId(appt.patientId);
            if (recRes.success && recRes.data) {
              const matched = recRes.data.filter((r) => r.appointmentId === appt.id);
              fetchedRecords.push(...matched);
            }
          } catch (e) {}
        }
        setRecords(fetchedRecords);
      }
    }).catch((err) => {
      showToast(err.message || 'Error loading clinical records', 'error');
    }).finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      header: 'Record ID',
      accessor: 'id',
      render: (r) => <strong>MED-{String(r.id).padStart(5, '0')}</strong>,
    },
    {
      header: 'Patient Name',
      accessor: 'patientName',
      render: (r) => <strong style={{ color: '#0f172a' }}>{r.patientName}</strong>,
    },
    {
      header: 'Diagnosis',
      accessor: 'diagnosis',
      render: (r) => <span style={{ color: '#0284c7', fontWeight: 600 }}>{r.diagnosis}</span>,
    },
    {
      header: 'Clinical Notes',
      accessor: 'clinicalNotes',
      render: (r) => <span style={{ fontSize: '0.85rem', color: '#475569' }}>{r.clinicalNotes}</span>,
    },
    { header: 'Recorded Date', accessor: 'createdAt', render: (r) => r.createdAt?.slice(0, 10) || 'Recent' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Clinical Medical Records</h1>
            <p style={{ color: '#64748b' }}>Consultation histories, physical exam notes, and clinical diagnoses</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Retrieving clinical records..." />
          ) : (
            <DataTable
              columns={columns}
              data={records}
              searchPlaceholder="Search records by patient or diagnosis..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
