package com.relaxit.backend.service;

import com.relaxit.backend.dto.device.CreateDeviceRequest;
import com.relaxit.backend.dto.device.DeviceResponse;
import com.relaxit.backend.dto.device.ProvisionDeviceResponse;
import com.relaxit.backend.dto.device.UpdateDeviceRequest;
import com.relaxit.backend.entity.Device;
import com.relaxit.backend.entity.User;
import com.relaxit.backend.exception.DeviceAlreadyExistsException;
import com.relaxit.backend.exception.DeviceNotFoundException;
import com.relaxit.backend.repository.DeviceRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DeviceService {

  private final DeviceRepository deviceRepository;
  private final UserService userService;
  private final PasswordEncoder passwordEncoder;

  public DeviceService(DeviceRepository deviceRepository, UserService userService, PasswordEncoder passwordEncoder) {
    this.deviceRepository = deviceRepository;
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public ProvisionDeviceResponse provisionDevice(String userEmail, UUID deviceId) {
    User user = userService.findEntityByEmail(userEmail);
    Device device = deviceRepository.findByIdAndUserId(deviceId, user.getId())
        .orElseThrow(() -> new DeviceNotFoundException("Device not found or access denied"));

    byte[] randomBytes = new byte[32];
    new SecureRandom().nextBytes(randomBytes);
    String rawSecret = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

    device.setDeviceSecretHash(passwordEncoder.encode(rawSecret));
    device.setProvisionedAt(LocalDateTime.now());
    deviceRepository.save(device);

    return new ProvisionDeviceResponse(device.getDeviceIdentifier(), rawSecret, device.getProvisionedAt());
  }

  @Transactional
  public DeviceResponse registerDevice(String userEmail, CreateDeviceRequest request) {
    String identifier = request.getDeviceIdentifier().trim();

    if (deviceRepository.existsByDeviceIdentifier(identifier)) {
      throw new DeviceAlreadyExistsException("Device with identifier '" + identifier + "' is already registered");
    }

    User user = userService.findEntityByEmail(userEmail);
    Device device = new Device(identifier, request.getName().trim(), user);

    Device savedDevice = deviceRepository.save(device);
    return DeviceResponse.fromEntity(savedDevice);
  }

  public List<DeviceResponse> getUserDevices(String userEmail) {
    User user = userService.findEntityByEmail(userEmail);
    List<Device> devices = deviceRepository.findAllByUserId(user.getId());

    return devices.stream()
        .map(DeviceResponse::fromEntity)
        .collect(Collectors.toList());
  }

  public DeviceResponse getDeviceById(String userEmail, UUID deviceId) {
    User user = userService.findEntityByEmail(userEmail);
    Device device = deviceRepository.findByIdAndUserId(deviceId, user.getId())
        .orElseThrow(() -> new DeviceNotFoundException("Device not found or access denied"));

    return DeviceResponse.fromEntity(device);
  }

  @Transactional
  public DeviceResponse updateDevice(String userEmail, UUID deviceId, UpdateDeviceRequest request) {
    User user = userService.findEntityByEmail(userEmail);
    Device device = deviceRepository.findByIdAndUserId(deviceId, user.getId())
        .orElseThrow(() -> new DeviceNotFoundException("Device not found or access denied"));

    device.setName(request.getName().trim());
    Device updatedDevice = deviceRepository.save(device);

    return DeviceResponse.fromEntity(updatedDevice);
  }

  @Transactional
  public void deleteDevice(String userEmail, UUID deviceId) {
    User user = userService.findEntityByEmail(userEmail);
    Device device = deviceRepository.findByIdAndUserId(deviceId, user.getId())
        .orElseThrow(() -> new DeviceNotFoundException("Device not found or access denied"));

    deviceRepository.delete(device);
  }

  public Map<String, Object> getDeviceStatus(String userEmail, UUID deviceId) {
    User user = userService.findEntityByEmail(userEmail);
    Device device = deviceRepository.findByIdAndUserId(deviceId, user.getId())
        .orElseThrow(() -> new DeviceNotFoundException("Device not found or access denied"));

    Map<String, Object> statusMap = new HashMap<>();
    statusMap.put("status", device.getStatus());
    statusMap.put("lastSeenAt", device.getLastSeenAt());

    return statusMap;
  }
}
