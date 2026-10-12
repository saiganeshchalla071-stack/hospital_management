package com.hospital.service;

import com.hospital.dto.response.DashboardStatsResponse;
import com.hospital.entity.*;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public DashboardService(UserRepository userRepository,
                            DoctorRepository doctorRepository,
                            PatientRepository patientRepository,
                            DepartmentRepository departmentRepository,
                            AppointmentRepository appointmentRepository,
                            BillRepository billRepository,
                            PrescriptionRepository prescriptionRepository,
                            MedicalRecordRepository medicalRecordRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.billRepository = billRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public DashboardStatsResponse getAdminDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setRole("ADMIN");
        stats.setTotalDoctors(doctorRepository.count());
        stats.setTotalPatients(patientRepository.count());
        stats.setTotalDepartments(departmentRepository.count());
        stats.setTotalAppointments(appointmentRepository.count());
        stats.setPendingAppointments(appointmentRepository.countByStatus(AppointmentStatus.PENDING));
        stats.setApprovedAppointments(appointmentRepository.countByStatus(AppointmentStatus.APPROVED));
        stats.setCompletedAppointments(appointmentRepository.countByStatus(AppointmentStatus.COMPLETED));

        BigDecimal paidRev = billRepository.calculateTotalPaidRevenue();
        BigDecimal pendingRev = billRepository.calculateTotalPendingRevenue();
        stats.setTotalRevenue(paidRev != null ? paidRev : BigDecimal.ZERO);
        stats.setPendingRevenue(pendingRev != null ? pendingRev : BigDecimal.ZERO);

        Map<String, Object> extra = new HashMap<>();
        extra.put("activeDoctors", doctorRepository.findAllActiveDoctors().size());
        extra.put("totalBills", billRepository.count());
        stats.setExtraMetrics(extra);

        return stats;
    }

    public DashboardStatsResponse getDoctorDashboardStats(String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + doctorEmail));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found: " + doctorEmail));

        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setRole("DOCTOR");

        long todayAppts = appointmentRepository.countDoctorAppointmentsOnDate(doctor.getId(), LocalDate.now());
        long upcomingAppts = appointmentRepository.countDoctorUpcomingAppointments(doctor.getId(), LocalDate.now());
        long totalAssigned = appointmentRepository.findByDoctorIdOrderByAppointmentDateDescStartTimeDesc(doctor.getId()).size();
        long completed = appointmentRepository.findByDoctorIdOrderByAppointmentDateDescStartTimeDesc(doctor.getId()).stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .count();

        stats.setTotalAppointments(totalAssigned);
        stats.setCompletedAppointments(completed);

        Map<String, Object> extra = new HashMap<>();
        extra.put("todayAppointments", todayAppts);
        extra.put("upcomingAppointments", upcomingAppts);
        extra.put("totalMedicalRecords", medicalRecordRepository.findByDoctorIdOrderByCreatedAtDesc(doctor.getId()).size());
        extra.put("totalPrescriptions", prescriptionRepository.findByDoctorIdOrderByPrescriptionDateDesc(doctor.getId()).size());
        stats.setExtraMetrics(extra);

        return stats;
    }

    public DashboardStatsResponse getPatientDashboardStats(String patientEmail) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + patientEmail));

        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found: " + patientEmail));

        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setRole("PATIENT");

        long totalAppts = appointmentRepository.findByPatientIdOrderByAppointmentDateDescStartTimeDesc(patient.getId()).size();
        long upcomingAppts = appointmentRepository.findByPatientIdOrderByAppointmentDateDescStartTimeDesc(patient.getId()).stream()
                .filter(a -> !a.getAppointmentDate().isBefore(LocalDate.now()) &&
                        (a.getStatus() == AppointmentStatus.APPROVED || a.getStatus() == AppointmentStatus.PENDING))
                .count();

        long myPrescriptions = prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patient.getId()).size();
        long myRecords = medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId()).size();
        long myBills = billRepository.findByPatientIdOrderByBillingDateDesc(patient.getId()).size();
        long pendingBills = billRepository.findByPatientIdOrderByBillingDateDesc(patient.getId()).stream()
                .filter(b -> b.getPaymentStatus() == PaymentStatus.PENDING)
                .count();

        stats.setTotalAppointments(totalAppts);

        Map<String, Object> extra = new HashMap<>();
        extra.put("upcomingAppointments", upcomingAppts);
        extra.put("prescriptionsCount", myPrescriptions);
        extra.put("medicalRecordsCount", myRecords);
        extra.put("totalBills", myBills);
        extra.put("pendingBills", pendingBills);
        stats.setExtraMetrics(extra);

        return stats;
    }
}
