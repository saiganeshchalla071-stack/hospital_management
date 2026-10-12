import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { medicalRecordApi } from '../../api/medicalRecordApi';
import { prescriptionApi } from '../../api/prescriptionApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Check, X, FileText, Pill, Plus, Trash2 } from 'lucide-react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [recordModalAppt, setRecordModalAppt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  const [prescModalRecordId, setPrescModalRecordId] = useState(null);
  const [prescInstructions, setPrescInstructions] = useState('');
  const [prescItems, setPrescItems] = useState([
    { medicineName: '', dosage: '', frequency: '', duration: '', additionalInstructions: '' }
  ]);

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

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentApi.updateStatus(id, status);
      showToast(`Appointment status updated to ${status}`, 'success');
      loadAppointments();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleSaveMedicalRecord = async (e) => {
    e.preventDefault();
    if (!recordModalAppt) return;
    try {
      const res = await medicalRecordApi.create({
        appointmentId: recordModalAppt.id,
        diagnosis,
        clinicalNotes,
      });
      showToast('Medical diagnosis recorded and consultation marked Completed!', 'success');
      const createdRecordId = res.data?.id;
      setRecordModalAppt(null);
      setDiagnosis('');
      setClinicalNotes('');
      loadAppointments();

      // Offer to prescribe medication immediately
      if (createdRecordId) {
        setPrescModalRecordId(createdRecordId);
      }
    } catch (err) {
      showToast(err.message || 'Error recording diagnosis', 'error');
    }
  };

  const handleAddPrescItem = () => {
    setPrescItems([
      ...prescItems,
      { medicineName: '', dosage: '', frequency: '', duration: '', additionalInstructions: '' }
    ]);
  };

  const handleRemovePrescItem = (index) => {
    setPrescItems(prescItems.filter((_, i) => i !== index));
  };

  const handlePrescItemChange = (index, field, value) => {
    const updated = [...prescItems];
    updated[index][field] = value;
    setPrescItems(updated);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!prescModalRecordId) return;

    const validItems = prescItems.filter((item) => item.medicineName.trim());
    if (validItems.length === 0) {
      showToast('Please provide at least one medication', 'error');
      return;
    }

    try {
      await prescriptionApi.create({
        medicalRecordId: prescModalRecordId,
        instructions: prescInstructions,
        items: validItems,
      });
      showToast('Electronic prescription issued successfully!', 'success');
      setPrescModalRecordId(null);
      setPrescInstructions('');
      setPrescItems([{ medicineName: '', dosage: '', frequency: '', duration: '', additionalInstructions: '' }]);
    } catch (err) {
      showToast(err.message || 'Error creating prescription', 'error');
    }
  };

  const columns = [
    {
      header: 'Patient Name',
      accessor: 'patientName',
      render: (a) => (
        <div>
          <strong style={{ color: '#0f172a' }}>{a.patientName}</strong>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.patientPhone || a.patientEmail}</div>
        </div>
      ),
    },
    { header: 'Date', accessor: 'appointmentDate' },
    {
      header: 'Time',
      render: (a) => `${a.startTime} - ${a.endTime}`,
    },
    { header: 'Chief Complaint', accessor: 'reason' },
    {
      header: 'Status',
      accessor: 'status',
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      header: 'Clinical Actions',
      align: 'right',
      render: (a) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {a.status === 'PENDING' && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleUpdateStatus(a.id, 'APPROVED')}
              >
                <Check size={14} /> Accept
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleUpdateStatus(a.id, 'REJECTED')}
              >
                <X size={14} /> Decline
              </button>
            </>
          )}

          {a.status === 'APPROVED' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setRecordModalAppt(a);
                setDiagnosis('');
                setClinicalNotes('');
              }}
            >
              <FileText size={14} /> Record Diagnosis
            </button>
          )}

          {a.status === 'COMPLETED' && (
            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>Completed</span>
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
            <h1 style={{ fontSize: '1.85rem' }}>My Clinical Schedule</h1>
            <p style={{ color: '#64748b' }}>Review patient appointments, conduct consultations, and write diagnoses</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your appointments..." />
          ) : (
            <DataTable
              columns={columns}
              data={appointments}
              searchPlaceholder="Search patients, dates, or complaints..."
            />
          )}

          {/* Record Medical Diagnosis Modal */}
          <Modal
            isOpen={!!recordModalAppt}
            onClose={() => setRecordModalAppt(null)}
            title={`Clinical Consultation: ${recordModalAppt?.patientName}`}
          >
            <form onSubmit={handleSaveMedicalRecord}>
              <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <div><strong>Patient Complaint:</strong> {recordModalAppt?.reason || 'Routine consultation'}</div>
                <div><strong>Date & Time:</strong> {recordModalAppt?.appointmentDate} at {recordModalAppt?.startTime}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Diagnosis *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Enter medical diagnosis (e.g. Acute Bronchitis, Essential Hypertension Stage 1)"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Notes & Treatment Plan</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Vitals (BP, HR, Temp), physical examination findings, recommendations"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setRecordModalAppt(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Medical Record & Complete Visit
                </button>
              </div>
            </form>
          </Modal>

          {/* Issue Prescription Modal */}
          <Modal
            isOpen={!!prescModalRecordId}
            onClose={() => setPrescModalRecordId(null)}
            title="Issue Electronic Prescription"
          >
            <form onSubmit={handleSavePrescription}>
              <div className="form-group">
                <label className="form-label">General Advice & Dietary Instructions</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Take after meals, drink plenty of water, avoid strenuous activity"
                  value={prescInstructions}
                  onChange={(e) => setPrescInstructions(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Medications List</strong>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddPrescItem}>
                    <Plus size={14} /> Add Medicine
                  </button>
                </div>

                {prescItems.map((item, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Drug Name (e.g. Amoxicillin)"
                        value={item.medicineName}
                        onChange={(e) => handlePrescItemChange(idx, 'medicineName', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Dosage (500mg)"
                        value={item.dosage}
                        onChange={(e) => handlePrescItemChange(idx, 'dosage', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Freq (1-0-1)"
                        value={item.frequency}
                        onChange={(e) => handlePrescItemChange(idx, 'frequency', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Duration (5 days)"
                        value={item.duration}
                        onChange={(e) => handlePrescItemChange(idx, 'duration', e.target.value)}
                        required
                      />
                      {prescItems.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemovePrescItem(idx)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setPrescModalRecordId(null)}>
                  Skip Prescription
                </button>
                <button type="submit" className="btn btn-primary">
                  Sign & Issue Prescription
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
