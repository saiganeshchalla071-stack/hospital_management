package com.hospital.service;

import com.hospital.dto.request.MedicalRecordRequest;
import com.hospital.dto.response.MedicalRecordResponse;
import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ConflictException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.exception.UnauthorizedException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository,
                                AppointmentRepository appointmentRepository,
                                DoctorRepository doctorRepository,
                                UserRepository userRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request, String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + doctorEmail));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorEmail));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + request.getAppointmentId()));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new UnauthorizedException("You are not authorized to create medical records for another doctor's appointment");
        }

        if (medicalRecordRepository.existsByAppointmentId(appointment.getId())) {
            throw new ConflictException("A medical record has already been recorded for appointment ID: " + appointment.getId());
        }

        MedicalRecord record = new MedicalRecord();
        record.setPatient(appointment.getPatient());
        record.setDoctor(doctor);
        record.setAppointment(appointment);
        record.setDiagnosis(request.getDiagnosis().trim());
        record.setClinicalNotes(request.getClinicalNotes());

        MedicalRecord saved = medicalRecordRepository.save(record);

        // Mark appointment as COMPLETED
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        return MedicalRecordResponse.fromEntity(saved);
    }

    public MedicalRecordResponse getMedicalRecordById(Long id, String currentEmail) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with ID: " + id));

        validateAccess(record.getPatient().getUser().getEmail(),
                record.getDoctor().getUser().getEmail(),
                currentEmail);

        return MedicalRecordResponse.fromEntity(record);
    }

    public List<MedicalRecordResponse> getPatientMedicalRecords(Long patientId, String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .filter(rec -> user.getRole() == Role.ADMIN
                        || (user.getRole() == Role.PATIENT && rec.getPatient().getUser().getId().equals(user.getId()))
                        || (user.getRole() == Role.DOCTOR && rec.getDoctor().getUser().getId().equals(user.getId())))
                .map(MedicalRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateAccess(String patientEmail, String doctorEmail, String currentEmail) {
        User current = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        if (current.getRole() == Role.ADMIN) {
            return;
        }
        if (current.getRole() == Role.PATIENT && !current.getEmail().equalsIgnoreCase(patientEmail)) {
            throw new UnauthorizedException("You are not authorized to access this patient's medical records");
        }
        if (current.getRole() == Role.DOCTOR && !current.getEmail().equalsIgnoreCase(doctorEmail)) {
            throw new UnauthorizedException("You are not authorized to access this medical record");
        }
    }
}
