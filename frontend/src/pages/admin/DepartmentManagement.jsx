import React, { useState, useEffect } from 'react';
import { departmentApi } from '../../api/departmentApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', location: '' });
  const { showToast } = useToast();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentApi.getAll();
      if (res.success) setDepartments(res.data);
    } catch (err) {
      showToast(err.message || 'Error loading departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingDept(null);
    setFormData({ name: '', description: '', location: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      description: dept.description || '',
      location: dept.location || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentApi.update(editingDept.id, formData);
        showToast('Department updated successfully', 'success');
      } else {
        await departmentApi.create(formData);
        showToast('Department created successfully', 'success');
      }
      setIsModalOpen(false);
      loadDepartments();
    } catch (err) {
      showToast(err.message || 'Error saving department', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete department '${name}'?`)) return;
    try {
      await departmentApi.delete(id);
      showToast('Department deleted successfully', 'success');
      loadDepartments();
    } catch (err) {
      showToast(err.message || 'Cannot delete department', 'error');
    }
  };

  const columns = [
    {
      header: 'Department Name',
      accessor: 'name',
      render: (d) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Building2 size={18} color="#0284c7" />
          <strong style={{ color: '#0f172a' }}>{d.name}</strong>
        </div>
      ),
    },
    { header: 'Location / Ward', accessor: 'location' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Actions',
      align: 'right',
      render: (d) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(d)}>
            <Edit size={14} /> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id, d.name)}>
            <Trash2 size={14} /> Delete
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
              <h1 style={{ fontSize: '1.85rem' }}>Department Management</h1>
              <p style={{ color: '#64748b' }}>Configure clinical wings, facilities, and physical hospital locations</p>
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} /> Add Department
            </button>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading departments..." />
          ) : (
            <DataTable
              columns={columns}
              data={departments}
              searchPlaceholder="Search departments by name or location..."
            />
          )}

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingDept ? 'Edit Clinical Department' : 'Create New Department'}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Department Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Oncology, Ophthalmology"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location / Wing / Floor</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Wing B - 3rd Floor, Suite 301"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Services</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Overview of specialized clinical services"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDept ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
