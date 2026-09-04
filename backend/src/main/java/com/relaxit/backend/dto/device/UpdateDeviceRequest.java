package com.relaxit.backend.dto.device;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateDeviceRequest {

  @NotBlank(message = "Device name is required")
  @Size(max = 100, message = "Device name must not exceed 100 characters")
  private String name;

  public UpdateDeviceRequest() {
  }

  public UpdateDeviceRequest(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
