import React, { useState, useEffect } from 'react';
import { billingApi } from '../../api/billingApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const BillingManagement = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const { showToast } = useToast();

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    setLoading(true);
    try {
      const res = await billingApi.getAll();
      if (res.success) setBills(res.data);
    } catch (err) {
      showToast(err.message || 'Error loading billing records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!selectedBill) return;
    try {
      await billingApi.updatePaymentStatus(selectedBill.id, 'PAID', paymentMethod);
      showToast(`Invoice #${selectedBill.id} marked as PAID via ${paymentMethod}`, 'success');
      setSelectedBill(null);
      loadBills();
    } catch (err) {
      showToast(err.message || 'Payment update failed', 'error');
    }
  };

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'id',
      render: (b) => <strong>INV-{String(b.id).padStart(5, '0')}</strong>,
    },
    {
      header: 'Patient',
      accessor: 'patientName',
      render: (b) => <strong style={{ color: '#0f172a' }}>{b.patientName}</strong>,
    },
    { header: 'Attending Doctor', accessor: 'doctorName' },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (b) => <span style={{ fontWeight: 700, color: '#0f172a' }}>${b.amount}</span>,
    },
    { header: 'Billing Date', accessor: 'billingDate' },
    {
      header: 'Method',
      accessor: 'paymentMethod',
      render: (b) => <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>{b.paymentMethod || 'CASH'}</span>,
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      render: (b) => <StatusBadge status={b.paymentStatus} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (b) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {b.paymentStatus === 'PENDING' ? (
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                setSelectedBill(b);
                setPaymentMethod(b.paymentMethod || 'CARD');
              }}
            >
              <CheckCircle2 size={14} /> Settle Bill
            </button>
          ) : (
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Settled</span>
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
            <h1 style={{ fontSize: '1.85rem' }}>Hospital Invoices & Billing</h1>
            <p style={{ color: '#64748b' }}>Track consultation invoices, settle payments, and verify cash flows</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading hospital invoices..." />
          ) : (
            <DataTable
              columns={columns}
              data={bills}
              searchPlaceholder="Search invoices by patient, doctor, or ID..."
            />
          )}

          {/* Settle Payment Modal */}
          <Modal
            isOpen={!!selectedBill}
            onClose={() => setSelectedBill(null)}
            title="Settle Outstanding Invoice"
          >
            {selectedBill && (
              <form onSubmit={handleUpdatePayment}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Invoice Number:</span>
                    <strong>INV-{String(selectedBill.id).padStart(5, '0')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Patient Name:</span>
                    <strong>{selectedBill.patientName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                    <span>Total Amount Due:</span>
                    <strong style={{ color: '#10b981' }}>${selectedBill.amount}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Tender Method</label>
                  <select
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="CARD">Credit / Debit Card</option>
                    <option value="UPI">UPI / Instant Digital Payment</option>
                    <option value="CASH">Cash Counter Payment</option>
                    <option value="INSURANCE">Health Insurance Claim</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedBill(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Confirm & Settle Payment
                  </button>
                </div>
              </form>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;
