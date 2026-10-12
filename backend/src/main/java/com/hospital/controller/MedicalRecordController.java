package com.hospital.controller;

import com.hospital.dto.request.MedicalRecordRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.MedicalRecordResponse;
import com.hospital.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MedicalRecordResponse>> createRecord(@Valid @RequestBody MedicalRecordRequest request,
                                                                           Principal principal) {
        MedicalRecordResponse record = medicalRecordService.createMedicalRecord(request, principal.getName());
        return new ResponseEntity<>(ApiResponse.ok("Medical record created successfully", record), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MedicalRecordResponse>> getRecordById(@PathVariable Long id, Principal principal) {
        MedicalRecordResponse record = medicalRecordService.getMedicalRecordById(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Medical record retrieved", record));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> getPatientRecords(@PathVariable Long patientId, Principal principal) {
        List<MedicalRecordResponse> records = medicalRecordService.getPatientMedicalRecords(patientId, principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Patient medical records retrieved", records));
    }
}
