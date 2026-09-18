package com.relaxit.backend.controller;

import com.relaxit.backend.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

  private final AlertService alertService;

  public AlertController(AlertService alertService) {
    this.alertService = alertService;
  }

  private String getAuthenticatedUserEmail() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication.getName();
  }

  @PostMapping("/{id}/acknowledge")
  public ResponseEntity<Map<String, Object>> acknowledgeAlert(@PathVariable("id") UUID alertId) {
    String email = getAuthenticatedUserEmail();
    alertService.acknowledgeAlert(email, alertId);

    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Alert acknowledged successfully");
    return ResponseEntity.ok(response);
  }
}
