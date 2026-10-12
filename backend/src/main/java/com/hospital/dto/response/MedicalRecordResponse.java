package com.hospital.dto.response;

import com.hospital.entity.MedicalRecord;

import java.time.LocalDateTime;

public class MedicalRecordResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private Long appointmentId;
    private String diagnosis;
    private String clinicalNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MedicalRecordResponse() {
    }

    public static MedicalRecordResponse fromEntity(MedicalRecord rec) {
        if (rec == null) return null;
        MedicalRecordResponse res = new MedicalRecordResponse();
        res.setId(rec.getId());
        if (rec.getPatient() != null) {
            res.setPatientId(rec.getPatient().getId());
            if (rec.getPatient().getUser() != null) {
                res.setPatientName(rec.getPatient().getUser().getFullName());
            }
        }
        if (rec.getDoctor() != null) {
            res.setDoctorId(rec.getDoctor().getId());
            if (rec.getDoctor().getUser() != null) {
                res.setDoctorName(rec.getDoctor().getUser().getFullName());
            }
        }
        if (rec.getAppointment() != null) {
            res.setAppointmentId(rec.getAppointment().getId());
        }
        res.setDiagnosis(rec.getDiagnosis());
        res.setClinicalNotes(rec.getClinicalNotes());
        res.setCreatedAt(rec.getCreatedAt());
        res.setUpdatedAt(rec.getUpdatedAt());
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

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getClinicalNotes() {
        return clinicalNotes;
    }

    public void setClinicalNotes(String clinicalNotes) {
        this.clinicalNotes = clinicalNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
