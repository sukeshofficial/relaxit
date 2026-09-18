package com.relaxit.backend.service;

import com.relaxit.backend.entity.RefreshToken;
import com.relaxit.backend.entity.User;
import com.relaxit.backend.exception.InvalidPasswordException;
import com.relaxit.backend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class RefreshTokenService {

  private final RefreshTokenRepository refreshTokenRepository;
  private final long refreshTokenExpirationMs;

  public RefreshTokenService(
      RefreshTokenRepository refreshTokenRepository,
      @Value("${app.jwt.refresh-expiration-ms:604800000}") long refreshTokenExpirationMs) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.refreshTokenExpirationMs = refreshTokenExpirationMs;
  }

  @Transactional
  public String createRefreshToken(User user) {
    byte[] randomBytes = new byte[32];
    new SecureRandom().nextBytes(randomBytes);
    String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

    String tokenHash = hashToken(rawToken);
    LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(refreshTokenExpirationMs / 1000);

    RefreshToken refreshToken = new RefreshToken(user, tokenHash, expiresAt);
    refreshTokenRepository.save(refreshToken);

    return rawToken;
  }

  @Transactional
  public RefreshToken verifyAndRotateRefreshToken(String rawToken) {
    String tokenHash = hashToken(rawToken);

    RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
        .orElseThrow(() -> new InvalidPasswordException("Invalid or expired refresh token"));

    if (refreshToken.getRevokedAt() != null) {
      // Security measure: Token reuse detected. Revoke all user tokens.
      revokeAllUserTokens(refreshToken.getUser());
      throw new InvalidPasswordException("Refresh token has been revoked due to reuse detection");
    }

    if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
      throw new InvalidPasswordException("Refresh token has expired");
    }

    // Revoke old refresh token (Rotation)
    refreshToken.setRevokedAt(LocalDateTime.now());
    refreshTokenRepository.save(refreshToken);

    return refreshToken;
  }

  @Transactional
  public void revokeRefreshToken(String rawToken) {
    if (rawToken == null || rawToken.isBlank()) {
      return;
    }
    String tokenHash = hashToken(rawToken);
    refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
      token.setRevokedAt(LocalDateTime.now());
      refreshTokenRepository.save(token);
    });
  }

  @Transactional
  public void revokeAllUserTokens(User user) {
    List<RefreshToken> activeTokens = refreshTokenRepository.findAllByUserAndRevokedAtIsNull(user);
    LocalDateTime now = LocalDateTime.now();
    for (RefreshToken token : activeTokens) {
      token.setRevokedAt(now);
    }
    refreshTokenRepository.saveAll(activeTokens);
  }

  public String hashToken(String rawToken) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hashBytes = digest.digest(rawToken.trim().getBytes(StandardCharsets.UTF_8));
      StringBuilder sb = new StringBuilder();
      for (byte b : hashBytes) {
        sb.append(String.format("%02x", b));
      }
      return sb.toString();
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("Error hashing token", e);
    }
  }
}
