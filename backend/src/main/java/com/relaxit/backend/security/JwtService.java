package com.relaxit.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

  private final String secretKey;
  private final String issuer;
  private final long expirationMs;

  public JwtService(
      @Value("${app.jwt.secret}") String secretKey,
      @Value("${app.jwt.issuer}") String issuer,
      @Value("${app.jwt.expiration-ms}") long expirationMs) {
    this.secretKey = secretKey;
    this.issuer = issuer;
    this.expirationMs = expirationMs;
  }

  public String generateToken(String userId, String email) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + expirationMs);

    return Jwts.builder()
        .subject(userId)
        .claim("email", email)
        .issuer(issuer)
        .issuedAt(now)
        .expiration(expiryDate)
        .signWith(getSigningKey())
        .compact();
  }

  public String extractUserId(String token) {
    return parseClaims(token).getSubject();
  }

  public String extractEmail(String token) {
    return parseClaims(token).get("email", String.class);
  }

  public boolean validateToken(String token) {
    try {
      Claims claims = parseClaims(token);
      boolean isIssuerValid = issuer.equals(claims.getIssuer());
      boolean isNotExpired = !claims.getExpiration().before(new Date());
      return isIssuerValid && isNotExpired;
    } catch (Exception e) {
      return false;
    }
  }

  public long getExpirationInSeconds() {
    return expirationMs / 1000;
  }

  private Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private SecretKey getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
