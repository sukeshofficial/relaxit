package com.relaxit.backend.controller;

import com.relaxit.backend.dto.auth.ForgotPasswordRequest;
import com.relaxit.backend.dto.auth.LoginRequest;
import com.relaxit.backend.dto.auth.LoginResponse;
import com.relaxit.backend.dto.auth.RegisterRequest;
import com.relaxit.backend.dto.auth.RegisterResponse;
import com.relaxit.backend.dto.auth.ResetPasswordRequest;
import com.relaxit.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.relaxit.backend.dto.auth.LogoutRequest;
import com.relaxit.backend.dto.auth.RefreshTokenRequest;
import com.relaxit.backend.dto.auth.VerifyEmailRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<RegisterResponse> register(
      @Valid @RequestBody RegisterRequest request) {
    RegisterResponse response = authService.register(request);

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(response);
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(
      @Valid @RequestBody LoginRequest request) {
    LoginResponse response = authService.login(request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<LoginResponse> refreshToken(
      @Valid @RequestBody RefreshTokenRequest request) {
    LoginResponse response = authService.refreshToken(request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/logout")
  public ResponseEntity<Map<String, Object>> logout(
      @RequestBody(required = false) LogoutRequest request,
      @AuthenticationPrincipal UserDetails userDetails) {
    String email = userDetails != null ? userDetails.getUsername() : null;
    Map<String, Object> response = authService.logout(request, email);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/verify-email")
  public ResponseEntity<Map<String, Object>> verifyEmail(
      @Valid @RequestBody VerifyEmailRequest request) {
    Map<String, Object> response = authService.verifyEmail(request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<Map<String, Object>> forgotPassword(
      @Valid @RequestBody ForgotPasswordRequest request) {
    Map<String, Object> response = authService.forgotPassword(request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/reset-password")
  public ResponseEntity<Map<String, Object>> resetPassword(
      @Valid @RequestBody ResetPasswordRequest request) {
    Map<String, Object> response = authService.resetPassword(request);
    return ResponseEntity.ok(response);
  }
}
