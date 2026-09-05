package com.relaxit.backend.dto.telemetry;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class TelemetryRequest {

  @NotNull(message = "Timestamp is required")
  private LocalDateTime timestamp;

  @Min(value = 0, message = "Battery level cannot be negative")
  @Max(value = 100, message = "Battery level cannot exceed 100")
  private Integer batteryLevel;

  @NotEmpty(message = "Telemetry readings list cannot be empty")
  @Valid
  private List<SensorReadingDTO> readings;

  public TelemetryRequest() {
  }

  public TelemetryRequest(LocalDateTime timestamp, Integer batteryLevel, List<SensorReadingDTO> readings) {
    this.timestamp = timestamp;
    this.batteryLevel = batteryLevel;
    this.readings = readings;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public Integer getBatteryLevel() {
    return batteryLevel;
  }

  public void setBatteryLevel(Integer batteryLevel) {
    this.batteryLevel = batteryLevel;
  }

  public List<SensorReadingDTO> getReadings() {
    return readings;
  }

  public void setReadings(List<SensorReadingDTO> readings) {
    this.readings = readings;
  }
}
