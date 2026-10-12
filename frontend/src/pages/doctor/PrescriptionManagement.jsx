import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { prescriptionApi } from '../../api/prescriptionApi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Pill, Eye } from 'lucide-react';

const PrescriptionManagement = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresc, setSelectedPresc] = useState(null);

  useEffect(() => {
    appointmentApi.getMyAppointments().then(async (res) => {
      if (res.success) {
        const completed = res.data.filter((a) => a.status === 'COMPLETED');
        const fetchedPrescriptions = [];
        for (const appt of completed) {
          try {
            const pRes = await prescriptionApi.getByPatientId(appt.patientId);
            if (pRes.success && pRes.data) {
              fetchedPrescriptions.push(...pRes.data);
            }
          } catch (e) {}
        }
        // Unique by id
        const unique = Array.from(new Map(fetchedPrescriptions.map((p) => [p.id, p])).values());
        setPrescriptions(unique);
      }
    }).finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      header: 'Script #',
      accessor: 'id',
      render: (p) => <strong>RX-{String(p.id).padStart(5, '0')}</strong>,
    },
    {
      header: 'Patient Name',
      accessor: 'patientName',
      render: (p) => <strong style={{ color: '#0f172a' }}>{p.patientName}</strong>,
    },
    { header: 'Prescription Date', accessor: 'prescriptionDate' },
    {
      header: 'Medications',
      render: (p) => (
        <span>
          {p.items?.map((i) => i.medicineName).join(', ') || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setSelectedPresc(p)}
        >
          <Eye size={14} /> View Script
        </button>
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
            <h1 style={{ fontSize: '1.85rem' }}>Prescriptions Issued</h1>
            <p style={{ color: '#64748b' }}>Digital prescriptions, pharmacotherapy dosages, and directions</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading prescription records..." />
          ) : (
            <DataTable
              columns={columns}
              data={prescriptions}
              searchPlaceholder="Search scripts by patient or drug name..."
            />
          )}

          {/* View Prescription Modal */}
          <Modal
            isOpen={!!selectedPresc}
            onClose={() => setSelectedPresc(null)}
            title={`Electronic Prescription: RX-${String(selectedPresc?.id).padStart(5, '0')}`}
          >
            {selectedPresc && (
              <div>
                <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div><strong>Patient:</strong> {selectedPresc.patientName}</div>
                  <div><strong>Date Issued:</strong> {selectedPresc.prescriptionDate}</div>
                  <div style={{ marginTop: '0.5rem' }}><strong>Clinical Instructions:</strong> {selectedPresc.instructions || 'Follow standard dosage'}</div>
                </div>

                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Prescribed Medication Regimen</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedPresc.items?.map((item, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <strong style={{ color: '#0284c7' }}>{item.medicineName}</strong>
                        <span className="badge badge-approved">{item.dosage}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                        Schedule: <strong>{item.frequency}</strong> &bull; Duration: <strong>{item.duration}</strong>
                      </div>
                      {item.additionalInstructions && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                          Note: {item.additionalInstructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManagement;
