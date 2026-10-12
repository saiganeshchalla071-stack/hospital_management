import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';
import { departmentApi } from '../../api/departmentApi';
import { appointmentApi } from '../../api/appointmentApi';
import { useToast } from '../../context/ToastContext';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Calendar, Clock, Stethoscope, DollarSign, CheckCircle2 } from 'lucide-react';

const BookAppointmentPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctorId');

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Preset available clinical consultation slots
  const standardSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  useEffect(() => {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    setAppointmentDate(today);

    Promise.all([
      departmentApi.getAll(),
      doctorApi.getActive(),
    ]).then(([deptRes, docRes]) => {
      if (deptRes.success) setDepartments(deptRes.data);
      if (docRes.success) {
        setDoctors(docRes.data);
        if (!selectedDoctorId && docRes.data.length > 0) {
          setSelectedDoctorId(docRes.data[0].id);
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  const filteredDoctors = selectedDept
    ? doctors.filter((d) => String(d.departmentId) === String(selectedDept))
    : doctors;

  const currentDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !appointmentDate || !startTime) {
      showToast('Please specify all booking details', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await appointmentApi.book({
        doctorId: parseInt(selectedDoctorId),
        appointmentDate,
        startTime: startTime + ':00',
        reason,
      });

      showToast('Appointment successfully scheduled and sent for review!', 'success');
      navigate('/patient/appointments');
    } catch (err) {
      showToast(err.message || 'Booking conflict or error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Book a Doctor Appointment</h1>
            <p style={{ color: '#64748b' }}>Select your specialist physician, preferred date, and consultation time slot</p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading doctors and schedule..." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(280px, 1fr)', gap: '2rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Clinical Department</label>
                      <select
                        className="form-control"
                        value={selectedDept}
                        onChange={(e) => {
                          setSelectedDept(e.target.value);
                          const matching = doctors.filter((d) => !e.target.value || String(d.departmentId) === String(e.target.value));
                          if (matching.length > 0) setSelectedDoctorId(matching[0].id);
                        }}
                      >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Select Specialist Doctor *</label>
                      <select
                        className="form-control"
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        required
                      >
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.fullName} ({doc.specialization})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Appointment Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        min={minDate}
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Time Slot *</label>
                      <select
                        className="form-control"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      >
                        {standardSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot} - {slot.slice(0, 2)}:30</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reason for Consultation / Symptoms</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Briefly describe your health symptoms, past history, or reason for appointment"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
                    disabled={submitting}
                  >
                    {submitting ? 'Confirming Appointment...' : 'Confirm Appointment Booking'}
                  </button>
                </form>
              </div>

              {/* Doctor Details Summary Card */}
              {currentDoctor && (
                <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="user-avatar" style={{ width: '52px', height: '52px', fontSize: '1.2rem' }}>
                      {currentDoctor.fullName?.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem' }}>{currentDoctor.fullName}</h3>
                      <div style={{ color: '#0284c7', fontSize: '0.85rem', fontWeight: 600 }}>{currentDoctor.specialization}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{currentDoctor.departmentName}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1.5rem', color: '#475569' }}>
                    <div><strong>Qualifications:</strong> {currentDoctor.qualification}</div>
                    <div><strong>Clinical Experience:</strong> {currentDoctor.experienceYears} Years</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginTop: '0.5rem' }}>
                      <DollarSign size={20} color="#10b981" />
                      <span>${currentDoctor.consultationFee} Consultation</span>
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                    💡 <em>Appointments booked are automatically locked to avoid scheduling collisions. Invoices are billed upon confirmation.</em>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
