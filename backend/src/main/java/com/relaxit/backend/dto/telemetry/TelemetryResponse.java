package com.relaxit.backend.dto.telemetry;

import com.relaxit.backend.entity.PostureType;

import java.time.LocalDateTime;
import java.util.UUID;

public class TelemetryResponse {

  private boolean success;
  private UUID sessionId;
  private PostureType currentPosture;
  private Integer postureScore;
  private LocalDateTime processedAt;

  public TelemetryResponse() {
  }

  public TelemetryResponse(boolean success, UUID sessionId, PostureType currentPosture, Integer postureScore, LocalDateTime processedAt) {
    this.success = success;
    this.sessionId = sessionId;
    this.currentPosture = currentPosture;
    this.postureScore = postureScore;
    this.processedAt = processedAt;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public UUID getSessionId() {
    return sessionId;
  }

  public void setSessionId(UUID sessionId) {
    this.sessionId = sessionId;
  }

  public PostureType getCurrentPosture() {
    return currentPosture;
  }

  public void setCurrentPosture(PostureType currentPosture) {
    this.currentPosture = currentPosture;
  }

  public Integer getPostureScore() {
    return postureScore;
  }

  public void setPostureScore(Integer postureScore) {
    this.postureScore = postureScore;
  }

  public LocalDateTime getProcessedAt() {
    return processedAt;
  }

  public void setProcessedAt(LocalDateTime processedAt) {
    this.processedAt = processedAt;
  }
}
