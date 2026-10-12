import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import { billingApi } from '../../api/billingApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const PatientBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [processing, setProcessing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getMyAppointments();
      if (res.success && res.data.length > 0) {
        const patientId = res.data[0].patientId;
        const bRes = await billingApi.getByPatientId(patientId);
        if (bRes.success) setBills(bRes.data);
      }
    } catch (err) {
      showToast(err.message || 'Error loading bills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = async (e) => {
    e.preventDefault();
    if (!selectedBill) return;
    try {
      setProcessing(true);
      await billingApi.updatePaymentStatus(selectedBill.id, 'PAID', paymentMethod);
      showToast(`Payment of $${selectedBill.amount} completed successfully via ${paymentMethod}!`, 'success');
      setSelectedBill(null);
      loadBills();
    } catch (err) {
      showToast(err.message || 'Payment processing failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'id',
      render: (b) => <strong>INV-{String(b.id).padStart(5, '0')}</strong>,
    },
    { header: 'Attending Doctor', accessor: 'doctorName' },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (b) => <span style={{ fontWeight: 700, color: '#0f172a' }}>${b.amount}</span>,
    },
    { header: 'Billing Date', accessor: 'billingDate' },
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
              className="btn btn-primary btn-sm"
              onClick={() => setSelectedBill(b)}
            >
              <CreditCard size={14} /> Pay Now
            </button>
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>Paid &bull; {b.paymentMethod || 'CARD'}</span>
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
            <h1 style={{ fontSize: '1.85rem' }}>My Invoices & Medical Bills</h1>
            <p style={{ color: '#64748b' }}>Consultation fees, insurance tracking, and online checkout</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Retrieving your invoices..." />
          ) : (
            <DataTable
              columns={columns}
              data={bills}
              searchPlaceholder="Search invoices..."
            />
          )}

          {/* Checkout Modal */}
          <Modal
            isOpen={!!selectedBill}
            onClose={() => setSelectedBill(null)}
            title="Simulated Payment Checkout"
          >
            {selectedBill && (
              <form onSubmit={handlePayBill}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Service:</span>
                    <strong>{selectedBill.description || 'Specialist Consultation'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Invoice Ref:</span>
                    <strong>INV-{String(selectedBill.id).padStart(5, '0')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginTop: '0.5rem' }}>
                    <span>Amount Due:</span>
                    <strong style={{ color: '#10b981' }}>${selectedBill.amount}</strong>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="CARD">Debit / Credit Card (Simulated)</option>
                    <option value="UPI">UPI Instant Pay (Simulated)</option>
                    <option value="INSURANCE">Insurance Copay</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedBill(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={processing}>
                    {processing ? 'Processing Payment...' : `Authorize $${selectedBill.amount} Payment`}
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

export default PatientBills;
