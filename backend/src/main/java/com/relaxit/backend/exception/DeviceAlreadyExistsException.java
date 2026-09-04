package com.relaxit.backend.exception;

public class DeviceAlreadyExistsException extends RuntimeException {

  public DeviceAlreadyExistsException(String message) {
    super(message);
  }
}
