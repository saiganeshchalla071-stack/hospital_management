package com.hospital;

import com.hospital.dto.response.BillResponse;
import com.hospital.entity.*;
import com.hospital.exception.UnauthorizedException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.BillRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;
import com.hospital.service.BillingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BillingServiceTest {

    @Mock
    private BillRepository billRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BillingService billingService;

    private User patientUser;
    private Patient patient;
    private Doctor doctor;
    private Appointment appointment;
    private Bill bill;

    @BeforeEach
    void setUp() {
        patientUser = new User("John Doe", "john.doe@gmail.com", "hash", "+123", Role.PATIENT, true);
        patientUser.setId(10L);
        patient = new Patient(patientUser, LocalDate.of(1990, 1, 1), "123 Street", "911");
        patient.setId(1L);

        User docUser = new User("Dr. Sarah", "dr.sarah@hospital.com", "hash", "+456", Role.DOCTOR, true);
        doctor = new Doctor(docUser, new Department("Cardiology", "Heart", "Wing A"),
                "Cardiology", "MD", 10, new BigDecimal("150.00"), "Bio");
        doctor.setId(2L);

        appointment = new Appointment(patient, doctor, LocalDate.now().plusDays(1),
                LocalTime.of(9, 0), LocalTime.of(9, 30), "Consultation", AppointmentStatus.PENDING);
        appointment.setId(50L);

        bill = new Bill(patient, appointment, new BigDecimal("150.00"), LocalDate.now(),
                PaymentStatus.PENDING, "CASH", "Consultation fee");
        bill.setId(100L);
    }

    @Test
    @DisplayName("Should auto-generate bill with doctor consultation fee")
    void testGenerateBillForAppointment() {
        when(billRepository.findByAppointmentId(50L)).thenReturn(Optional.empty());
        when(billRepository.save(any(Bill.class))).thenReturn(bill);

        Bill generated = billingService.generateBillForAppointment(appointment);

        assertNotNull(generated);
        assertEquals(new BigDecimal("150.00"), generated.getAmount());
        assertEquals(PaymentStatus.PENDING, generated.getPaymentStatus());
        verify(billRepository, times(1)).save(any(Bill.class));
    }

    @Test
    @DisplayName("Patient can pay their own pending bill")
    void testUpdatePaymentStatus_PatientSuccess() {
        when(billRepository.findById(100L)).thenReturn(Optional.of(bill));
        when(userRepository.findByEmail("john.doe@gmail.com")).thenReturn(Optional.of(patientUser));
        when(billRepository.save(any(Bill.class))).thenReturn(bill);

        BillResponse res = billingService.updatePaymentStatus(100L, PaymentStatus.PAID, "CARD", "john.doe@gmail.com");

        assertNotNull(res);
        assertEquals(PaymentStatus.PAID, bill.getPaymentStatus());
        assertEquals("CARD", bill.getPaymentMethod());
    }

    @Test
    @DisplayName("Should forbid patient from paying another patient's bill")
    void testUpdatePaymentStatus_UnauthorizedPatient() {
        User otherPatientUser = new User("Stranger", "stranger@gmail.com", "hash", "+999", Role.PATIENT, true);
        otherPatientUser.setId(99L);

        when(billRepository.findById(100L)).thenReturn(Optional.of(bill));
        when(userRepository.findByEmail("stranger@gmail.com")).thenReturn(Optional.of(otherPatientUser));

        assertThrows(UnauthorizedException.class, () ->
                billingService.updatePaymentStatus(100L, PaymentStatus.PAID, "CARD", "stranger@gmail.com"));
    }
}
