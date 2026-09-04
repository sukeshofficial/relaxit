package com.relaxit.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.relaxit.backend.dto.auth.RegisterRequest;
import com.relaxit.backend.dto.auth.RegisterResponse;
import com.relaxit.backend.service.AuthService;

import jakarta.validation.Valid;

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
  public ResponseEntity<com.relaxit.backend.dto.auth.LoginResponse> login(
      @Valid @RequestBody com.relaxit.backend.dto.auth.LoginRequest request) {
    com.relaxit.backend.dto.auth.LoginResponse response = authService.login(request);
    return ResponseEntity.ok(response);
  }

}
