package com.hospital.controller;

import com.hospital.dto.request.DoctorRequest;
import com.hospital.dto.request.StatusUpdateRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.DoctorResponse;
import com.hospital.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAllDoctors() {
        List<DoctorResponse> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.ok("Doctors retrieved successfully", doctors));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getActiveDoctors() {
        List<DoctorResponse> doctors = doctorService.getActiveDoctors();
        return ResponseEntity.ok(ApiResponse.ok("Active doctors retrieved successfully", doctors));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> searchDoctors(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String query) {
        List<DoctorResponse> doctors = doctorService.searchDoctors(departmentId, query);
        return ResponseEntity.ok(ApiResponse.ok("Doctors search results", doctors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable Long id) {
        DoctorResponse doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.ok("Doctor details retrieved", doctor));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorResponse>> createDoctor(@Valid @RequestBody DoctorRequest request) {
        DoctorResponse created = doctorService.createDoctor(request);
        return new ResponseEntity<>(ApiResponse.ok("Doctor created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateDoctor(@PathVariable Long id,
                                                                    @RequestBody DoctorRequest request) {
        DoctorResponse updated = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Doctor updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> toggleDoctorStatus(@PathVariable Long id,
                                                                @RequestBody StatusUpdateRequest request) {
        boolean enabled = request.getEnabled() != null ? request.getEnabled() : true;
        doctorService.toggleDoctorStatus(id, enabled);
        return ResponseEntity.ok(ApiResponse.ok("Doctor status updated to: " + (enabled ? "Active" : "Inactive"), null));
    }
}
