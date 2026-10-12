import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Eye, Power, User } from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await patientApi.getAll();
      if (res.success) setPatients(res.data);
    } catch (err) {
      showToast(err.message || 'Error loading patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (patient) => {
    try {
      const newStatus = !patient.enabled;
      await patientApi.toggleStatus(patient.id, newStatus);
      showToast(`Patient account status updated`, 'success');
      loadPatients();
    } catch (err) {
      showToast(err.message || 'Error updating status', 'error');
    }
  };

  const columns = [
    {
      header: 'Patient Name',
      accessor: 'fullName',
      render: (p) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
            {p.fullName?.charAt(0)}
          </div>
          <div>
            <strong style={{ color: '#0f172a' }}>{p.fullName}</strong>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.email}</div>
          </div>
        </div>
      ),
    },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Date of Birth', accessor: 'dateOfBirth' },
    { header: 'Emergency Contact', accessor: 'emergencyContact' },
    {
      header: 'Status',
      render: (p) => <StatusBadge status={p.enabled ? 'Active' : 'Inactive'} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (p) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedPatient(p)}
          >
            <Eye size={14} /> Details
          </button>
          <button
            className={`btn ${p.enabled ? 'btn-danger' : 'btn-success'} btn-sm`}
            onClick={() => handleToggleStatus(p)}
          >
            <Power size={14} /> {p.enabled ? 'Deactivate' : 'Activate'}
          </button>
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
            <h1 style={{ fontSize: '1.85rem' }}>Patient Management</h1>
            <p style={{ color: '#64748b' }}>Patient registry, verified contact data, and portal permissions</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading patient roster..." />
          ) : (
            <DataTable
              columns={columns}
              data={patients}
              searchPlaceholder="Search patients by name, email, or phone..."
            />
          )}

          {/* Patient Details Modal */}
          <Modal
            isOpen={!!selectedPatient}
            onClose={() => setSelectedPatient(null)}
            title="Patient Clinical Profile"
          >
            {selectedPatient && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                    {selectedPatient.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{selectedPatient.fullName}</h3>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{selectedPatient.email}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                  <div><strong>Phone:</strong> {selectedPatient.phone || 'N/A'}</div>
                  <div><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth || 'N/A'}</div>
                  <div><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact || 'N/A'}</div>
                  <div><strong>Account Status:</strong> <StatusBadge status={selectedPatient.enabled ? 'Active' : 'Inactive'} /></div>
                </div>

                <div style={{ fontSize: '0.9rem' }}>
                  <strong>Residential Address:</strong>
                  <p style={{ color: '#475569', marginTop: '0.25rem' }}>{selectedPatient.address || 'No address registered'}</p>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
