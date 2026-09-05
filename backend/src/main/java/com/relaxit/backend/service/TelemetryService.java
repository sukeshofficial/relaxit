package com.relaxit.backend.service;

import com.relaxit.backend.dto.telemetry.SensorReadingDTO;
import com.relaxit.backend.dto.telemetry.TelemetryRequest;
import com.relaxit.backend.dto.telemetry.TelemetryResponse;
import com.relaxit.backend.dto.telemetry.TelemetryValidator;
import com.relaxit.backend.entity.Device;
import com.relaxit.backend.entity.DeviceSession;
import com.relaxit.backend.entity.DeviceStatus;
import com.relaxit.backend.entity.PostureMeasurement;
import com.relaxit.backend.entity.PostureType;
import com.relaxit.backend.entity.SensorMeasurement;
import com.relaxit.backend.entity.SessionStatus;
import com.relaxit.backend.repository.DeviceRepository;
import com.relaxit.backend.repository.DeviceSessionRepository;
import com.relaxit.backend.repository.PostureMeasurementRepository;
import com.relaxit.backend.repository.SensorMeasurementRepository;
import com.relaxit.backend.security.DevicePrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TelemetryService {

  private final DeviceRepository deviceRepository;
  private final DeviceSessionRepository sessionRepository;
  private final SensorMeasurementRepository sensorMeasurementRepository;
  private final PostureMeasurementRepository postureMeasurementRepository;
  private final TelemetryValidator validator;
  private final PostureEvaluator postureEvaluator;

  public TelemetryService(
      DeviceRepository deviceRepository,
      DeviceSessionRepository sessionRepository,
      SensorMeasurementRepository sensorMeasurementRepository,
      PostureMeasurementRepository postureMeasurementRepository,
      TelemetryValidator validator,
      PostureEvaluator postureEvaluator) {
    this.deviceRepository = deviceRepository;
    this.sessionRepository = sessionRepository;
    this.sensorMeasurementRepository = sensorMeasurementRepository;
    this.postureMeasurementRepository = postureMeasurementRepository;
    this.validator = validator;
    this.postureEvaluator = postureEvaluator;
  }

  @Transactional
  public TelemetryResponse processTelemetry(DevicePrincipal principal, TelemetryRequest request) {
    validator.validate(request);

    Device device = deviceRepository.findById(principal.getDeviceId())
        .orElseThrow(() -> new IllegalArgumentException("Device not found"));

    LocalDateTime now = LocalDateTime.now();

    // 1. Device Heartbeat & Status update
    device.setLastSeenAt(now);
    device.setStatus(DeviceStatus.ONLINE);
    deviceRepository.save(device);

    // 2. Evaluate posture
    PostureEvaluator.EvaluationResult evaluation = postureEvaluator.evaluate(request.getReadings());

    // 3. Sitting Session Management
    DeviceSession activeSession = manageSittingSession(device, evaluation.getPostureType(), now);

    // 4. Save Raw Sensor Measurements
    if (request.getReadings() != null) {
      List<SensorMeasurement> measurements = new ArrayList<>();
      for (SensorReadingDTO r : request.getReadings()) {
        measurements.add(new SensorMeasurement(
            device,
            activeSession,
            request.getTimestamp() != null ? request.getTimestamp() : now,
            r.getSensorType(),
            r.getValue(),
            r.getUnit()
        ));
      }
      sensorMeasurementRepository.saveAll(measurements);
    }

    // 5. Save Derived Posture Measurement
    if (evaluation.getPostureType() != PostureType.UNKNOWN) {
      PostureMeasurement postureMeasurement = new PostureMeasurement(
          device,
          activeSession,
          request.getTimestamp() != null ? request.getTimestamp() : now,
          evaluation.getPostureType(),
          evaluation.getScore()
      );
      postureMeasurementRepository.save(postureMeasurement);
    }

    return new TelemetryResponse(
        true,
        activeSession != null ? activeSession.getId() : null,
        evaluation.getPostureType(),
        evaluation.getScore(),
        now
    );
  }

  @Transactional
  public void processHeartbeat(DevicePrincipal principal) {
    Device device = deviceRepository.findById(principal.getDeviceId())
        .orElseThrow(() -> new IllegalArgumentException("Device not found"));

    device.setLastSeenAt(LocalDateTime.now());
    device.setStatus(DeviceStatus.ONLINE);
    deviceRepository.save(device);
  }

  private DeviceSession manageSittingSession(Device device, PostureType postureType, LocalDateTime now) {
    Optional<DeviceSession> activeOpt = sessionRepository.findByDeviceIdAndStatus(device.getId(), SessionStatus.ACTIVE);

    if (postureType != PostureType.UNKNOWN) {
      // User is seated
      if (activeOpt.isPresent()) {
        return activeOpt.get();
      } else {
        // Auto-start new session
        DeviceSession newSession = new DeviceSession(device, device.getUser());
        return sessionRepository.save(newSession);
      }
    } else {
      // User is not seated (UNKNOWN posture)
      if (activeOpt.isPresent()) {
        DeviceSession activeSession = activeOpt.get();
        // Check if session has been inactive/empty for threshold (e.g., immediate end or threshold)
        activeSession.endSession(SessionStatus.COMPLETED);
        return sessionRepository.save(activeSession);
      }
      return null;
    }
  }

  @Transactional
  public void checkAndUpdateOfflineDevices(int offlineThresholdMinutes) {
    LocalDateTime cutoff = LocalDateTime.now().minusMinutes(offlineThresholdMinutes);
    List<Device> onlineDevices = deviceRepository.findAll();
    for (Device dev : onlineDevices) {
      if (dev.getStatus() == DeviceStatus.ONLINE && dev.getLastSeenAt() != null && dev.getLastSeenAt().isBefore(cutoff)) {
        dev.setStatus(DeviceStatus.OFFLINE);
        deviceRepository.save(dev);

        // Also terminate any orphaned active sessions
        Optional<DeviceSession> activeOpt = sessionRepository.findByDeviceIdAndStatus(dev.getId(), SessionStatus.ACTIVE);
        if (activeOpt.isPresent()) {
          DeviceSession s = activeOpt.get();
          s.endSession(SessionStatus.INTERRUPTED);
          sessionRepository.save(s);
        }
      }
    }
  }
}
