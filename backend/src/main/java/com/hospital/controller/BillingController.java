package com.hospital.controller;

import com.hospital.dto.request.BillRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.BillResponse;
import com.hospital.entity.PaymentStatus;
import com.hospital.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BillResponse>>> getAllBills() {
        List<BillResponse> bills = billingService.getAllBills();
        return ResponseEntity.ok(ApiResponse.ok("Bills retrieved successfully", bills));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BillResponse>> getBillById(@PathVariable Long id, Principal principal) {
        BillResponse bill = billingService.getBillById(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Bill retrieved", bill));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getPatientBills(@PathVariable Long patientId,
                                                                           Principal principal) {
        List<BillResponse> bills = billingService.getPatientBills(patientId, principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Patient bills retrieved", bills));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BillResponse>> createBill(@Valid @RequestBody BillRequest request) {
        BillResponse bill = billingService.createBill(request);
        return new ResponseEntity<>(ApiResponse.ok("Bill created successfully", bill), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<ApiResponse<BillResponse>> updatePaymentStatus(@PathVariable Long id,
                                                                         @RequestBody BillRequest request,
                                                                         Principal principal) {
        PaymentStatus status = request.getPaymentStatus() != null ? request.getPaymentStatus() : PaymentStatus.PAID;
        BillResponse updated = billingService.updatePaymentStatus(id, status, request.getPaymentMethod(), principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Payment status updated to: " + status, updated));
    }
}
