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
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "posture_measurements",
    indexes = {
        @Index(name = "idx_posture_measurements_device_time", columnList = "device_id, timestamp DESC"),
        @Index(name = "idx_posture_measurements_session_time", columnList = "session_id, timestamp DESC")
    }
)
public class PostureMeasurement {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "device_id", nullable = false)
  private Device device;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "session_id")
  private DeviceSession session;

  @Column(nullable = false)
  private LocalDateTime timestamp;

  @Enumerated(EnumType.STRING)
  @Column(name = "posture_type", nullable = false, length = 30)
  private PostureType postureType;

  @Column(name = "score", nullable = false)
  private Integer score;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  // =========================
  // Constructors
  // =========================

  public PostureMeasurement() {
  }

  public PostureMeasurement(Device device, DeviceSession session, LocalDateTime timestamp, PostureType postureType, Integer score) {
    this.device = device;
    this.session = session;
    this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    this.postureType = postureType;
    this.score = score;
  }

  // =========================
  // Lifecycle Hooks
  // =========================

  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    if (this.timestamp == null) {
      this.timestamp = this.createdAt;
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

  public DeviceSession getSession() {
    return session;
  }

  public void setSession(DeviceSession session) {
    this.session = session;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public PostureType getPostureType() {
    return postureType;
  }

  public void setPostureType(PostureType postureType) {
    this.postureType = postureType;
  }

  public Integer getScore() {
    return score;
  }

  public void setScore(Integer score) {
    this.score = score;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
