package com.hospital.dto.response;

import com.hospital.entity.Appointment;
import com.hospital.entity.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String departmentName;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String reason;
    private AppointmentStatus status;
    private LocalDateTime createdAt;

    public AppointmentResponse() {
    }

    public static AppointmentResponse fromEntity(Appointment a) {
        if (a == null) return null;
        AppointmentResponse res = new AppointmentResponse();
        res.setId(a.getId());
        if (a.getPatient() != null) {
            res.setPatientId(a.getPatient().getId());
            if (a.getPatient().getUser() != null) {
                res.setPatientName(a.getPatient().getUser().getFullName());
                res.setPatientEmail(a.getPatient().getUser().getEmail());
                res.setPatientPhone(a.getPatient().getUser().getPhone());
            }
        }
        if (a.getDoctor() != null) {
            res.setDoctorId(a.getDoctor().getId());
            res.setDoctorSpecialization(a.getDoctor().getSpecialization());
            if (a.getDoctor().getUser() != null) {
                res.setDoctorName(a.getDoctor().getUser().getFullName());
            }
            if (a.getDoctor().getDepartment() != null) {
                res.setDepartmentName(a.getDoctor().getDepartment().getName());
            }
        }
        res.setAppointmentDate(a.getAppointmentDate());
        res.setStartTime(a.getStartTime());
        res.setEndTime(a.getEndTime());
        res.setReason(a.getReason());
        res.setStatus(a.getStatus());
        res.setCreatedAt(a.getCreatedAt());
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

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
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

    public String getDoctorSpecialization() {
        return doctorSpecialization;
    }

    public void setDoctorSpecialization(String doctorSpecialization) {
        this.doctorSpecialization = doctorSpecialization;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
