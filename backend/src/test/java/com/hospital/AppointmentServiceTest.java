package com.hospital;

import com.hospital.dto.request.AppointmentRequest;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ConflictException;
import com.hospital.repository.*;
import com.hospital.service.AppointmentService;
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
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BillingService billingService;

    @InjectMocks
    private AppointmentService appointmentService;

    private User patientUser;
    private Patient patient;
    private User doctorUser;
    private Doctor doctor;

    @BeforeEach
    void setUp() {
        patientUser = new User("John Doe", "john.doe@gmail.com", "hash", "+123", Role.PATIENT, true);
        patientUser.setId(10L);
        patient = new Patient(patientUser, LocalDate.of(1990, 1, 1), "123 Street", "911");
        patient.setId(1L);

        doctorUser = new User("Dr. Sarah", "dr.sarah@hospital.com", "hash", "+456", Role.DOCTOR, true);
        doctorUser.setId(20L);
        doctor = new Doctor(doctorUser, new Department("Cardiology", "Heart", "Wing A"),
                "Cardiology", "MD", 10, new BigDecimal("150.00"), "Bio");
        doctor.setId(2L);
    }

    @Test
    @DisplayName("Should successfully book appointment when slot is available")
    void testBookAppointment_Success() {
        AppointmentRequest req = new AppointmentRequest();
        req.setDoctorId(2L);
        req.setAppointmentDate(LocalDate.now().plusDays(2));
        req.setStartTime(LocalTime.of(10, 0));
        req.setEndTime(LocalTime.of(10, 30));
        req.setReason("Chest pain checkup");

        when(userRepository.findByEmail("john.doe@gmail.com")).thenReturn(Optional.of(patientUser));
        when(patientRepository.findByUserId(10L)).thenReturn(Optional.of(patient));
        when(doctorRepository.findById(2L)).thenReturn(Optional.of(doctor));
        when(appointmentRepository.countConflictingAppointments(eq(2L), any(), any(), any(), isNull()))
                .thenReturn(0L);

        Appointment savedAppointment = new Appointment(patient, doctor, req.getAppointmentDate(),
                req.getStartTime(), req.getEndTime(), req.getReason(), AppointmentStatus.PENDING);
        savedAppointment.setId(100L);
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(savedAppointment);

        AppointmentResponse res = appointmentService.bookAppointment(req, "john.doe@gmail.com");

        assertNotNull(res);
        assertEquals(AppointmentStatus.PENDING, res.getStatus());
        assertEquals("Dr. Sarah", res.getDoctorName());
        assertEquals("John Doe", res.getPatientName());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
        verify(billingService, times(1)).generateBillForAppointment(any(Appointment.class));
    }

    @Test
    @DisplayName("Should throw ConflictException when doctor has overlapping appointment")
    void testBookAppointment_Conflict() {
        AppointmentRequest req = new AppointmentRequest();
        req.setDoctorId(2L);
        req.setAppointmentDate(LocalDate.now().plusDays(2));
        req.setStartTime(LocalTime.of(10, 0));
        req.setEndTime(LocalTime.of(10, 30));

        when(userRepository.findByEmail("john.doe@gmail.com")).thenReturn(Optional.of(patientUser));
        when(patientRepository.findByUserId(10L)).thenReturn(Optional.of(patient));
        when(doctorRepository.findById(2L)).thenReturn(Optional.of(doctor));
        when(appointmentRepository.countConflictingAppointments(eq(2L), any(), any(), any(), isNull()))
                .thenReturn(1L); // Overlap found

        assertThrows(ConflictException.class, () ->
                appointmentService.bookAppointment(req, "john.doe@gmail.com"));

        verify(appointmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException when date is in the past")
    void testBookAppointment_PastDate() {
        AppointmentRequest req = new AppointmentRequest();
        req.setDoctorId(2L);
        req.setAppointmentDate(LocalDate.now().minusDays(1)); // Yesterday
        req.setStartTime(LocalTime.of(10, 0));

        when(userRepository.findByEmail("john.doe@gmail.com")).thenReturn(Optional.of(patientUser));
        when(patientRepository.findByUserId(10L)).thenReturn(Optional.of(patient));
        when(doctorRepository.findById(2L)).thenReturn(Optional.of(doctor));

        assertThrows(BadRequestException.class, () ->
                appointmentService.bookAppointment(req, "john.doe@gmail.com"));
    }
}
