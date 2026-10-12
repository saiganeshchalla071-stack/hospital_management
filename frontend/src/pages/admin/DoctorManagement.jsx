import React, { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';
import { departmentApi } from '../../api/departmentApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UserPlus, Edit, Power, Check, X } from 'lucide-react';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    departmentId: '',
    specialization: '',
    qualification: '',
    experienceYears: 0,
    consultationFee: 100,
    biography: '',
  });

  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docRes, deptRes] = await Promise.all([
        doctorApi.getAll(),
        departmentApi.getAll(),
      ]);
      if (docRes.success) setDoctors(docRes.data);
      if (deptRes.success) setDepartments(deptRes.data);
    } catch (err) {
      showToast(err.message || 'Error loading doctor records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      departmentId: departments[0]?.id || '',
      specialization: '',
      qualification: '',
      experienceYears: 0,
      consultationFee: 100,
      biography: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      fullName: doc.fullName || '',
      email: doc.email || '',
      password: '',
      phone: doc.phone || '',
      departmentId: doc.departmentId || '',
      specialization: doc.specialization || '',
      qualification: doc.qualification || '',
      experienceYears: doc.experienceYears || 0,
      consultationFee: doc.consultationFee || 100,
      biography: doc.biography || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await doctorApi.update(editingDoctor.id, formData);
        showToast('Doctor profile updated successfully', 'success');
      } else {
        await doctorApi.create(formData);
        showToast('New doctor added successfully', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message || 'Error saving doctor', 'error');
    }
  };

  const handleToggleStatus = async (doc) => {
    try {
      const newStatus = !doc.enabled;
      await doctorApi.toggleStatus(doc.id, newStatus);
      showToast(`Doctor account marked as ${newStatus ? 'Active' : 'Inactive'}`, 'success');
      loadData();
    } catch (err) {
      showToast(err.message || 'Error changing status', 'error');
    }
  };

  const columns = [
    {
      header: 'Doctor Name',
      accessor: 'fullName',
      render: (doc) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
            {doc.fullName?.charAt(0)}
          </div>
          <div>
            <strong style={{ color: '#0f172a' }}>{doc.fullName}</strong>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{doc.email}</div>
          </div>
        </div>
      ),
    },
    { header: 'Department', accessor: 'departmentName' },
    { header: 'Specialization', accessor: 'specialization' },
    { header: 'Experience', render: (doc) => `${doc.experienceYears} yrs` },
    { header: 'Fee', render: (doc) => `$${doc.consultationFee}` },
    {
      header: 'Status',
      render: (doc) => <StatusBadge status={doc.enabled ? 'Active' : 'Inactive'} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (doc) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => openEditModal(doc)}
            title="Edit doctor"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            className={`btn ${doc.enabled ? 'btn-danger' : 'btn-success'} btn-sm`}
            onClick={() => handleToggleStatus(doc)}
            title={doc.enabled ? 'Deactivate doctor' : 'Activate doctor'}
          >
            <Power size={14} /> {doc.enabled ? 'Deactivate' : 'Activate'}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem' }}>Doctor Management</h1>
              <p style={{ color: '#64748b' }}>Manage medical staff, credential profiles, and active statuses</p>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              <UserPlus size={18} /> Add New Doctor
            </button>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading doctors..." />
          ) : (
            <DataTable
              columns={columns}
              data={doctors}
              searchPlaceholder="Search by doctor, department, or specialty..."
            />
          )}

          {/* Add / Edit Doctor Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor Account'}
          >
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    {editingDoctor ? 'New Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingDoctor}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    className="form-control"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Specialization *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Cardiothoracic Surgery"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Qualification *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MBBS, MD"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience (Yrs)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Fee ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Biography / Background</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDoctor ? 'Update Doctor' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DoctorManagement;
