package com.relaxit.backend.dto.device;

import com.relaxit.backend.entity.SensorMeasurement;
import com.relaxit.backend.entity.SensorType;

import java.time.LocalDateTime;
import java.util.UUID;

public class SensorMeasurementResponse {

  private UUID id;
  private UUID deviceId;
  private UUID sessionId;
  private LocalDateTime timestamp;
  private SensorType sensorType;
  private Double value;
  private String unit;

  public SensorMeasurementResponse() {
  }

  public SensorMeasurementResponse(UUID id, UUID deviceId, UUID sessionId, LocalDateTime timestamp,
      SensorType sensorType, Double value, String unit) {
    this.id = id;
    this.deviceId = deviceId;
    this.sessionId = sessionId;
    this.timestamp = timestamp;
    this.sensorType = sensorType;
    this.value = value;
    this.unit = unit;
  }

  public static SensorMeasurementResponse fromEntity(SensorMeasurement entity) {
    if (entity == null) {
      return null;
    }
    return new SensorMeasurementResponse(
        entity.getId(),
        entity.getDevice() != null ? entity.getDevice().getId() : null,
        entity.getSession() != null ? entity.getSession().getId() : null,
        entity.getTimestamp(),
        entity.getSensorType(),
        entity.getValue(),
        entity.getUnit());
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

  public UUID getSessionId() {
    return sessionId;
  }

  public void setSessionId(UUID sessionId) {
    this.sessionId = sessionId;
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
}
