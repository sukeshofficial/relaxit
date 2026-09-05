package com.relaxit.backend.dto.device;

import com.relaxit.backend.entity.DeviceSession;
import com.relaxit.backend.entity.SessionStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class SessionResponse {

  private UUID id;
  private UUID deviceId;
  private LocalDateTime startedAt;
  private LocalDateTime endedAt;
  private Long durationSeconds;
  private SessionStatus status;

  public SessionResponse() {
  }

  public static SessionResponse fromEntity(DeviceSession session) {
    SessionResponse dto = new SessionResponse();
    dto.setId(session.getId());
    dto.setDeviceId(session.getDevice().getId());
    dto.setStartedAt(session.getStartedAt());
    dto.setEndedAt(session.getEndedAt());
    dto.setDurationSeconds(session.getDurationSeconds());
    dto.setStatus(session.getStatus());
    return dto;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UUID getDeviceId() {
    return deviceId;
  }

  public void setDeviceId(UUID deviceId) {
    this.deviceId = deviceId;
  }

  public LocalDateTime getStartedAt() {
    return startedAt;
  }

  public void setStartedAt(LocalDateTime startedAt) {
    this.startedAt = startedAt;
  }

  public LocalDateTime getEndedAt() {
    return endedAt;
  }

  public void setEndedAt(LocalDateTime endedAt) {
    this.endedAt = endedAt;
  }

  public Long getDurationSeconds() {
    return durationSeconds;
  }

  public void setDurationSeconds(Long durationSeconds) {
    this.durationSeconds = durationSeconds;
  }

  public SessionStatus getStatus() {
    return status;
  }

  public void setStatus(SessionStatus status) {
    this.status = status;
  }
}
