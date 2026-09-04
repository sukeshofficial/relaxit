package com.relaxit.backend.dto.device;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateDeviceRequest {

  @NotBlank(message = "Device identifier is required")
  @Size(max = 100, message = "Device identifier must not exceed 100 characters")
  private String deviceIdentifier;

  @NotBlank(message = "Device name is required")
  @Size(max = 100, message = "Device name must not exceed 100 characters")
  private String name;

  public CreateDeviceRequest() {
  }

  public CreateDeviceRequest(String deviceIdentifier, String name) {
    this.deviceIdentifier = deviceIdentifier;
    this.name = name;
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
}
