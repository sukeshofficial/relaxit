package com.relaxit.backend.dto.device;

import com.relaxit.backend.entity.PostureMeasurement;
import com.relaxit.backend.entity.PostureType;

import java.time.LocalDateTime;
import java.util.UUID;

public class PostureResponse {

  private UUID id;
  private UUID deviceId;
  private UUID sessionId;
  private LocalDateTime timestamp;
  private PostureType postureType;
  private Integer score;

  public PostureResponse() {
  }

  public static PostureResponse fromEntity(PostureMeasurement p) {
    PostureResponse dto = new PostureResponse();
    dto.setId(p.getId());
    dto.setDeviceId(p.getDevice().getId());
    dto.setSessionId(p.getSession() != null ? p.getSession().getId() : null);
    dto.setTimestamp(p.getTimestamp());
    dto.setPostureType(p.getPostureType());
    dto.setScore(p.getScore());
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

  public UUID getSessionId() {
    return sessionId;
  }

  public void setSessionId(UUID sessionId) {
    this.sessionId = sessionId;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }

  public PostureType getPostureType() {
    return postureType;
  }

  public void setPostureType(PostureType postureType) {
    this.postureType = postureType;
  }

  public Integer getScore() {
    return score;
  }

  public void setScore(Integer score) {
    this.score = score;
  }
}
