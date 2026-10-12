import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { prescriptionApi } from '../../api/prescriptionApi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Pill, Eye, FileText } from 'lucide-react';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPresc, setSelectedPresc] = useState(null);

  useEffect(() => {
    appointmentApi.getMyAppointments().then(async (res) => {
      if (res.success && res.data.length > 0) {
        const patientId = res.data[0].patientId;
        try {
          const pRes = await prescriptionApi.getByPatientId(patientId);
          if (pRes.success) setPrescriptions(pRes.data);
        } catch (e) {}
      }
    }).finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      header: 'Prescription #',
      accessor: 'id',
      render: (p) => <strong>RX-{String(p.id).padStart(5, '0')}</strong>,
    },
    { header: 'Prescribing Doctor', accessor: 'doctorName' },
    { header: 'Date', accessor: 'prescriptionDate' },
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
          <Eye size={14} /> View Details
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
            <h1 style={{ fontSize: '1.85rem' }}>My Electronic Prescriptions</h1>
            <p style={{ color: '#64748b' }}>Active and past medications prescribed by your attending physicians</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Retrieving your prescriptions..." />
          ) : (
            <DataTable
              columns={columns}
              data={prescriptions}
              searchPlaceholder="Search prescriptions by doctor or medication..."
            />
          )}

          {/* Prescription View Modal */}
          <Modal
            isOpen={!!selectedPresc}
            onClose={() => setSelectedPresc(null)}
            title={`Prescription Details (RX-${String(selectedPresc?.id).padStart(5, '0')})`}
          >
            {selectedPresc && (
              <div>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div><strong>Doctor:</strong> {selectedPresc.doctorName}</div>
                  <div><strong>Issue Date:</strong> {selectedPresc.prescriptionDate}</div>
                  <div style={{ marginTop: '0.5rem' }}><strong>Physician Directions:</strong> {selectedPresc.instructions || 'Follow package instructions'}</div>
                </div>

                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Prescribed Drugs & Dosages</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedPresc.items?.map((item, idx) => (
                    <div key={idx} style={{ padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <strong style={{ color: '#0284c7', fontSize: '1rem' }}>{item.medicineName}</strong>
                        <span className="badge badge-approved">{item.dosage}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                        Timing: <strong>{item.frequency}</strong> &bull; Course Duration: <strong>{item.duration}</strong>
                      </div>
                      {item.additionalInstructions && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                          Special Note: {item.additionalInstructions}
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

export default PatientPrescriptions;
