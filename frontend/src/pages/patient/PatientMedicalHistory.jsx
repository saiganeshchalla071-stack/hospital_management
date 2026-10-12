import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { medicalRecordApi } from '../../api/medicalRecordApi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileText, Calendar } from 'lucide-react';

const PatientMedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentApi.getMyAppointments().then(async (res) => {
      if (res.success && res.data.length > 0) {
        const patientId = res.data[0].patientId;
        try {
          const mRes = await medicalRecordApi.getByPatientId(patientId);
          if (mRes.success) setRecords(mRes.data);
        } catch (e) {}
      }
    }).finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      header: 'Record #',
      accessor: 'id',
      render: (r) => <strong>MED-{String(r.id).padStart(5, '0')}</strong>,
    },
    { header: 'Attending Clinician', accessor: 'doctorName' },
    {
      header: 'Primary Diagnosis',
      accessor: 'diagnosis',
      render: (r) => <strong style={{ color: '#0284c7' }}>{r.diagnosis}</strong>,
    },
    {
      header: 'Clinical Findings & Vitals',
      accessor: 'clinicalNotes',
      render: (r) => <span style={{ fontSize: '0.875rem', color: '#475569' }}>{r.clinicalNotes}</span>,
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (r) => r.createdAt?.slice(0, 10) || 'Recent',
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>My Medical Records & History</h1>
            <p style={{ color: '#64748b' }}>Diagnostic evaluations, consultation summaries, and recorded clinical notes</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your medical history..." />
          ) : (
            <DataTable
              columns={columns}
              data={records}
              searchPlaceholder="Search medical records by doctor or diagnosis..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
