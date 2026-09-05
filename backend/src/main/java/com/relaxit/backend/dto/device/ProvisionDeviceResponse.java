package com.relaxit.backend.dto.device;

import java.time.LocalDateTime;

public class ProvisionDeviceResponse {

  private String deviceIdentifier;
  private String deviceSecret;
  private LocalDateTime provisionedAt;

  public ProvisionDeviceResponse() {
  }

  public ProvisionDeviceResponse(String deviceIdentifier, String deviceSecret, LocalDateTime provisionedAt) {
    this.deviceIdentifier = deviceIdentifier;
    this.deviceSecret = deviceSecret;
    this.provisionedAt = provisionedAt;
  }

  public String getDeviceIdentifier() {
    return deviceIdentifier;
  }

  public void setDeviceIdentifier(String deviceIdentifier) {
    this.deviceIdentifier = deviceIdentifier;
  }

  public String getDeviceSecret() {
    return deviceSecret;
  }

  public void setDeviceSecret(String deviceSecret) {
    this.deviceSecret = deviceSecret;
  }

  public LocalDateTime getProvisionedAt() {
    return provisionedAt;
  }

  public void setProvisionedAt(LocalDateTime provisionedAt) {
    this.provisionedAt = provisionedAt;
  }
}
