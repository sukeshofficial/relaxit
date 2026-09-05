package com.relaxit.backend.service;

import com.relaxit.backend.dto.device.PostureResponse;
import com.relaxit.backend.dto.device.SessionResponse;
import com.relaxit.backend.entity.Device;
import com.relaxit.backend.entity.DeviceSession;
import com.relaxit.backend.entity.PostureMeasurement;
import com.relaxit.backend.entity.User;
import com.relaxit.backend.exception.DeviceNotFoundException;
import com.relaxit.backend.repository.DeviceRepository;
import com.relaxit.backend.repository.DeviceSessionRepository;
import com.relaxit.backend.repository.PostureMeasurementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.relaxit.backend.dto.device.DeviceStatisticsDTO;
import com.relaxit.backend.entity.Alert;
import com.relaxit.backend.entity.PostureType;

import java.time.LocalDate;

@Service
@Transactional(readOnly = true)
public class DeviceDataService {

  private final DeviceRepository deviceRepository;
  private final DeviceSessionRepository sessionRepository;
  private final PostureMeasurementRepository postureRepository;
  private final AlertService alertService;
  private final UserService userService;

  public DeviceDataService(
      DeviceRepository deviceRepository,
      DeviceSessionRepository sessionRepository,
      PostureMeasurementRepository postureRepository,
      AlertService alertService,
      UserService userService) {
    this.deviceRepository = deviceRepository;
    this.sessionRepository = sessionRepository;
    this.postureRepository = postureRepository;
    this.alertService = alertService;
    this.userService = userService;
  }

  private Device verifyDeviceOwnership(String userEmail, UUID deviceId) {
    User user = userService.findEntityByEmail(userEmail);
    return deviceRepository.findByIdAndUserId(deviceId, user.getId())
        .orElseThrow(() -> new DeviceNotFoundException("Device not found or access denied"));
  }

  public DeviceStatisticsDTO calculateDeviceStatistics(String userEmail, UUID deviceId, LocalDate date) {
    Device device = verifyDeviceOwnership(userEmail, deviceId);
    LocalDate targetDate = date != null ? date : LocalDate.now();
    LocalDateTime startOfDay = targetDate.atStartOfDay();
    LocalDateTime endOfDay = targetDate.plusDays(1).atStartOfDay();

    List<DeviceSession> sessions = sessionRepository.findByDeviceIdAndStartedAtBetween(device.getId(), startOfDay,
        endOfDay);
    long totalSittingSeconds = sessions.stream()
        .filter(s -> s.getDurationSeconds() != null)
        .mapToLong(DeviceSession::getDurationSeconds)
        .sum();

    List<PostureMeasurement> postures = postureRepository
        .findByDeviceIdAndTimestampBetweenOrderByTimestampDesc(device.getId(), startOfDay, endOfDay);

    double avgScore = postures.stream()
        .mapToInt(PostureMeasurement::getScore)
        .average()
        .orElse(0.0);

    long goodPostureCount = postures.stream()
        .filter(p -> p.getPostureType() == PostureType.GOOD)
        .count();

    long poorPostureCount = postures.size() - goodPostureCount;

    return new DeviceStatisticsDTO(
        targetDate,
        totalSittingSeconds / 60,
        (int) Math.round(avgScore),
        goodPostureCount,
        poorPostureCount,
        sessions.size());
  }

  public Page<Alert> getDeviceAlerts(String userEmail, UUID deviceId, int page, int size) {
    Device device = verifyDeviceOwnership(userEmail, deviceId);
    return alertService.getDeviceAlerts(device.getId(), page, size);
  }

  public Page<SessionResponse> getDeviceSessions(String userEmail, UUID deviceId, int page, int size) {
    Device device = verifyDeviceOwnership(userEmail, deviceId);
    Pageable pageable = PageRequest.of(page, size, Sort.by("startedAt").descending());
    Page<DeviceSession> sessionPage = sessionRepository.findByDeviceId(device.getId(), pageable);
    return sessionPage.map(SessionResponse::fromEntity);
  }

  public SessionResponse getSessionById(String userEmail, UUID deviceId, UUID sessionId) {
    verifyDeviceOwnership(userEmail, deviceId);
    DeviceSession session = sessionRepository.findById(sessionId)
        .orElseThrow(() -> new IllegalArgumentException("Session not found"));

    if (!session.getDevice().getId().equals(deviceId)) {
      throw new IllegalArgumentException("Session does not belong to the requested device");
    }

    return SessionResponse.fromEntity(session);
  }

  public List<PostureResponse> getPostureHistory(String userEmail, UUID deviceId, LocalDateTime from,
      LocalDateTime to) {
    Device device = verifyDeviceOwnership(userEmail, deviceId);
    LocalDateTime end = to != null ? to : LocalDateTime.now();
    LocalDateTime start = from != null ? from : end.minusDays(1);

    List<PostureMeasurement> measurements = postureRepository
        .findByDeviceIdAndTimestampBetweenOrderByTimestampDesc(device.getId(), start, end);

    return measurements.stream()
        .map(PostureResponse::fromEntity)
        .collect(Collectors.toList());
  }

  public Page<PostureResponse> getPaginatedPostureHistory(String userEmail, UUID deviceId, LocalDateTime from,
      LocalDateTime to, int page, int size) {
    Device device = verifyDeviceOwnership(userEmail, deviceId);
    LocalDateTime end = to != null ? to : LocalDateTime.now();
    LocalDateTime start = from != null ? from : end.minusDays(1);

    Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
    Page<PostureMeasurement> pageResult = postureRepository
        .findByDeviceIdAndTimestampBetween(device.getId(), start, end, pageable);

    return pageResult.map(PostureResponse::fromEntity);
  }
}
