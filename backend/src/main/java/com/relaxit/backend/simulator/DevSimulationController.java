package com.relaxit.backend.simulator;

import com.relaxit.backend.entity.Device;
import com.relaxit.backend.repository.DeviceRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dev/simulation")
@Profile({ "dev", "local", "prod", "default" })
public class DevSimulationController {

  private final VirtualDeviceRunner virtualDeviceRunner;
  private final DeviceRepository deviceRepository;
  private final PasswordEncoder passwordEncoder;

  public DevSimulationController(
      VirtualDeviceRunner virtualDeviceRunner,
      DeviceRepository deviceRepository,
      PasswordEncoder passwordEncoder) {
    this.virtualDeviceRunner = virtualDeviceRunner;
    this.deviceRepository = deviceRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public static class StartSimulationRequest {
    private UUID deviceId;
    private String deviceSecret;

    public UUID getDeviceId() {
      return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
      this.deviceId = deviceId;
    }

    public String getDeviceSecret() {
      return deviceSecret;
    }

    public void setDeviceSecret(String deviceSecret) {
      this.deviceSecret = deviceSecret;
    }
  }

  public static class ScenarioRequest {
    private String scenario;

    public String getScenario() {
      return scenario;
    }

    public void setScenario(String scenario) {
      this.scenario = scenario;
    }
  }

  public static class SpeedRequest {
    private double multiplier;

    public double getMultiplier() {
      return multiplier;
    }

    public void setMultiplier(double multiplier) {
      this.multiplier = multiplier;
    }
  }

  @PostMapping("/start")
  public ResponseEntity<Map<String, Object>> startSimulation(
      @RequestBody StartSimulationRequest request,
      HttpServletRequest httpRequest) {

    if (request.getDeviceId() == null) {
      return ResponseEntity.badRequest().body(Map.of("error", "deviceId is required"));
    }

    String baseUrl = httpRequest.getScheme() + "://" + httpRequest.getServerName() + ":" + httpRequest.getServerPort();
    boolean success = virtualDeviceRunner.start(request.getDeviceId(), request.getDeviceSecret(), baseUrl);

    Map<String, Object> response = new HashMap<>();
    response.put("success", success);
    response.put("status", virtualDeviceRunner.getStatus());
    return ResponseEntity.ok(response);
  }

  @PostMapping("/auto-start")
  public ResponseEntity<Map<String, Object>> autoStartSimulation(
      @RequestBody Map<String, String> body,
      HttpServletRequest httpRequest) {

    String deviceIdStr = body.get("deviceId");
    if (deviceIdStr == null || deviceIdStr.isBlank()) {
      return ResponseEntity.badRequest().body(Map.of("error", "deviceId is required"));
    }

    UUID deviceId = UUID.fromString(deviceIdStr);
    Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
    if (deviceOpt.isEmpty()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Device not found"));
    }

    Device device = deviceOpt.get();
    String devSecret = "dev-secret-123456789012345678901234567890";
    device.setDeviceSecretHash(passwordEncoder.encode(devSecret));
    deviceRepository.save(device);

    String baseUrl = httpRequest.getScheme() + "://" + httpRequest.getServerName() + ":" + httpRequest.getServerPort();
    boolean success = virtualDeviceRunner.start(deviceId, devSecret, baseUrl);

    Map<String, Object> response = new HashMap<>();
    response.put("success", success);
    response.put("status", virtualDeviceRunner.getStatus());
    return ResponseEntity.ok(response);
  }

  @PostMapping("/stop")
  public ResponseEntity<Map<String, Object>> stopSimulation() {
    virtualDeviceRunner.stop();
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("status", virtualDeviceRunner.getStatus());
    return ResponseEntity.ok(response);
  }

  @PostMapping("/scenario")
  public ResponseEntity<Map<String, Object>> setScenario(@RequestBody ScenarioRequest request) {
    try {
      ScenarioEngine.Scenario scenario = ScenarioEngine.Scenario.valueOf(request.getScenario().toUpperCase());
      virtualDeviceRunner.setScenario(scenario);
      return ResponseEntity.ok(Map.of("success", true, "scenario", scenario.name()));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", "Invalid scenario: " + request.getScenario()));
    }
  }

  @PostMapping("/speed")
  public ResponseEntity<Map<String, Object>> setSpeed(@RequestBody SpeedRequest request) {
    virtualDeviceRunner.setSpeed(request.getMultiplier());
    return ResponseEntity.ok(Map.of("success", true, "multiplier", request.getMultiplier()));
  }

  @GetMapping("/status")
  public ResponseEntity<Map<String, Object>> getStatus() {
    return ResponseEntity.ok(virtualDeviceRunner.getStatus());
  }
}
