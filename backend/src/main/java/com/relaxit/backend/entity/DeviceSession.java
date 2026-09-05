package com.relaxit.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "device_sessions",
    indexes = {
        @Index(name = "idx_device_sessions_device_status", columnList = "device_id, status"),
        @Index(name = "idx_device_sessions_user_started", columnList = "user_id, started_at DESC")
    }
)
public class DeviceSession {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "device_id", nullable = false)
  private Device device;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "started_at", nullable = false, updatable = false)
  private LocalDateTime startedAt;

  @Column(name = "ended_at")
  private LocalDateTime endedAt;

  @Column(name = "duration_seconds")
  private Long durationSeconds;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private SessionStatus status = SessionStatus.ACTIVE;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  // =========================
  // Constructors
  // =========================

  public DeviceSession() {
  }

  public DeviceSession(Device device, User user) {
    this.device = device;
    this.user = user;
    this.startedAt = LocalDateTime.now();
    this.status = SessionStatus.ACTIVE;
  }

  // =========================
  // Lifecycle Hooks
  // =========================

  @PrePersist
  protected void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    if (this.startedAt == null) {
      this.startedAt = now;
    }
    this.createdAt = now;
    this.updatedAt = now;
    if (this.status == null) {
      this.status = SessionStatus.ACTIVE;
    }
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  // =========================
  // Business Helper Methods
  // =========================

  public void endSession(SessionStatus endStatus) {
    this.endedAt = LocalDateTime.now();
    this.status = endStatus != null ? endStatus : SessionStatus.COMPLETED;
    if (this.startedAt != null) {
      this.durationSeconds = java.time.Duration.between(this.startedAt, this.endedAt).getSeconds();
    }
  }

  // =========================
  // Getters and Setters
  // =========================

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public Device getDevice() {
    return device;
  }

  public void setDevice(Device device) {
    this.device = device;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public LocalDateTime getStartedAt() {
    return startedAt;
  }

  public void setStartedAt(LocalDateTime startedAt) {
    this.startedAt = startedAt;
  }

  public LocalDateTime getEndedAt() {
    return endedAt;
  }

  public void setEndedAt(LocalDateTime endedAt) {
    this.endedAt = endedAt;
  }

  public Long getDurationSeconds() {
    return durationSeconds;
  }

  public void setDurationSeconds(Long durationSeconds) {
    this.durationSeconds = durationSeconds;
  }

  public SessionStatus getStatus() {
    return status;
  }

  public void setStatus(SessionStatus status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }
}
