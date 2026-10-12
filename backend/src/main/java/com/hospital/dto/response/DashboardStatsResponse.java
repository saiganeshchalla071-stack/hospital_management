package com.hospital.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStatsResponse {
    private String role;
    private long totalDoctors;
    private long totalPatients;
    private long totalDepartments;
    private long totalAppointments;
    private long pendingAppointments;
    private long approvedAppointments;
    private long completedAppointments;
    private BigDecimal totalRevenue = BigDecimal.ZERO;
    private BigDecimal pendingRevenue = BigDecimal.ZERO;
    private Map<String, Object> extraMetrics;

    public DashboardStatsResponse() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getPendingAppointments() {
        return pendingAppointments;
    }

    public void setPendingAppointments(long pendingAppointments) {
        this.pendingAppointments = pendingAppointments;
    }

    public long getApprovedAppointments() {
        return approvedAppointments;
    }

    public void setApprovedAppointments(long approvedAppointments) {
        this.approvedAppointments = approvedAppointments;
    }

    public long getCompletedAppointments() {
        return completedAppointments;
    }

    public void setCompletedAppointments(long completedAppointments) {
        this.completedAppointments = completedAppointments;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getPendingRevenue() {
        return pendingRevenue;
    }

    public void setPendingRevenue(BigDecimal pendingRevenue) {
        this.pendingRevenue = pendingRevenue;
    }

    public Map<String, Object> getExtraMetrics() {
        return extraMetrics;
    }

    public void setExtraMetrics(Map<String, Object> extraMetrics) {
        this.extraMetrics = extraMetrics;
    }
}
