package com.relaxit.backend.controller;

import com.relaxit.backend.dto.device.CreateDeviceRequest;
import com.relaxit.backend.dto.device.DeviceResponse;
import com.relaxit.backend.dto.device.UpdateDeviceRequest;
import com.relaxit.backend.service.DeviceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.relaxit.backend.dto.device.ProvisionDeviceResponse;

@RestController
@RequestMapping("/api/v1/devices")
public class DeviceController {

  private final DeviceService deviceService;

  public DeviceController(DeviceService deviceService) {
    this.deviceService = deviceService;
  }

  private String getAuthenticatedUserEmail() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication.getName();
  }

  @PostMapping("/{id}/provision")
  public ResponseEntity<ProvisionDeviceResponse> provisionDevice(@PathVariable UUID id) {
    String email = getAuthenticatedUserEmail();
    ProvisionDeviceResponse response = deviceService.provisionDevice(email, id);
    return ResponseEntity.ok(response);
  }

  @PostMapping
  public ResponseEntity<DeviceResponse> registerDevice(
      @Valid @RequestBody CreateDeviceRequest request) {
    String email = getAuthenticatedUserEmail();
    DeviceResponse response = deviceService.registerDevice(email, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping
  public ResponseEntity<List<DeviceResponse>> getUserDevices() {
    String email = getAuthenticatedUserEmail();
    List<DeviceResponse> response = deviceService.getUserDevices(email);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<DeviceResponse> getDeviceById(@PathVariable UUID id) {
    String email = getAuthenticatedUserEmail();
    DeviceResponse response = deviceService.getDeviceById(email, id);
    return ResponseEntity.ok(response);
  }

  @PutMapping("/{id}")
  public ResponseEntity<DeviceResponse> updateDevice(
      @PathVariable UUID id,
      @Valid @RequestBody UpdateDeviceRequest request) {
    String email = getAuthenticatedUserEmail();
    DeviceResponse response = deviceService.updateDevice(email, id, request);
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, Object>> deleteDevice(@PathVariable UUID id) {
    String email = getAuthenticatedUserEmail();
    deviceService.deleteDevice(email, id);

    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Device successfully deleted/unpaired");

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}/status")
  public ResponseEntity<Map<String, Object>> getDeviceStatus(@PathVariable UUID id) {
    String email = getAuthenticatedUserEmail();
    Map<String, Object> statusMap = deviceService.getDeviceStatus(email, id);
    return ResponseEntity.ok(statusMap);
  }
}
