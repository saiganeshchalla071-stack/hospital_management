package com.hospital.dto.response;

import com.hospital.entity.Bill;
import com.hospital.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BillResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long appointmentId;
    private String doctorName;
    private BigDecimal amount;
    private LocalDate billingDate;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private String description;

    public BillResponse() {
    }

    public static BillResponse fromEntity(Bill b) {
        if (b == null) return null;
        BillResponse res = new BillResponse();
        res.setId(b.getId());
        if (b.getPatient() != null) {
            res.setPatientId(b.getPatient().getId());
            if (b.getPatient().getUser() != null) {
                res.setPatientName(b.getPatient().getUser().getFullName());
            }
        }
        if (b.getAppointment() != null) {
            res.setAppointmentId(b.getAppointment().getId());
            if (b.getAppointment().getDoctor() != null && b.getAppointment().getDoctor().getUser() != null) {
                res.setDoctorName(b.getAppointment().getDoctor().getUser().getFullName());
            }
        }
        res.setAmount(b.getAmount());
        res.setBillingDate(b.getBillingDate());
        res.setPaymentStatus(b.getPaymentStatus());
        res.setPaymentMethod(b.getPaymentMethod());
        res.setDescription(b.getDescription());
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

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getBillingDate() {
        return billingDate;
    }

    public void setBillingDate(LocalDate billingDate) {
        this.billingDate = billingDate;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
