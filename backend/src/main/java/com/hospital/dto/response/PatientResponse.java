package com.hospital.dto.response;

import com.hospital.entity.Patient;

import java.time.LocalDate;

public class PatientResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private boolean enabled;
    private LocalDate dateOfBirth;
    private String address;
    private String emergencyContact;

    public PatientResponse() {
    }

    public static PatientResponse fromEntity(Patient patient) {
        if (patient == null) return null;
        PatientResponse res = new PatientResponse();
        res.setId(patient.getId());
        if (patient.getUser() != null) {
            res.setUserId(patient.getUser().getId());
            res.setFullName(patient.getUser().getFullName());
            res.setEmail(patient.getUser().getEmail());
            res.setPhone(patient.getUser().getPhone());
            res.setEnabled(patient.getUser().isEnabled());
        }
        res.setDateOfBirth(patient.getDateOfBirth());
        res.setAddress(patient.getAddress());
        res.setEmergencyContact(patient.getEmergencyContact());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }
}
