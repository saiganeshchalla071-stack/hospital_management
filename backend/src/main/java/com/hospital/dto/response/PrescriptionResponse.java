package com.hospital.dto.response;

import com.hospital.entity.Prescription;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class PrescriptionResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private Long medicalRecordId;
    private LocalDate prescriptionDate;
    private String instructions;
    private List<PrescriptionItemDto> items = new ArrayList<>();
    private LocalDateTime createdAt;

    public PrescriptionResponse() {
    }

    public static PrescriptionResponse fromEntity(Prescription p) {
        if (p == null) return null;
        PrescriptionResponse res = new PrescriptionResponse();
        res.setId(p.getId());
        if (p.getPatient() != null) {
            res.setPatientId(p.getPatient().getId());
            if (p.getPatient().getUser() != null) {
                res.setPatientName(p.getPatient().getUser().getFullName());
            }
        }
        if (p.getDoctor() != null) {
            res.setDoctorId(p.getDoctor().getId());
            if (p.getDoctor().getUser() != null) {
                res.setDoctorName(p.getDoctor().getUser().getFullName());
            }
        }
        if (p.getMedicalRecord() != null) {
            res.setMedicalRecordId(p.getMedicalRecord().getId());
        }
        res.setPrescriptionDate(p.getPrescriptionDate());
        res.setInstructions(p.getInstructions());
        res.setCreatedAt(p.getCreatedAt());
        if (p.getItems() != null) {
            res.setItems(p.getItems().stream()
                    .map(PrescriptionItemDto::fromEntity)
                    .collect(Collectors.toList()));
        }
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public Long getMedicalRecordId() {
        return medicalRecordId;
    }

    public void setMedicalRecordId(Long medicalRecordId) {
        this.medicalRecordId = medicalRecordId;
    }

    public LocalDate getPrescriptionDate() {
        return prescriptionDate;
    }

    public void setPrescriptionDate(LocalDate prescriptionDate) {
        this.prescriptionDate = prescriptionDate;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public List<PrescriptionItemDto> getItems() {
        return items;
    }

    public void setItems(List<PrescriptionItemDto> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
