package com.relaxit.backend.dto.telemetry;

import com.relaxit.backend.entity.SensorType;
import jakarta.validation.constraints.NotNull;

public class SensorReadingDTO {

  @NotNull(message = "Sensor type is required")
  private SensorType sensorType;

  @NotNull(message = "Sensor value is required")
  private Double value;

  private String unit;

  public SensorReadingDTO() {
  }

  public SensorReadingDTO(SensorType sensorType, Double value, String unit) {
    this.sensorType = sensorType;
    this.value = value;
    this.unit = unit;
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
