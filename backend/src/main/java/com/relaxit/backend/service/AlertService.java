package com.relaxit.backend.service;

import com.relaxit.backend.entity.Alert;
import com.relaxit.backend.entity.AlertType;
import com.relaxit.backend.entity.Device;
import com.relaxit.backend.repository.AlertRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AlertService {

  private final AlertRepository alertRepository;

  public AlertService(AlertRepository alertRepository) {
    this.alertRepository = alertRepository;
  }

  @Transactional
  public void createAlert(Device device, AlertType type, String message) {
    if (device.getUser() == null) {
      return;
    }
    Alert alert = new Alert(device.getUser(), device, type, message);
    alertRepository.save(alert);
  }

  public Page<Alert> getDeviceAlerts(UUID deviceId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    return alertRepository.findByDeviceIdOrderByCreatedAtDesc(deviceId, pageable);
  }

  @Transactional
  public Alert acknowledgeAlert(String userEmail, UUID alertId) {
    Alert alert = alertRepository.findById(alertId)
        .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + alertId));

    if (alert.getUser() == null || !alert.getUser().getEmail().equalsIgnoreCase(userEmail)) {
      throw new IllegalArgumentException("Alert not found with id: " + alertId);
    }

    if (alert.getAcknowledgedAt() == null) {
      alert.setAcknowledgedAt(LocalDateTime.now());
      alert = alertRepository.save(alert);
    }

    return alert;
  }
}
