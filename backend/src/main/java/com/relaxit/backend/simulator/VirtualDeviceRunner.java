package com.relaxit.backend.simulator;

import com.relaxit.backend.dto.telemetry.TelemetryRequest;
import com.relaxit.backend.entity.Device;
import com.relaxit.backend.repository.DeviceRepository;
import com.relaxit.backend.security.DeviceAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PreDestroy;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Service
@Profile({ "dev", "local" })
public class VirtualDeviceRunner {

  private static final Logger log = LoggerFactory.getLogger(VirtualDeviceRunner.class);

  private final DeviceRepository deviceRepository;
  private final RestTemplate restTemplate;

  private final SimulationState simulationState = new SimulationState();
  private final ScenarioEngine scenarioEngine = new ScenarioEngine();
  private final SensorGenerator sensorGenerator = new SensorGenerator(42L);

  private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
  private ScheduledFuture<?> runningTask;

  private boolean running = false;
  private UUID deviceId;
  private String deviceIdentifier;
  private String deviceSecret;
  private String baseUrl = "http://localhost:8080";
  private double speedMultiplier = 1.0;
  private LocalDateTime simulatedTimestamp = LocalDateTime.now();

  public VirtualDeviceRunner(DeviceRepository deviceRepository) {
    this.deviceRepository = deviceRepository;
    this.restTemplate = new RestTemplate();
  }

  public synchronized boolean start(UUID deviceId, String deviceSecret, String baseUrl) {
    if (running) {
      stop();
    }

    Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
    if (deviceOpt.isEmpty()) {
      log.error("Cannot start virtual device: Device ID {} not found", deviceId);
      return false;
    }

    Device device = deviceOpt.get();
    this.deviceId = deviceId;
    this.deviceIdentifier = device.getDeviceIdentifier();
    this.deviceSecret = deviceSecret;
    if (baseUrl != null && !baseUrl.isBlank()) {
      this.baseUrl = baseUrl;
    }

    this.running = true;
    this.simulatedTimestamp = LocalDateTime.now();
    this.scenarioEngine.setScenario(ScenarioEngine.Scenario.NORMAL_SITTING, simulationState);

    // Schedule tick every 1000ms wall clock time
    runningTask = scheduler.scheduleAtFixedRate(this::tick, 0, 1000, TimeUnit.MILLISECONDS);
    log.info("Virtual Device Runner started for deviceIdentifier: {}", deviceIdentifier);
    return true;
  }

  public synchronized void stop() {
    if (runningTask != null) {
      runningTask.cancel(true);
      runningTask = null;
    }
    this.running = false;
    log.info("Virtual Device Runner stopped for deviceIdentifier: {}", deviceIdentifier);
  }

  public synchronized void setScenario(ScenarioEngine.Scenario scenario) {
    if (running) {
      scenarioEngine.setScenario(scenario, simulationState);
      log.info("Virtual Device Scenario updated to: {}", scenario);
    }
  }

  public synchronized void setSpeed(double multiplier) {
    if (multiplier > 0) {
      this.speedMultiplier = multiplier;
      log.info("Virtual Device Speed multiplier set to: {}x", speedMultiplier);
    }
  }

  public synchronized Map<String, Object> getStatus() {
    return Map.of(
        "running", running,
        "deviceId", deviceId != null ? deviceId : "",
        "deviceIdentifier", deviceIdentifier != null ? deviceIdentifier : "",
        "scenario", scenarioEngine.getCurrentScenario().name(),
        "speedMultiplier", speedMultiplier,
        "simulatedTimestamp", simulatedTimestamp != null ? simulatedTimestamp.toString() : "",
        "batteryLevel", Math.round(simulationState.getBatteryLevel()),
        "temperature", Math.round(simulationState.getTemperature() * 10.0) / 10.0);
  }

  private void tick() {
    try {
      if (!running)
        return;

      double dtSeconds = 1.0 * speedMultiplier;
      simulatedTimestamp = simulatedTimestamp.plusSeconds((long) dtSeconds);

      scenarioEngine.update(dtSeconds, simulationState);

      TelemetryRequest request = sensorGenerator.generateTelemetry(simulationState, simulatedTimestamp);

      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      headers.set(DeviceAuthenticationFilter.HEADER_DEVICE_IDENTIFIER, deviceIdentifier);
      headers.set(DeviceAuthenticationFilter.HEADER_DEVICE_SECRET, deviceSecret);

      HttpEntity<TelemetryRequest> entity = new HttpEntity<>(request, headers);
      String url = baseUrl + "/api/v1/device-telemetry";

      restTemplate.exchange(url, HttpMethod.POST, entity, new ParameterizedTypeReference<Map<String, Object>>() {
      });
    } catch (Exception e) {
      log.warn("Virtual Device telemetry dispatch error: {}", e.getMessage());
    }
  }

  @PreDestroy
  public void cleanup() {
    stop();
    scheduler.shutdown();
  }
}
