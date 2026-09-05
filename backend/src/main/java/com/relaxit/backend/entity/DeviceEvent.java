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
    name = "device_events",
    indexes = {
        @Index(name = "idx_device_events_device_time", columnList = "device_id, timestamp DESC"),
        @Index(name = "idx_device_events_type", columnList = "event_type")
    }
)
public class DeviceEvent {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "device_id", nullable = false)
  private Device device;

  @Enumerated(EnumType.STRING)
  @Column(name = "event_type", nullable = false, length = 30)
  private DeviceEventType eventType;

  @Column(nullable = false)
  private LocalDateTime timestamp;

  @Column(length = 1000)
  private String details;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  // =========================
  // Constructors
  // =========================

  public DeviceEvent() {
  }

  public DeviceEvent(Device device, DeviceEventType eventType, LocalDateTime timestamp, String details) {
    this.device = device;
    this.eventType = eventType;
    this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    this.details = details;
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

  public DeviceEventType getEventType() {
    return eventType;
  }

  public void setEventType(DeviceEventType eventType) {
    this.eventType = eventType;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
