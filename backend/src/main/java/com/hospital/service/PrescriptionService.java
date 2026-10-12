package com.hospital.service;

import com.hospital.dto.request.PrescriptionRequest;
import com.hospital.dto.response.PrescriptionResponse;
import com.hospital.entity.*;
import com.hospital.exception.ConflictException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.exception.UnauthorizedException;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.PrescriptionRepository;
import com.hospital.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               MedicalRecordRepository medicalRecordRepository,
                               DoctorRepository doctorRepository,
                               UserRepository userRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionRequest request, String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + doctorEmail));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorEmail));

        MedicalRecord record = medicalRecordRepository.findById(request.getMedicalRecordId())
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with ID: " + request.getMedicalRecordId()));

        if (!record.getDoctor().getId().equals(doctor.getId())) {
            throw new UnauthorizedException("You are not authorized to write prescriptions for another doctor's consultation");
        }

        if (prescriptionRepository.existsByMedicalRecordId(record.getId())) {
            throw new ConflictException("A prescription has already been issued for this medical record");
        }

        Prescription prescription = new Prescription();
        prescription.setPatient(record.getPatient());
        prescription.setDoctor(doctor);
        prescription.setMedicalRecord(record);
        prescription.setPrescriptionDate(LocalDate.now());
        prescription.setInstructions(request.getInstructions());

        if (request.getItems() != null) {
            for (PrescriptionRequest.PrescriptionItemRequest itemReq : request.getItems()) {
                PrescriptionItem item = new PrescriptionItem();
                item.setMedicineName(itemReq.getMedicineName());
                item.setDosage(itemReq.getDosage());
                item.setFrequency(itemReq.getFrequency());
                item.setDuration(itemReq.getDuration());
                item.setAdditionalInstructions(itemReq.getAdditionalInstructions());
                prescription.addItem(item);
            }
        }

        Prescription saved = prescriptionRepository.save(prescription);
        return PrescriptionResponse.fromEntity(saved);
    }

    public PrescriptionResponse getPrescriptionById(Long id, String currentEmail) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with ID: " + id));

        validateAccess(prescription.getPatient().getUser().getEmail(),
                prescription.getDoctor().getUser().getEmail(),
                currentEmail);

        return PrescriptionResponse.fromEntity(prescription);
    }

    public List<PrescriptionResponse> getPatientPrescriptions(Long patientId, String currentEmail) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        return prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId).stream()
                .filter(p -> user.getRole() == Role.ADMIN
                        || (user.getRole() == Role.PATIENT && p.getPatient().getUser().getId().equals(user.getId()))
                        || (user.getRole() == Role.DOCTOR && p.getDoctor().getUser().getId().equals(user.getId())))
                .map(PrescriptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateAccess(String patientEmail, String doctorEmail, String currentEmail) {
        User current = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentEmail));

        if (current.getRole() == Role.ADMIN) {
            return;
        }
        if (current.getRole() == Role.PATIENT && !current.getEmail().equalsIgnoreCase(patientEmail)) {
            throw new UnauthorizedException("You are not authorized to access this patient's prescriptions");
        }
        if (current.getRole() == Role.DOCTOR && !current.getEmail().equalsIgnoreCase(doctorEmail)) {
            throw new UnauthorizedException("You are not authorized to access this prescription");
        }
    }
}
