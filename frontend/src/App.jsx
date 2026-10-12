import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/protected/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import DoctorsDirectoryPage from './pages/public/DoctorsDirectoryPage';
import DepartmentsPublicPage from './pages/public/DepartmentsPublicPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import PatientManagement from './pages/admin/PatientManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import BillingManagement from './pages/admin/BillingManagement';
import ReportsPage from './pages/admin/ReportsPage';
import AdminProfile from './pages/admin/AdminProfile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import MedicalRecordsPage from './pages/doctor/MedicalRecordsPage';
import PrescriptionManagement from './pages/doctor/PrescriptionManagement';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import DoctorSearchPage from './pages/patient/DoctorSearchPage';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import PatientMedicalHistory from './pages/patient/PatientMedicalHistory';
import PatientBills from './pages/patient/PatientBills';
import PatientProfile from './pages/patient/PatientProfile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/doctors-directory" element={<DoctorsDirectoryPage />} />
            <Route path="/departments-list" element={<DepartmentsPublicPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['ADMIN']}><DoctorManagement /></ProtectedRoute>} />
            <Route path="/admin/patients" element={<ProtectedRoute allowedRoles={['ADMIN']}><PatientManagement /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['ADMIN']}><DepartmentManagement /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['ADMIN']}><AppointmentManagement /></ProtectedRoute>} />
            <Route path="/admin/billing" element={<ProtectedRoute allowedRoles={['ADMIN']}><BillingManagement /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminProfile /></ProtectedRoute>} />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorAppointments /></ProtectedRoute>} />
            <Route path="/doctor/medical-records" element={<ProtectedRoute allowedRoles={['DOCTOR']}><MedicalRecordsPage /></ProtectedRoute>} />
            <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={['DOCTOR']}><PrescriptionManagement /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorProfile /></ProtectedRoute>} />

            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/book-appointment" element={<ProtectedRoute allowedRoles={['PATIENT']}><BookAppointmentPage /></ProtectedRoute>} />
            <Route path="/patient/doctor-search" element={<ProtectedRoute allowedRoles={['PATIENT']}><DoctorSearchPage /></ProtectedRoute>} />
            <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientAppointments /></ProtectedRoute>} />
            <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientPrescriptions /></ProtectedRoute>} />
            <Route path="/patient/medical-history" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientMedicalHistory /></ProtectedRoute>} />
            <Route path="/patient/bills" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientBills /></ProtectedRoute>} />
            <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={['PATIENT']}><PatientProfile /></ProtectedRoute>} />

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
