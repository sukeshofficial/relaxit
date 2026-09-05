package com.relaxit.backend.dto.device;

import java.time.LocalDate;

public class DeviceStatisticsDTO {

  private LocalDate date;
  private long totalSittingMinutes;
  private int averagePostureScore;
  private long goodPostureMinutes;
  private long poorPostureMinutes;
  private long totalSessionsCount;

  public DeviceStatisticsDTO() {
  }

  public DeviceStatisticsDTO(LocalDate date, long totalSittingMinutes, int averagePostureScore, long goodPostureMinutes,
      long poorPostureMinutes, long totalSessionsCount) {
    this.date = date;
    this.totalSittingMinutes = totalSittingMinutes;
    this.averagePostureScore = averagePostureScore;
    this.goodPostureMinutes = goodPostureMinutes;
    this.poorPostureMinutes = poorPostureMinutes;
    this.totalSessionsCount = totalSessionsCount;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public long getTotalSittingMinutes() {
    return totalSittingMinutes;
  }

  public void setTotalSittingMinutes(long totalSittingMinutes) {
    this.totalSittingMinutes = totalSittingMinutes;
  }

  public int getAveragePostureScore() {
    return averagePostureScore;
  }

  public void setAveragePostureScore(int averagePostureScore) {
    this.averagePostureScore = averagePostureScore;
  }

  public long getGoodPostureMinutes() {
    return goodPostureMinutes;
  }

  public void setGoodPostureMinutes(long goodPostureMinutes) {
    this.goodPostureMinutes = goodPostureMinutes;
  }

  public long getPoorPostureMinutes() {
    return poorPostureMinutes;
  }

  public void setPoorPostureMinutes(long poorPostureMinutes) {
    this.poorPostureMinutes = poorPostureMinutes;
  }

  public long getTotalSessionsCount() {
    return totalSessionsCount;
  }

  public void setTotalSessionsCount(long totalSessionsCount) {
    this.totalSessionsCount = totalSessionsCount;
  }
}
