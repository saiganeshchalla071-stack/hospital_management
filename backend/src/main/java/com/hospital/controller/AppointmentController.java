package com.hospital.controller;

import com.hospital.dto.request.AppointmentRequest;
import com.hospital.dto.request.StatusUpdateRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.entity.AppointmentStatus;
import com.hospital.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAllAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(ApiResponse.ok("All appointments retrieved", appointments));
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getMyAppointments(Principal principal) {
        List<AppointmentResponse> appointments = appointmentService.getMyAppointments(principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("User appointments retrieved", appointments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponse>> getAppointmentById(@PathVariable Long id) {
        AppointmentResponse appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.ok("Appointment details retrieved", appointment));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(@Valid @RequestBody AppointmentRequest request,
                                                                            Principal principal) {
        AppointmentResponse booked = appointmentService.bookAppointment(request, principal.getName());
        return new ResponseEntity<>(ApiResponse.ok("Appointment booked successfully", booked), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateStatus(@PathVariable Long id,
                                                                         @RequestBody StatusUpdateRequest request,
                                                                         Principal principal) {
        AppointmentStatus status = AppointmentStatus.valueOf(request.getStatus().toUpperCase());
        AppointmentResponse updated = appointmentService.updateAppointmentStatus(id, status, principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Appointment status updated to: " + status, updated));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<ApiResponse<AppointmentResponse>> reschedule(@PathVariable Long id,
                                                                       @Valid @RequestBody AppointmentRequest request,
                                                                       Principal principal) {
        AppointmentResponse rescheduled = appointmentService.rescheduleAppointment(id, request, principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("Appointment rescheduled successfully", rescheduled));
    }
}
