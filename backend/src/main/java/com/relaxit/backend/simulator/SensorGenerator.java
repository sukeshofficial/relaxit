package com.relaxit.backend.simulator;

import com.relaxit.backend.dto.telemetry.SensorReadingDTO;
import com.relaxit.backend.dto.telemetry.TelemetryRequest;
import com.relaxit.backend.entity.SensorType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class SensorGenerator {

  private final Random random;

  public SensorGenerator() {
    this.random = new Random();
  }

  public SensorGenerator(long seed) {
    this.random = new Random(seed);
  }

  public TelemetryRequest generateTelemetry(SimulationState state, LocalDateTime timestamp) {
    List<SensorReadingDTO> readings = new ArrayList<>();

    // Noise bounds
    double pressureNoise = (random.nextDouble() - 0.5) * 1.0; // +/- 0.5 kPa
    double accelNoise = (random.nextDouble() - 0.5) * 0.1; // +/- 0.05 m/s^2
    double gyroNoise = (random.nextDouble() - 0.5) * 0.5; // +/- 0.25 deg/s
    double tempNoise = (random.nextDouble() - 0.5) * 0.05; // +/- 0.025 °C

    // FSR Sensors
    readings.add(new SensorReadingDTO(SensorType.PRESSURE_UL,
        Math.max(0.0, round(state.getUlPressure() + pressureNoise)), "kPa"));
    readings.add(new SensorReadingDTO(SensorType.PRESSURE_UR,
        Math.max(0.0, round(state.getUrPressure() + pressureNoise)), "kPa"));
    readings.add(new SensorReadingDTO(SensorType.PRESSURE_LL,
        Math.max(0.0, round(state.getLlPressure() + pressureNoise)), "kPa"));
    readings.add(new SensorReadingDTO(SensorType.PRESSURE_LR,
        Math.max(0.0, round(state.getLrPressure() + pressureNoise)), "kPa"));

    // MPU-6050 IMU Sensors
    readings.add(new SensorReadingDTO(SensorType.ACCEL_X, round(state.getAccelX() + accelNoise), "m/s^2"));
    readings.add(new SensorReadingDTO(SensorType.ACCEL_Y, round(state.getAccelY() + accelNoise), "m/s^2"));
    readings.add(new SensorReadingDTO(SensorType.ACCEL_Z, round(state.getAccelZ() + accelNoise), "m/s^2"));

    readings.add(new SensorReadingDTO(SensorType.GYRO_X, round(state.getGyroX() + gyroNoise), "deg/s"));
    readings.add(new SensorReadingDTO(SensorType.GYRO_Y, round(state.getGyroY() + gyroNoise), "deg/s"));
    readings.add(new SensorReadingDTO(SensorType.GYRO_Z, round(state.getGyroZ() + gyroNoise), "deg/s"));

    // Temperature & Battery
    readings.add(new SensorReadingDTO(SensorType.TEMPERATURE, round(state.getTemperature() + tempNoise), "CELSIUS"));
    readings.add(new SensorReadingDTO(SensorType.BATTERY, round(state.getBatteryLevel()), "PERCENT"));

    int batteryLevelInt = (int) Math.round(state.getBatteryLevel());
    return new TelemetryRequest(timestamp, batteryLevelInt, readings);
  }

  private double round(double val) {
    return Math.round(val * 100.0) / 100.0;
  }
}
