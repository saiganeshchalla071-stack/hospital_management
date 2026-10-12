package com.hospital;

import com.hospital.controller.AuthController;
import com.hospital.dto.request.LoginRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.JwtAuthResponse;
import com.hospital.dto.response.UserResponse;
import com.hospital.entity.Role;
import com.hospital.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    @DisplayName("Login API returns 200 with JWT token and user info")
    void testLoginController() {
        LoginRequest req = new LoginRequest("admin@hospital.com", "Admin@123");
        UserResponse user = new UserResponse(1L, "Admin", "admin@hospital.com", "+123", Role.ADMIN, true, LocalDateTime.now());
        JwtAuthResponse authResponse = new JwtAuthResponse("mock-jwt-token-xyz", user);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        ResponseEntity<ApiResponse<JwtAuthResponse>> response = authController.login(req);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("mock-jwt-token-xyz", response.getBody().getData().getAccessToken());
        assertEquals(Role.ADMIN, response.getBody().getData().getUser().getRole());
    }
}
