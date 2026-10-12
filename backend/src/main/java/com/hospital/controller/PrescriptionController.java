package com.hospital.controller;

import com.hospital.dto.request.PrescriptionRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.PrescriptionResponse;
import com.hospital.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PrescriptionResponse>> createPrescription(@Valid @RequestBody PrescriptionRequest request,
                                                                                Principal principal) {
        PrescriptionResponse prescription = prescriptionService.createPrescription(request, principal.getName());
        return new ResponseEntity<>(ApiResponse.ok("Prescription issued successfully", prescription), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> getPrescriptionById(@PathVariable Long id, Principal principal) {
        PrescriptionResponse prescription = prescriptionService.getPrescriptionById(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Prescription details retrieved", prescription));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<PrescriptionResponse>>> getPatientPrescriptions(@PathVariable Long patientId,
                                                                                            Principal principal) {
        List<PrescriptionResponse> prescriptions = prescriptionService.getPatientPrescriptions(patientId, principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Patient prescriptions retrieved", prescriptions));
    }
}
