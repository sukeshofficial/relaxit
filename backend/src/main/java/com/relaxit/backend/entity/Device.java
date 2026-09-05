package com.relaxit.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "devices", uniqueConstraints = {
    @UniqueConstraint(name = "uk_devices_identifier", columnNames = "device_identifier")
})
public class Device {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Column(name = "device_identifier", nullable = false, unique = true, length = 100)
  private String deviceIdentifier;

  @Column(nullable = false, length = 100)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'OFFLINE'")
  private DeviceStatus status = DeviceStatus.OFFLINE;

  @Column(name = "firmware_version", length = 50)
  private String firmwareVersion;

  @Column(name = "device_secret_hash", length = 255)
  private String deviceSecretHash;

  @Column(name = "provisioned_at")
  private LocalDateTime provisionedAt;

  @Column(name = "last_seen_at")
  private LocalDateTime lastSeenAt;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  // =========================
  // Constructors
  // =========================

  public Device() {
  }

  public Device(String deviceIdentifier, String name, User user) {
    this.deviceIdentifier = deviceIdentifier;
    this.name = name;
    this.user = user;
    this.status = DeviceStatus.OFFLINE;
  }

  // =========================
  // Lifecycle Hooks
  // =========================

  @PrePersist
  protected void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
    if (this.status == null) {
      this.status = DeviceStatus.OFFLINE;
    }
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
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

  public String getDeviceIdentifier() {
    return deviceIdentifier;
  }

  public void setDeviceIdentifier(String deviceIdentifier) {
    this.deviceIdentifier = deviceIdentifier;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public DeviceStatus getStatus() {
    return status;
  }

  public void setStatus(DeviceStatus status) {
    this.status = status;
  }

  public String getFirmwareVersion() {
    return firmwareVersion;
  }

  public void setFirmwareVersion(String firmwareVersion) {
    this.firmwareVersion = firmwareVersion;
  }

  public String getDeviceSecretHash() {
    return deviceSecretHash;
  }

  public void setDeviceSecretHash(String deviceSecretHash) {
    this.deviceSecretHash = deviceSecretHash;
  }

  public LocalDateTime getProvisionedAt() {
    return provisionedAt;
  }

  public void setProvisionedAt(LocalDateTime provisionedAt) {
    this.provisionedAt = provisionedAt;
  }

  public LocalDateTime getLastSeenAt() {
    return lastSeenAt;
  }

  public void setLastSeenAt(LocalDateTime lastSeenAt) {
    this.lastSeenAt = lastSeenAt;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }
}
