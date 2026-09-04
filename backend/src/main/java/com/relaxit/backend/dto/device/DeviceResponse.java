package com.relaxit.backend.dto.device;

import com.relaxit.backend.entity.Device;
import com.relaxit.backend.entity.DeviceStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class DeviceResponse {

  private UUID id;
  private String deviceIdentifier;
  private String name;
  private DeviceStatus status;
  private String firmwareVersion;
  private LocalDateTime lastSeenAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public DeviceResponse() {
  }

  public DeviceResponse(
      UUID id,
      String deviceIdentifier,
      String name,
      DeviceStatus status,
      String firmwareVersion,
      LocalDateTime lastSeenAt,
      LocalDateTime createdAt,
      LocalDateTime updatedAt) {
    this.id = id;
    this.deviceIdentifier = deviceIdentifier;
    this.name = name;
    this.status = status;
    this.firmwareVersion = firmwareVersion;
    this.lastSeenAt = lastSeenAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static DeviceResponse fromEntity(Device device) {
    if (device == null) {
      return null;
    }
    return new DeviceResponse(
        device.getId(),
        device.getDeviceIdentifier(),
        device.getName(),
        device.getStatus(),
        device.getFirmwareVersion(),
        device.getLastSeenAt(),
        device.getCreatedAt(),
        device.getUpdatedAt());
  }

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

  public LocalDateTime getLastSeenAt() {
    return lastSeenAt;
  }

  public void setLastSeenAt(LocalDateTime lastSeenAt) {
    this.lastSeenAt = lastSeenAt;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
