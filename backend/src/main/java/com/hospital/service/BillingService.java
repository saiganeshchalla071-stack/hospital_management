package com.hospital.service;

import com.hospital.dto.request.BillRequest;
import com.hospital.dto.response.BillResponse;
import com.hospital.entity.*;
import com.hospital.exception.ConflictException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.exception.UnauthorizedException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.BillRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillingService {

    private final BillRepository billRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public BillingService(BillRepository billRepository,
                          AppointmentRepository appointmentRepository,
                          PatientRepository patientRepository,
                          UserRepository userRepository) {
        this.billRepository = billRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Bill generateBillForAppointment(Appointment appointment) {
        if (billRepository.findByAppointmentId(appointment.getId()).isPresent()) {
            return billRepository.findByAppointmentId(appointment.getId()).get();
        }

        BigDecimal fee = appointment.getDoctor().getConsultationFee();
        if (fee == null || fee.compareTo(BigDecimal.ZERO) <= 0) {
            fee = new BigDecimal("100.00");
        }

        Bill bill = new Bill();
        bill.setPatient(appointment.getPatient());
        bill.setAppointment(appointment);
        bill.setAmount(fee);
        bill.setBillingDate(appointment.getAppointmentDate());
        bill.setPaymentStatus(PaymentStatus.PENDING);
        bill.setPaymentMethod("CASH");
        bill.setDescription(String.format("Consultation fee for Dr. %s (%s)",
                appointment.getDoctor().getUser().getFullName(),
                appointment.getDoctor().getDepartment().getName()));

        return billRepository.save(bill);
    }

    @Transactional
    public BillResponse createBill(BillRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + request.getAppointmentId()));

        if (billRepository.findByAppointmentId(appointment.getId()).isPresent()) {
            throw new ConflictException("A bill is already generated for appointment ID: " + appointment.getId());
        }

        Patient patient = request.getPatientId() != null
                ? patientRepository.findById(request.getPatientId()).orElse(appointment.getPatient())
                : appointment.getPatient();

        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setAppointment(appointment);
        bill.setAmount(request.getAmount());
        bill.setBillingDate(request.getBillingDate() != null ? request.getBillingDate() : LocalDate.now());
        bill.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : PaymentStatus.PENDING);
        bill.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CASH");
        bill.setDescription(request.getDescription());

        Bill saved = billRepository.save(bill);
        return BillResponse.fromEntity(saved);
    }

    public List<BillResponse> getAllBills() {
        return billRepository.findAll().stream()
                .map(BillResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public BillResponse getBillById(Long id, String currentEmail) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with ID: " + id));

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        if (user.getRole() == Role.PATIENT && !bill.getPatient().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view this bill");
        }

        return BillResponse.fromEntity(bill);
    }

    public List<BillResponse> getPatientBills(Long patientId, String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        return billRepository.findByPatientIdOrderByBillingDateDesc(patientId).stream()
                .filter(b -> user.getRole() == Role.ADMIN
                        || (user.getRole() == Role.PATIENT && b.getPatient().getUser().getId().equals(user.getId())))
                .map(BillResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BillResponse updatePaymentStatus(Long id, PaymentStatus status, String paymentMethod, String currentEmail) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with ID: " + id));

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        // Patients can pay their own pending bills; Admin can change any status
        if (user.getRole() == Role.PATIENT) {
            if (!bill.getPatient().getUser().getId().equals(user.getId())) {
                throw new UnauthorizedException("You are not authorized to pay another patient's bill");
            }
            if (status != PaymentStatus.PAID) {
                throw new UnauthorizedException("Patients can only mark bills as PAID");
            }
        }

        bill.setPaymentStatus(status);
        if (paymentMethod != null && !paymentMethod.isBlank()) {
            bill.setPaymentMethod(paymentMethod);
        }

        Bill updated = billRepository.save(bill);
        return BillResponse.fromEntity(updated);
    }
}
