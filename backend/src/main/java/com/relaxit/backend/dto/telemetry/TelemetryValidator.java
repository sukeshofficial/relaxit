package com.relaxit.backend.dto.telemetry;

import com.relaxit.backend.entity.SensorType;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TelemetryValidator {

  public void validate(TelemetryRequest request) {
    if (request == null) {
      throw new IllegalArgumentException("Telemetry request cannot be null");
    }

    if (request.getTimestamp() != null && request.getTimestamp().isAfter(LocalDateTime.now().plusMinutes(5))) {
      throw new IllegalArgumentException("Telemetry timestamp cannot be in the future");
    }

    if (request.getReadings() != null) {
      for (SensorReadingDTO reading : request.getReadings()) {
        validateSensorReading(reading);
      }
    }
  }

  private void validateSensorReading(SensorReadingDTO reading) {
    if (reading == null || reading.getSensorType() == null || reading.getValue() == null) {
      return;
    }

    SensorType type = reading.getSensorType();
    double val = reading.getValue();

    switch (type) {
      case PRESSURE_UL:
      case PRESSURE_UR:
      case PRESSURE_LL:
      case PRESSURE_LR:
        if (val < 0.0 || val > 150.0) {
          throw new IllegalArgumentException("Pressure reading out of physical range (0 - 150 kPa): " + val);
        }
        break;
      case ACCEL_X:
      case ACCEL_Y:
      case ACCEL_Z:
        if (val < -16.0 || val > 16.0) {
          throw new IllegalArgumentException("Accelerometer reading out of physical range (-16g to +16g): " + val);
        }
        break;
      case GYRO_X:
      case GYRO_Y:
      case GYRO_Z:
        if (val < -2000.0 || val > 2000.0) {
          throw new IllegalArgumentException("Gyroscope reading out of physical range (-2000 to +2000 deg/s): " + val);
        }
        break;
      case TEMPERATURE:
        if (val < -40.0 || val > 85.0) {
          throw new IllegalArgumentException("Temperature reading out of physical range (-40 to +85 C): " + val);
        }
        break;
      case BATTERY:
        if (val < 0.0 || val > 100.0) {
          throw new IllegalArgumentException("Battery level out of range (0 - 100%): " + val);
        }
        break;
      default:
        break;
    }
  }
}
