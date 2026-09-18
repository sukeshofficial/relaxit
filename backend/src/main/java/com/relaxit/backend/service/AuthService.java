package com.relaxit.backend.service;

import com.relaxit.backend.dto.auth.AuthUserResponse;
import com.relaxit.backend.dto.auth.ForgotPasswordRequest;
import com.relaxit.backend.dto.auth.LoginRequest;
import com.relaxit.backend.dto.auth.LoginResponse;
import com.relaxit.backend.dto.auth.LogoutRequest;
import com.relaxit.backend.dto.auth.RefreshTokenRequest;
import com.relaxit.backend.dto.auth.RegisterRequest;
import com.relaxit.backend.dto.auth.RegisterResponse;
import com.relaxit.backend.dto.auth.ResetPasswordRequest;
import com.relaxit.backend.dto.auth.VerifyEmailRequest;
import com.relaxit.backend.entity.EmailVerificationToken;
import com.relaxit.backend.entity.PasswordResetToken;
import com.relaxit.backend.entity.RefreshToken;
import com.relaxit.backend.entity.User;
import com.relaxit.backend.entity.UserStatus;
import com.relaxit.backend.exception.EmailAlreadyExistsException;
import com.relaxit.backend.exception.InvalidPasswordException;
import com.relaxit.backend.repository.EmailVerificationTokenRepository;
import com.relaxit.backend.repository.PasswordResetTokenRepository;
import com.relaxit.backend.repository.UserRepository;
import com.relaxit.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordResetTokenRepository tokenRepository;
  private final EmailVerificationTokenRepository verificationTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final RefreshTokenService refreshTokenService;

  public AuthService(
      UserRepository userRepository,
      PasswordResetTokenRepository tokenRepository,
      EmailVerificationTokenRepository verificationTokenRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtService jwtService,
      RefreshTokenService refreshTokenService) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.verificationTokenRepository = verificationTokenRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.refreshTokenService = refreshTokenService;
  }

  @Transactional
  public RegisterResponse register(RegisterRequest request) {
    String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

    if (userRepository.existsByEmail(email)) {
      throw new EmailAlreadyExistsException();
    }

    String hashedPassword = passwordEncoder.encode(request.getPassword());

    User user = new User();
    user.setFirstName(request.getFirstName().trim());
    user.setLastName(request.getLastName().trim());
    user.setEmail(email);
    user.setPassword(hashedPassword);
    user.setEmailVerified(false);

    User savedUser = userRepository.save(user);

    // Create Email Verification Token
    String rawVerificationToken = UUID.randomUUID().toString();
    String tokenHash = hashToken(rawVerificationToken);
    EmailVerificationToken verificationToken = new EmailVerificationToken(
        savedUser,
        tokenHash,
        LocalDateTime.now().plusDays(1));
    verificationTokenRepository.save(verificationToken);

    return new RegisterResponse(
        savedUser.getId(),
        savedUser.getFirstName(),
        savedUser.getLastName(),
        savedUser.getEmail());
  }

  @Transactional
  public LoginResponse login(LoginRequest request) {
    String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(email, request.getPassword()));

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

    if (user.getStatus() != UserStatus.ACTIVE) {
      throw new UsernameNotFoundException("Account is inactive or deleted");
    }

    AuthUserResponse userResponse = new AuthUserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail());

    String accessToken = jwtService.generateToken(user.getId().toString(), user.getEmail());
    String refreshToken = refreshTokenService.createRefreshToken(user);
    long expiresIn = jwtService.getExpirationInSeconds();

    return new LoginResponse(
        true,
        "Login successful",
        userResponse,
        accessToken,
        refreshToken,
        expiresIn);
  }

  @Transactional
  public LoginResponse refreshToken(RefreshTokenRequest request) {
    RefreshToken oldToken = refreshTokenService.verifyAndRotateRefreshToken(request.getRefreshToken());
    User user = oldToken.getUser();

    if (user.getStatus() != UserStatus.ACTIVE) {
      throw new InvalidPasswordException("Account is inactive or deleted");
    }

    AuthUserResponse userResponse = new AuthUserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail());

    String newAccessToken = jwtService.generateToken(user.getId().toString(), user.getEmail());
    String newRefreshToken = refreshTokenService.createRefreshToken(user);
    long expiresIn = jwtService.getExpirationInSeconds();

    return new LoginResponse(
        true,
        "Token refreshed successfully",
        userResponse,
        newAccessToken,
        newRefreshToken,
        expiresIn);
  }

  @Transactional
  public Map<String, Object> logout(LogoutRequest request, String currentUserEmail) {
    if (request != null && request.getRefreshToken() != null && !request.getRefreshToken().isBlank()) {
      refreshTokenService.revokeRefreshToken(request.getRefreshToken());
    } else if (currentUserEmail != null && !currentUserEmail.isBlank()) {
      userRepository.findByEmail(currentUserEmail).ifPresent(refreshTokenService::revokeAllUserTokens);
    }

    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Logged out successfully");
    return response;
  }

  @Transactional
  public Map<String, Object> verifyEmail(VerifyEmailRequest request) {
    String rawToken = request.getToken().trim();
    String tokenHash = hashToken(rawToken);

    EmailVerificationToken verificationToken = verificationTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new InvalidPasswordException("Invalid or expired email verification token"));

    if (verificationToken.getUsedAt() != null) {
      throw new InvalidPasswordException("Email verification token has already been used");
    }

    if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new InvalidPasswordException("Email verification token has expired");
    }

    User user = verificationToken.getUser();
    user.setEmailVerified(true);
    user.setEmailVerifiedAt(LocalDateTime.now());
    userRepository.save(user);

    verificationToken.setUsedAt(LocalDateTime.now());
    verificationTokenRepository.save(verificationToken);

    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Email verified successfully");
    return response;
  }

  @Transactional
  public Map<String, Object> forgotPassword(ForgotPasswordRequest request) {
    String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

    Optional<User> userOptional = userRepository.findByEmail(email);

    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "If an account with that email exists, password reset instructions have been generated.");

    if (userOptional.isPresent()) {
      User user = userOptional.get();

      if (user.getStatus() == UserStatus.ACTIVE) {
        String rawToken = UUID.randomUUID().toString();
        String tokenHash = hashToken(rawToken);

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken = new PasswordResetToken(user, tokenHash, expiresAt);
        tokenRepository.save(resetToken);
      }
    }

    return response;
  }

  @Transactional
  public Map<String, Object> resetPassword(ResetPasswordRequest request) {
    String rawToken = request.getToken().trim();
    String tokenHash = hashToken(rawToken);

    PasswordResetToken resetToken = tokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new InvalidPasswordException("Invalid or expired password reset token"));

    if (resetToken.getUsedAt() != null) {
      throw new InvalidPasswordException("Password reset token has already been used");
    }

    if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new InvalidPasswordException("Password reset token has expired");
    }

    User user = resetToken.getUser();
    if (user.getStatus() != UserStatus.ACTIVE) {
      throw new InvalidPasswordException("Associated account is inactive or deleted");
    }

    String hashedNewPassword = passwordEncoder.encode(request.getNewPassword());
    user.setPassword(hashedNewPassword);
    userRepository.save(user);

    resetToken.setUsedAt(LocalDateTime.now());
    tokenRepository.save(resetToken);

    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Password has been reset successfully");
    return response;
  }

  private String hashToken(String rawToken) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hashBytes = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
      StringBuilder sb = new StringBuilder();
      for (byte b : hashBytes) {
        sb.append(String.format("%02x", b));
      }
      return sb.toString();
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("Error hashing reset token", e);
    }
  }
}
