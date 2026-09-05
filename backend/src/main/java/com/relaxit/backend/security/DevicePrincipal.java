package com.relaxit.backend.security;

import com.relaxit.backend.entity.Device;

import java.io.Serializable;
import java.util.UUID;

public class DevicePrincipal implements Serializable {

  private final UUID deviceId;
  private final String deviceIdentifier;
  private final UUID userId;

  public DevicePrincipal(Device device) {
    this.deviceId = device.getId();
    this.deviceIdentifier = device.getDeviceIdentifier();
    this.userId = device.getUser() != null ? device.getUser().getId() : null;
  }

  public UUID getDeviceId() {
    return deviceId;
  }

  public String getDeviceIdentifier() {
    return deviceIdentifier;
  }

  public UUID getUserId() {
    return userId;
  }
}
