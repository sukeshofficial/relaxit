package com.relaxit.backend.dto.device;

import com.relaxit.backend.entity.DeviceEvent;
import com.relaxit.backend.entity.DeviceEventType;

import java.time.LocalDateTime;
import java.util.UUID;

public class DeviceEventResponse {

  private UUID id;
  private UUID deviceId;
  private DeviceEventType eventType;
  private LocalDateTime timestamp;
  private String details;

  public DeviceEventResponse() {
  }

  public DeviceEventResponse(UUID id, UUID deviceId, DeviceEventType eventType, LocalDateTime timestamp,
      String details) {
    this.id = id;
    this.deviceId = deviceId;
    this.eventType = eventType;
    this.timestamp = timestamp;
    this.details = details;
  }

  public static DeviceEventResponse fromEntity(DeviceEvent entity) {
    if (entity == null) {
      return null;
    }
    return new DeviceEventResponse(
        entity.getId(),
        entity.getDevice() != null ? entity.getDevice().getId() : null,
        entity.getEventType(),
        entity.getTimestamp(),
        entity.getDetails());
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UUID getDeviceId() {
    return deviceId;
  }

  public void setDeviceId(UUID deviceId) {
    this.deviceId = deviceId;
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
}
