package com.hospital.dto.response;

import com.hospital.entity.Doctor;

import java.math.BigDecimal;

public class DoctorResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private boolean enabled;
    private Long departmentId;
    private String departmentName;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private String biography;

    public DoctorResponse() {
    }

    public static DoctorResponse fromEntity(Doctor doctor) {
        if (doctor == null) return null;
        DoctorResponse res = new DoctorResponse();
        res.setId(doctor.getId());
        if (doctor.getUser() != null) {
            res.setUserId(doctor.getUser().getId());
            res.setFullName(doctor.getUser().getFullName());
            res.setEmail(doctor.getUser().getEmail());
            res.setPhone(doctor.getUser().getPhone());
            res.setEnabled(doctor.getUser().isEnabled());
        }
        if (doctor.getDepartment() != null) {
            res.setDepartmentId(doctor.getDepartment().getId());
            res.setDepartmentName(doctor.getDepartment().getName());
        }
        res.setSpecialization(doctor.getSpecialization());
        res.setQualification(doctor.getQualification());
        res.setExperienceYears(doctor.getExperienceYears());
        res.setConsultationFee(doctor.getConsultationFee());
        res.setBiography(doctor.getBiography());
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

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }
}
