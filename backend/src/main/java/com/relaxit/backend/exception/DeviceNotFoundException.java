package com.relaxit.backend.exception;

public class DeviceNotFoundException extends RuntimeException {

  public DeviceNotFoundException(String message) {
    super(message);
  }
}
