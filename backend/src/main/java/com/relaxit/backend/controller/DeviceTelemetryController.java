package com.relaxit.backend.controller;

import com.relaxit.backend.dto.telemetry.TelemetryRequest;
import com.relaxit.backend.dto.telemetry.TelemetryResponse;
import com.relaxit.backend.security.DevicePrincipal;
import com.relaxit.backend.service.TelemetryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/device-telemetry")
public class DeviceTelemetryController {

  private final TelemetryService telemetryService;

  public DeviceTelemetryController(TelemetryService telemetryService) {
    this.telemetryService = telemetryService;
  }

  private DevicePrincipal getAuthenticatedDevicePrincipal() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof DevicePrincipal)) {
      throw new IllegalStateException("Authenticated device context missing");
    }
    return (DevicePrincipal) auth.getPrincipal();
  }

  @PostMapping
  public ResponseEntity<TelemetryResponse> ingestTelemetry(@Valid @RequestBody TelemetryRequest request) {
    DevicePrincipal principal = getAuthenticatedDevicePrincipal();
    TelemetryResponse response = telemetryService.processTelemetry(principal, request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/heartbeat")
  public ResponseEntity<Map<String, Object>> sendHeartbeat() {
    DevicePrincipal principal = getAuthenticatedDevicePrincipal();
    telemetryService.processHeartbeat(principal);

    Map<String, Object> res = new HashMap<>();
    res.put("success", true);
    res.put("status", "ONLINE");
    return ResponseEntity.ok(res);
  }
}
