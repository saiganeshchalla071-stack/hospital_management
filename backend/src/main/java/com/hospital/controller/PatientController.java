package com.hospital.controller;

import com.hospital.dto.request.PatientRequest;
import com.hospital.dto.request.StatusUpdateRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.PatientResponse;
import com.hospital.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientResponse>>> getAllPatients() {
        List<PatientResponse> patients = patientService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.ok("Patients retrieved successfully", patients));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponse>> getPatientById(@PathVariable Long id) {
        PatientResponse patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.ok("Patient details retrieved", patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientResponse>> updatePatient(@PathVariable Long id,
                                                                      @RequestBody PatientRequest request) {
        PatientResponse updated = patientService.updatePatient(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Patient updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> togglePatientStatus(@PathVariable Long id,
                                                                 @RequestBody StatusUpdateRequest request) {
        boolean enabled = request.getEnabled() != null ? request.getEnabled() : true;
        patientService.togglePatientStatus(id, enabled);
        return ResponseEntity.ok(ApiResponse.ok("Patient account status updated", null));
    }
}
