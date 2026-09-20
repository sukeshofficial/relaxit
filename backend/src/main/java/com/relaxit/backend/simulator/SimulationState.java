package com.relaxit.backend.simulator;

import com.relaxit.backend.entity.PostureType;

public class SimulationState {

  private PostureType postureState = PostureType.UNKNOWN;

  // Pressure sensors (in kPa / N)
  private double ulPressure = 0.0;
  private double urPressure = 0.0;
  private double llPressure = 0.0;
  private double lrPressure = 0.0;

  // MPU-6050 (Accel m/s^2, Gyro deg/s)
  private double accelX = 0.0;
  private double accelY = 0.0;
  private double accelZ = 9.81;
  private double gyroX = 0.0;
  private double gyroY = 0.0;
  private double gyroZ = 0.0;

  // Temperature (°C)
  private double temperature = 24.0;
  private String temperatureState = "IDLE"; // IDLE, WARMING, STEADY, COOLING

  // Battery (%)
  private double batteryLevel = 100.0;
  private boolean isCharging = false;

  // Dynamic interpolation towards targets
  private double targetUl = 0.0;
  private double targetUr = 0.0;
  private double targetLl = 0.0;
  private double targetLr = 0.0;

  private double targetAccelX = 0.0;
  private double targetAccelY = 0.0;
  private double targetAccelZ = 9.81;

  public SimulationState() {
  }

  public void setPostureState(PostureType type) {
    this.postureState = type;
    switch (type) {
      case GOOD:
        targetUl = 25.0;
        targetUr = 25.0;
        targetLl = 25.0;
        targetLr = 25.0;
        targetAccelX = 0.0;
        targetAccelY = 0.0;
        targetAccelZ = 9.81;
        this.temperatureState = "WARMING";
        break;

      case LEANING_LEFT:
        targetUl = 45.0;
        targetUr = 10.0;
        targetLl = 40.0;
        targetLr = 10.0;
        targetAccelX = -3.5;
        targetAccelY = 0.5;
        targetAccelZ = 9.1;
        this.temperatureState = "STEADY";
        break;

      case LEANING_RIGHT:
        targetUl = 10.0;
        targetUr = 45.0;
        targetLl = 10.0;
        targetLr = 40.0;
        targetAccelX = 3.5;
        targetAccelY = 0.5;
        targetAccelZ = 9.1;
        this.temperatureState = "STEADY";
        break;

      case FORWARD_LEAN:
        targetUl = 50.0;
        targetUr = 50.0;
        targetLl = 10.0;
        targetLr = 10.0;
        targetAccelX = 0.0;
        targetAccelY = 4.2;
        targetAccelZ = 8.8;
        this.temperatureState = "STEADY";
        break;

      case SLOUCHING:
        targetUl = 5.0;
        targetUr = 5.0;
        targetLl = 45.0;
        targetLr = 45.0;
        targetAccelX = 0.0;
        targetAccelY = -3.8;
        targetAccelZ = 9.0;
        this.temperatureState = "STEADY";
        break;

      case UNKNOWN:
      default:
        targetUl = 0.0;
        targetUr = 0.0;
        targetLl = 0.0;
        targetLr = 0.0;
        targetAccelX = 0.0;
        targetAccelY = 0.0;
        targetAccelZ = 9.81;
        this.temperatureState = "COOLING";
        break;
    }
  }

  public void step(double dtSeconds, double rateAlpha) {
    // Smooth exponential smoothing step toward target
    ulPressure += (targetUl - ulPressure) * rateAlpha;
    urPressure += (targetUr - urPressure) * rateAlpha;
    llPressure += (targetLl - llPressure) * rateAlpha;
    lrPressure += (targetLr - lrPressure) * rateAlpha;

    accelX += (targetAccelX - accelX) * rateAlpha;
    accelY += (targetAccelY - accelY) * rateAlpha;
    accelZ += (targetAccelZ - accelZ) * rateAlpha;

    // Temperature evolution
    if ("WARMING".equals(temperatureState)) {
      temperature = Math.min(36.5, temperature + 0.1 * dtSeconds);
      if (temperature >= 36.5)
        temperatureState = "STEADY";
    } else if ("COOLING".equals(temperatureState)) {
      temperature = Math.max(24.0, temperature - 0.1 * dtSeconds);
      if (temperature <= 24.0)
        temperatureState = "IDLE";
    }

    // Battery gradual discharge (e.g. 0.01% per simulated second)
    if (!isCharging && batteryLevel > 0) {
      batteryLevel = Math.max(0.0, batteryLevel - 0.005 * dtSeconds);
    }
  }

  // Getters & Setters
  public PostureType getPostureState() {
    return postureState;
  }

  public double getUlPressure() {
    return ulPressure;
  }

  public double getUrPressure() {
    return urPressure;
  }

  public double getLlPressure() {
    return llPressure;
  }

  public double getLrPressure() {
    return lrPressure;
  }

  public double getAccelX() {
    return accelX;
  }

  public double getAccelY() {
    return accelY;
  }

  public double getAccelZ() {
    return accelZ;
  }

  public double getGyroX() {
    return gyroX;
  }

  public double getGyroY() {
    return gyroY;
  }

  public double getGyroZ() {
    return gyroZ;
  }

  public double getTemperature() {
    return temperature;
  }

  public String getTemperatureState() {
    return temperatureState;
  }

  public double getBatteryLevel() {
    return batteryLevel;
  }

  public void setBatteryLevel(double batteryLevel) {
    this.batteryLevel = batteryLevel;
  }

  public void setCharging(boolean charging) {
    isCharging = charging;
  }
}
