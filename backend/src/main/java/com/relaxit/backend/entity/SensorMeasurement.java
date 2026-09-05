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
    name = "sensor_measurements",
    indexes = {
        @Index(name = "idx_sensor_measurements_device_time", columnList = "device_id, timestamp DESC"),
        @Index(name = "idx_sensor_measurements_session_time", columnList = "session_id, timestamp DESC"),
        @Index(name = "idx_sensor_measurements_type_time", columnList = "sensor_type, timestamp DESC")
    }
)
public class SensorMeasurement {

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
  @Column(name = "sensor_type", nullable = false, length = 30)
  private SensorType sensorType;

  @Column(name = "sensor_value", nullable = false)
  private Double value;

  @Column(length = 20)
  private String unit;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  // =========================
  // Constructors
  // =========================

  public SensorMeasurement() {
  }

  public SensorMeasurement(Device device, DeviceSession session, LocalDateTime timestamp, SensorType sensorType, Double value, String unit) {
    this.device = device;
    this.session = session;
    this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    this.sensorType = sensorType;
    this.value = value;
    this.unit = unit;
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

  public SensorType getSensorType() {
    return sensorType;
  }

  public void setSensorType(SensorType sensorType) {
    this.sensorType = sensorType;
  }

  public Double getValue() {
    return value;
  }

  public void setValue(Double value) {
    this.value = value;
  }

  public String getUnit() {
    return unit;
  }

  public void setUnit(String unit) {
    this.unit = unit;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
}
