package com.relaxit.backend.controller;

import com.relaxit.backend.dto.device.PostureResponse;
import com.relaxit.backend.dto.device.SessionResponse;
import com.relaxit.backend.service.DeviceDataService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.relaxit.backend.dto.device.DeviceStatisticsDTO;
import com.relaxit.backend.entity.Alert;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/devices/{deviceId}")
public class DeviceDataController {

  private final DeviceDataService deviceDataService;

  public DeviceDataController(DeviceDataService deviceDataService) {
    this.deviceDataService = deviceDataService;
  }

  private String getAuthenticatedUserEmail() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication.getName();
  }

  @GetMapping("/statistics")
  public ResponseEntity<DeviceStatisticsDTO> getDeviceStatistics(
      @PathVariable UUID deviceId,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
    String email = getAuthenticatedUserEmail();
    DeviceStatisticsDTO response = deviceDataService.calculateDeviceStatistics(email, deviceId, date);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/alerts")
  public ResponseEntity<Page<Alert>> getDeviceAlerts(
      @PathVariable UUID deviceId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    String email = getAuthenticatedUserEmail();
    Page<Alert> response = deviceDataService.getDeviceAlerts(email, deviceId, page, size);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/sessions")
  public ResponseEntity<Page<SessionResponse>> getDeviceSessions(
      @PathVariable UUID deviceId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    String email = getAuthenticatedUserEmail();
    Page<SessionResponse> response = deviceDataService.getDeviceSessions(email, deviceId, page, size);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/sessions/{sessionId}")
  public ResponseEntity<SessionResponse> getSessionById(
      @PathVariable UUID deviceId,
      @PathVariable UUID sessionId) {
    String email = getAuthenticatedUserEmail();
    SessionResponse response = deviceDataService.getSessionById(email, deviceId, sessionId);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/posture")
  public ResponseEntity<List<PostureResponse>> getPostureHistory(
      @PathVariable UUID deviceId,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
    String email = getAuthenticatedUserEmail();
    List<PostureResponse> response = deviceDataService.getPostureHistory(email, deviceId, from, to);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/posture/page")
  public ResponseEntity<Page<PostureResponse>> getPaginatedPostureHistory(
      @PathVariable UUID deviceId,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "50") int size) {
    String email = getAuthenticatedUserEmail();
    Page<PostureResponse> response = deviceDataService.getPaginatedPostureHistory(email, deviceId, from, to, page,
        size);
    return ResponseEntity.ok(response);
  }
}
