package com.hospital.controller;

import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.DashboardStatsResponse;
import com.hospital.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAdminDashboard() {
        DashboardStatsResponse stats = dashboardService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard metrics", stats));
    }

    @GetMapping("/doctor/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDoctorDashboard(Principal principal) {
        DashboardStatsResponse stats = dashboardService.getDoctorDashboardStats(principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Doctor dashboard metrics", stats));
    }

    @GetMapping("/patient/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getPatientDashboard(Principal principal) {
        DashboardStatsResponse stats = dashboardService.getPatientDashboardStats(principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Patient dashboard metrics", stats));
    }
}
