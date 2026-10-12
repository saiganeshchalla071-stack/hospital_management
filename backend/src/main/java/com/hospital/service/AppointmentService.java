package com.hospital.service;

import com.hospital.dto.request.AppointmentRequest;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ConflictException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.exception.UnauthorizedException;
import com.hospital.repository.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final BillingService billingService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository,
                              UserRepository userRepository,
                              @Lazy BillingService billingService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.billingService = billingService;
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        return AppointmentResponse.fromEntity(appointment);
    }

    public List<AppointmentResponse> getMyAppointments(String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        if (user.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + currentEmail));
            return appointmentRepository.findByPatientIdOrderByAppointmentDateDescStartTimeDesc(patient.getId()).stream()
                    .map(AppointmentResponse::fromEntity)
                    .collect(Collectors.toList());
        } else if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + currentEmail));
            return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescStartTimeDesc(doctor.getId()).stream()
                    .map(AppointmentResponse::fromEntity)
                    .collect(Collectors.toList());
        } else {
            // ADMIN sees all appointments
            return getAllAppointments();
        }
    }

    @Transactional
    public AppointmentResponse bookAppointment(AppointmentRequest request, String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        Patient patient;
        if (user.getRole() == Role.PATIENT) {
            patient = patientRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient record not found for user: " + currentEmail));
        } else if (user.getRole() == Role.ADMIN && request.getPatientId() != null) {
            patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + request.getPatientId()));
        } else {
            throw new BadRequestException("A valid patient is required to book an appointment");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + request.getDoctorId()));

        if (!doctor.getUser().isEnabled()) {
            throw new BadRequestException("Doctor is currently inactive and cannot accept appointments");
        }

        // Date and time validations
        LocalDate apptDate = request.getAppointmentDate();
        LocalTime startTime = request.getStartTime();
        LocalTime endTime = request.getEndTime() != null ? request.getEndTime() : startTime.plusMinutes(30);

        if (apptDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date cannot be in the past");
        }
        if (apptDate.isEqual(LocalDate.now()) && startTime.isBefore(LocalTime.now())) {
            throw new BadRequestException("Appointment time cannot be in the past");
        }
        if (!endTime.isAfter(startTime)) {
            throw new BadRequestException("End time must be after start time");
        }

        // Strict slot conflict check
        long conflicts = appointmentRepository.countConflictingAppointments(
                doctor.getId(), apptDate, startTime, endTime, null
        );
        if (conflicts > 0) {
            throw new ConflictException(String.format(
                    "Doctor %s already has an appointment scheduled on %s between %s and %s",
                    doctor.getUser().getFullName(), apptDate, startTime, endTime
            ));
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(apptDate);
        appointment.setStartTime(startTime);
        appointment.setEndTime(endTime);
        appointment.setReason(request.getReason());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment saved = appointmentRepository.save(appointment);

        // Auto-generate pending bill for the appointment
        billingService.generateBillForAppointment(saved);

        return AppointmentResponse.fromEntity(saved);
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatus newStatus, String currentEmail) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        // Authorization checks on status transition
        if (user.getRole() == Role.PATIENT) {
            if (!appointment.getPatient().getUser().getId().equals(user.getId())) {
                throw new UnauthorizedException("You can only cancel your own appointments");
            }
            if (newStatus != AppointmentStatus.CANCELLED) {
                throw new BadRequestException("Patients can only cancel appointments");
            }
            if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
                throw new BadRequestException("Completed appointments cannot be cancelled");
            }
        } else if (user.getRole() == Role.DOCTOR) {
            if (!appointment.getDoctor().getUser().getId().equals(user.getId())) {
                throw new UnauthorizedException("You can only manage your own assigned appointments");
            }
        }

        appointment.setStatus(newStatus);
        Appointment updated = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(updated);
    }

    @Transactional
    public AppointmentResponse rescheduleAppointment(Long id, AppointmentRequest request, String currentEmail) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        if (user.getRole() == Role.PATIENT && !appointment.getPatient().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only reschedule your own appointments");
        }

        LocalDate newDate = request.getAppointmentDate();
        LocalTime newStart = request.getStartTime();
        LocalTime newEnd = request.getEndTime() != null ? request.getEndTime() : newStart.plusMinutes(30);

        if (newDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date cannot be in the past");
        }

        long conflicts = appointmentRepository.countConflictingAppointments(
                appointment.getDoctor().getId(), newDate, newStart, newEnd, appointment.getId()
        );
        if (conflicts > 0) {
            throw new ConflictException("The selected time slot conflicts with another appointment for this doctor");
        }

        appointment.setAppointmentDate(newDate);
        appointment.setStartTime(newStart);
        appointment.setEndTime(newEnd);
        if (request.getReason() != null) {
            appointment.setReason(request.getReason());
        }
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment updated = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(updated);
    }
}
