package com.relaxit.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.relaxit.backend.dto.auth.RegisterRequest;
import com.relaxit.backend.dto.auth.RegisterResponse;
import com.relaxit.backend.entity.User;
import com.relaxit.backend.exception.EmailAlreadyExistsException;
import com.relaxit.backend.repository.UserRepository;

import jakarta.transaction.Transactional;

import java.util.Locale;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final org.springframework.security.authentication.AuthenticationManager authenticationManager;
  private final com.relaxit.backend.security.JwtService jwtService;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      org.springframework.security.authentication.AuthenticationManager authenticationManager,
      com.relaxit.backend.security.JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @Transactional
  public RegisterResponse register(RegisterRequest request) {
    String email = request.getEmail()
        .trim()
        .toLowerCase(Locale.ROOT);

    if (userRepository.existsByEmail(email)) {
      throw new EmailAlreadyExistsException();
    }

    String hashedPassword = passwordEncoder.encode(request.getPassword());

    User user = new User();

    user.setFirstName(request.getFirstName().trim());
    user.setLastName(request.getLastName().trim());
    user.setEmail(email);
    user.setPassword(hashedPassword);

    User savedUser = userRepository.save(user);

    return new RegisterResponse(
        savedUser.getId(),
        savedUser.getFirstName(),
        savedUser.getLastName(),
        savedUser.getEmail());
  }

  public com.relaxit.backend.dto.auth.LoginResponse login(com.relaxit.backend.dto.auth.LoginRequest request) {
    String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

    authenticationManager.authenticate(
        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
            email,
            request.getPassword()));

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException(
            "Invalid email or password"));

    com.relaxit.backend.dto.auth.AuthUserResponse userResponse = new com.relaxit.backend.dto.auth.AuthUserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail());

    String accessToken = jwtService.generateToken(user.getId().toString(), user.getEmail());
    long expiresIn = jwtService.getExpirationInSeconds();

    return new com.relaxit.backend.dto.auth.LoginResponse(
        true,
        "Login successful",
        userResponse,
        accessToken,
        expiresIn);
  }

}
