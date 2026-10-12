import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Calendar,
  FileText,
  CreditCard,
  BarChart3,
  Stethoscope,
  User,
  LogOut,
  PlusCircle,
  Clock,
  Pill,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
            <Stethoscope size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>CarePulse Portal</div>
            <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>{role} PORTAL</div>
          </div>
        </div>
      </div>

      <ul className="sidebar-menu">
        {role === 'ADMIN' && (
          <>
            <li className="sidebar-item">
              <NavLink to="/admin/dashboard" end className={({ isActive }) => (isActive ? 'active' : '')}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/doctors" className={({ isActive }) => (isActive ? 'active' : '')}>
                <UserCheck size={18} /> Doctors
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/patients" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Users size={18} /> Patients
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/departments" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Building2 size={18} /> Departments
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/appointments" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Calendar size={18} /> Appointments
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/billing" className={({ isActive }) => (isActive ? 'active' : '')}>
                <CreditCard size={18} /> Invoices & Billing
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
                <BarChart3 size={18} /> System Reports
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                <User size={18} /> Admin Profile
              </NavLink>
            </li>
          </>
        )}

        {role === 'DOCTOR' && (
          <>
            <li className="sidebar-item">
              <NavLink to="/doctor/dashboard" end className={({ isActive }) => (isActive ? 'active' : '')}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/doctor/appointments" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Calendar size={18} /> My Appointments
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/doctor/medical-records" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FileText size={18} /> Medical Records
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/doctor/prescriptions" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Pill size={18} /> Prescriptions
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/doctor/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                <User size={18} /> Doctor Profile
              </NavLink>
            </li>
          </>
        )}

        {role === 'PATIENT' && (
          <>
            <li className="sidebar-item">
              <NavLink to="/patient/dashboard" end className={({ isActive }) => (isActive ? 'active' : '')}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/patient/book-appointment" className={({ isActive }) => (isActive ? 'active' : '')}>
                <PlusCircle size={18} /> Book Appointment
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/patient/doctor-search" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Stethoscope size={18} /> Find Doctors
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/patient/appointments" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Calendar size={18} /> My Appointments
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/patient/medical-history" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FileText size={18} /> Medical History
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/patient/prescriptions" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Pill size={18} /> Prescriptions
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/patient/bills" className={({ isActive }) => (isActive ? 'active' : '')}>
                <CreditCard size={18} /> Invoices & Bills
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/patient/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                <User size={18} /> My Profile
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">{user?.fullName?.charAt(0) || 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', marginTop: '0.75rem' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
